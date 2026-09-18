// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import type { GenericSchema, GenericValidations } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'
import { stringify } from '@/utils/stringify'

// TYPE
type MapValidations<TKey, TValue> = GenericValidations<'size' | 'min' | 'max' | 'some' | 'every' | 'none', Map<TKey, TValue>>

// INTERFACE
interface MapConfig<TKey, TValue> extends NullishConfig<Map<TKey, TValue>> {
  keySchema: GenericSchema<TKey>
  valueSchema: GenericSchema<TValue>
  prune: boolean
}

// CLASS
export class MapSchema<TKey, TValue, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<Map<TKey, TValue>, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: MapConfig<TKey, TValue>
  protected readonly _validations: MapValidations<TKey, TValue>

  // CONSTRUCTOR
  private constructor(config: MapConfig<TKey, TValue>, validations: MapValidations<TKey, TValue>) {
    super()
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TKey, TValue>(keySchema: GenericSchema<TKey>, valueSchema: GenericSchema<TValue>): MapSchema<TKey, TValue, false, false, false> {
    return new MapSchema<TKey, TValue, false, false, false>({
      keySchema: keySchema,
      valueSchema: valueSchema,
      prune: false,
      optional: false,
      nullable: false,
      default: undefined,
      fallback: undefined,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateValidation(validations: MapValidations<TKey, TValue>): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return new MapSchema<TKey, TValue, TOptional, TNullable, TDefault>(
      this._config,
      { ...this._validations, ...validations },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<Map<TKey, TValue>, TOptional, TNullable, TDefault> {
    return this.validateSchema((current) => {

      if (!(current instanceof Map)) {
        throw new ValidationError(input, 'The value must be a Map.')
      }

      const resolved = current as Map<unknown, unknown>
      const result = new Map<TKey, TValue>()
      const errors = ValidationError.prepare()

      resolved.forEach((value: unknown, key: unknown) => {
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

      return result

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public prune(): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return new MapSchema({
      ...this._config,
      prune: true,
    }, this._validations)
  }

  // CONFIG
  public optional(): MapSchema<TKey, TValue, true, TNullable, TDefault> {
    return new MapSchema({
      ...this._config,
      optional: true,
    }, this._validations)
  }

  // CONFIG
  public nullable(): MapSchema<TKey, TValue, TOptional, true, TDefault> {
    return new MapSchema({
      ...this._config,
      nullable: true,
    }, this._validations)
  }

  // CONFIG
  public default(value: Map<TKey, TValue>): MapSchema<TKey, TValue, TOptional, TNullable, true> {
    return new MapSchema({
      ...this._config,
      default: value,
    }, this._validations)
  }

  // CONFIG
  public fallback(value: Map<TKey, TValue>): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return new MapSchema({
      ...this._config,
      fallback: value,
    }, this._validations)
  }

  // --------------------------------------------------------------------------

  // METHOD
  public size(length: number): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
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
  public min(length: number): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
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
  public max(length: number): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
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
  public some(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
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
  public every(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return this.updateValidation({
      every: (current, initial) => {
        for (const [key, value] of current) {
          if (!callback(value, key, current)) throw new ValidationError(initial, 'At least one entry does not satisfy the given validation function.')
        }
      },
    })
  }

  // METHOD
  public none(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return this.updateValidation({
      none: (current, initial) => {
        for (const [key, value] of current) {
          if (callback(value, key, current)) throw new ValidationError(initial, 'At least one entry satisfies the given validation function.')
        }
      },
    })
  }

}
