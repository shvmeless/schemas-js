// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type MapValidations<TKey, TValue> = GenericValidations<'size' | 'min' | 'max' | 'some' | 'every' | 'none', Map<TKey, TValue>>

// INTERFACE
interface MapConfig<TKey, TValue> {
  keySchema: GenericSchema<TKey>
  valueSchema: GenericSchema<TValue>
  prune: boolean
}

// CLASS
export class MapSchema<TKey, TValue> implements GenericSchema<Map<TKey, TValue>> {

  // PROPERTIES
  private readonly _config: MapConfig<TKey, TValue>
  private readonly _validations: MapValidations<TKey, TValue>

  // CONSTRUCTOR
  private constructor(config: MapConfig<TKey, TValue>, validations: MapValidations<TKey, TValue>) {
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TKey, TValue>(keySchema: GenericSchema<TKey>, valueSchema: GenericSchema<TValue>): MapSchema<TKey, TValue> {
    return new MapSchema<TKey, TValue>({
      keySchema: keySchema,
      valueSchema: valueSchema,
      prune: false,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateConfig(config: Partial<MapConfig<TKey, TValue>> = {}): MapSchema<TKey, TValue> {
    return new MapSchema<TKey, TValue>(
      { ...this._config, ...config },
      this._validations,
    )
  }

  // UPDATER
  private updateValidation(validations: MapValidations<TKey, TValue>): MapSchema<TKey, TValue> {
    return new MapSchema<TKey, TValue>(
      this._config,
      { ...this._validations, ...validations },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Map<TKey, TValue> {

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

    return result

  }

  // --------------------------------------------------------------------------

  // METHOD
  public prune(): MapSchema<TKey, TValue> {
    return this.updateConfig({ prune: true })
  }

  // METHOD
  public size(length: number): MapSchema<TKey, TValue> {
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
  public min(length: number): MapSchema<TKey, TValue> {
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
  public max(length: number): MapSchema<TKey, TValue> {
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
  public some(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue> {
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
  public every(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue> {
    return this.updateValidation({
      every: (current, initial) => {
        for (const [key, value] of current) {
          if (!callback(value, key, current)) throw new ValidationError(initial, 'At least one entry does not satisfy the given validation function.')
        }
      },
    })
  }

  // METHOD
  public none(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue> {
    return this.updateValidation({
      none: (current, initial) => {
        for (const [key, value] of current) {
          if (callback(value, key, current)) throw new ValidationError(initial, 'At least one entry satisfies the given validation function.')
        }
      },
    })
  }

}
