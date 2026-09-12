// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type MapValidations<TKey, TValue> = GenericValidations<'size' | 'min' | 'max' | 'some' | 'every' | 'none', Map<TKey, TValue>>

// INTERFACE
interface MapConfig<TKey, TValue, TOptional extends boolean, TNullable extends boolean> {
  keySchema: GenericSchema<TKey>
  valueSchema: GenericSchema<TValue>
  prune: boolean
  optional: TOptional
  nullable: TNullable
}

// CLASS
export class MapSchema<TKey, TValue, TOptional extends boolean, TNullable extends boolean>
implements GenericSchema<Maybe<Map<TKey, TValue>, TOptional, TNullable>> {

  // PROPERTIES
  private readonly _config: MapConfig<TKey, TValue, TOptional, TNullable>
  private readonly _validations: MapValidations<TKey, TValue>

  // CONSTRUCTOR
  private constructor(config: MapConfig<TKey, TValue, TOptional, TNullable>, validations: MapValidations<TKey, TValue>) {
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TKey, TValue>(keySchema: GenericSchema<TKey>, valueSchema: GenericSchema<TValue>): MapSchema<TKey, TValue, false, false> {
    return new MapSchema<TKey, TValue, false, false>({
      keySchema: keySchema,
      valueSchema: valueSchema,
      prune: false,
      optional: false,
      nullable: false,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateConfig(config: Partial<MapConfig<TKey, TValue, TOptional, TNullable>> = {}): MapSchema<TKey, TValue, TOptional, TNullable> {
    return new MapSchema<TKey, TValue, TOptional, TNullable>(
      { ...this._config, ...config },
      this._validations,
    )
  }

  // UPDATER
  private updateValidation(validations: MapValidations<TKey, TValue>): MapSchema<TKey, TValue, TOptional, TNullable> {
    return new MapSchema<TKey, TValue, TOptional, TNullable>(
      this._config,
      { ...this._validations, ...validations },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<Map<TKey, TValue>, TOptional, TNullable> {

    if (input === undefined && this._config.optional) return input as Maybe<Map<TKey, TValue>, TOptional, TNullable>
    if (input === null && this._config.nullable) return input as Maybe<Map<TKey, TValue>, TOptional, TNullable>

    if (!(input instanceof Map)) {
      throw new ValidationError(input, 'The value must be a Map.')
    }

    const result = new Map<TKey, TValue>()
    const errors = ValidationError.prepare()

    input.forEach((value: unknown, key: unknown) => {
      try {
        const validatedKey = this._config.keySchema.validate(key)
        const validatedValue = this._config.valueSchema.validate(value)
        result.set(validatedKey, validatedValue)
      } catch (error) {
        if (error instanceof ValidationError) {
          if (this._config.prune) return
          errors.add(key, error)
        } else throw error
      }
    })

    if (errors.size > 0) {
      errors.throw(input, 'At least one entry does not match the given schema.')
    }

    runValidations(this._validations, input, result)

    return result as Maybe<Map<TKey, TValue>, TOptional, TNullable>

  }

  // --------------------------------------------------------------------------

  // METHOD
  public prune(): MapSchema<TKey, TValue, TOptional, TNullable> {
    return this.updateConfig({ prune: true })
  }

  // CONFIG
  public optional(): MapSchema<TKey, TValue, true, TNullable> {
    return new MapSchema({
      ...this._config,
      optional: true,
    }, this._validations)
  }

  // CONFIG
  public nullable(): MapSchema<TKey, TValue, TOptional, true> {
    return new MapSchema({
      ...this._config,
      nullable: true,
    }, this._validations)
  }

  // METHOD
  public size(length: number): MapSchema<TKey, TValue, TOptional, TNullable> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      min: undefined,
      max: undefined,
      size: (current, initial) => {
        if (current.size === length) return
        throw new ValidationError(initial, `The value must be ${stringify(length)} entries long.`)
      },
    })
  }

  // METHOD
  public min(length: number): MapSchema<TKey, TValue, TOptional, TNullable> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      min: (current, initial) => {
        if (current.size >= length) return
        throw new ValidationError(initial, `The value must be at least ${stringify(length)} entries long.`)
      },
    })
  }

  // METHOD
  public max(length: number): MapSchema<TKey, TValue, TOptional, TNullable> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      max: (current, initial) => {
        if (current.size <= length) return
        throw new ValidationError(initial, `The value must be at most ${stringify(length)} entries long.`)
      },
    })
  }

  // METHOD
  public some(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue, TOptional, TNullable> {
    return this.updateValidation({
      some: (current, initial) => {
        for (const [key, value] of current) {
          if (callback(value, key, current)) return
        }
        throw new ValidationError(initial, 'No entry satisfies the given validation function.')
      },
    })
  }

  // METHOD
  public every(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue, TOptional, TNullable> {
    return this.updateValidation({
      every: (current, initial) => {
        for (const [key, value] of current) {
          if (!callback(value, key, current)) throw new ValidationError(initial, 'At least one entry does not satisfy the given validation function.')
        }
      },
    })
  }

  // METHOD
  public none(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue, TOptional, TNullable> {
    return this.updateValidation({
      none: (current, initial) => {
        for (const [key, value] of current) {
          if (callback(value, key, current)) throw new ValidationError(initial, 'At least one entry satisfies the given validation function.')
        }
      },
    })
  }

}
