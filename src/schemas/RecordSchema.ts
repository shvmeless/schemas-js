// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type RecordValidations<TValue> = GenericValidations<'length' | 'min' | 'max' | 'some' | 'every' | 'none', Record<string, TValue>>

// INTERFACE
interface RecordConfig<TValue, TOptional extends boolean, TNullable extends boolean, TDefault extends Record<string, TValue> | null> {
  schema: GenericSchema<TValue>
  prune: boolean
  optional: TOptional
  nullable: TNullable
  default: TDefault
  fallback: Record<string, TValue> | null
}

// CLASS
export class RecordSchema<TValue, TOptional extends boolean, TNullable extends boolean, TDefault extends Record<string, TValue> | null>
implements GenericSchema<Maybe<Record<string, TValue>, TOptional, TNullable, TDefault>> {

  // PROPERTIES
  private readonly _config: RecordConfig<TValue, TOptional, TNullable, TDefault>
  private readonly _validations: RecordValidations<TValue>

  // CONSTRUCTOR
  private constructor(config: RecordConfig<TValue, TOptional, TNullable, TDefault>, validations: RecordValidations<TValue>) {
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue>(schema: GenericSchema<TValue>): RecordSchema<TValue, false, false, null> {
    return new RecordSchema<TValue, false, false, null>({
      schema: schema,
      prune: false,
      optional: false,
      nullable: false,
      default: null,
      fallback: null,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateConfig(config: Partial<RecordConfig<TValue, TOptional, TNullable, TDefault>> = {}): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return new RecordSchema<TValue, TOptional, TNullable, TDefault>(
      { ...this._config, ...config },
      this._validations,
    )
  }

  // UPDATER
  private updateValidation(validations: RecordValidations<TValue>): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return new RecordSchema<TValue, TOptional, TNullable, TDefault>(
      this._config,
      { ...this._validations, ...validations },
    )
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _resolveInput(input: unknown): Record<string, unknown> | null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    if (typeof input !== 'object' || input === null || Array.isArray(input) || (Object.getPrototypeOf(input) !== Object.prototype && Object.getPrototypeOf(input) !== null)) {
      throw new ValidationError(input, 'The value must be an object.')
    }

    return input as Record<string, unknown>

  }

  // VALIDATOR
  public validate(input: unknown): Maybe<Record<string, TValue>, TOptional, TNullable, TDefault> {
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Maybe<Record<string, TValue>, TOptional, TNullable, TDefault>
      if (resolved === null) return null as Maybe<Record<string, TValue>, TOptional, TNullable, TDefault>

      const result: Record<string, TValue> = {}
      const errors = ValidationError.prepare()

      for (const [key, value] of Object.entries(resolved)) {
        try {
          result[key] = this._config.schema.validate(value)
        } catch (error) {
          if (error instanceof ValidationError) {
            if (this._config.prune) continue
            errors.add(key, error)
          } else throw error
        }
      }

      if (errors.size > 0) {
        errors.throw(input, 'At least one entry does not match the given schema.')
      }

      runValidations(this._validations, input, result)

      return result as Maybe<Record<string, TValue>, TOptional, TNullable, TDefault>

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public prune(): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this.updateConfig({ prune: true })
  }

  // CONFIG
  public optional(): RecordSchema<TValue, true, TNullable, TDefault> {
    return new RecordSchema({
      ...this._config,
      optional: true,
    }, this._validations)
  }

  // CONFIG
  public nullable(): RecordSchema<TValue, TOptional, true, TDefault> {
    return new RecordSchema({
      ...this._config,
      nullable: true,
    }, this._validations)
  }

  // CONFIG
  public default(value: Record<string, TValue>): RecordSchema<TValue, TOptional, TNullable, Record<string, TValue>> {
    return new RecordSchema({
      ...this._config,
      default: value,
    }, this._validations)
  }

  // CONFIG
  public fallback(value: Record<string, TValue>): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return new RecordSchema({
      ...this._config,
      fallback: value,
    }, this._validations)
  }

  // --------------------------------------------------------------------------

  // METHOD
  public length(length: number): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      min: undefined,
      max: undefined,
      length: (current, initial) => {
        if (Object.entries(current).length === length) return
        throw new ValidationError(initial, `The value must be ${stringify(length)} entries long.`)
      },
    })
  }

  // METHOD
  public min(length: number): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      min: (current, initial) => {
        if (Object.entries(current).length >= length) return
        throw new ValidationError(initial, `The value must be at least ${stringify(length)} entries long.`)
      },
    })
  }

  // METHOD
  public max(length: number): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      max: (current, initial) => {
        if (Object.entries(current).length <= length) return
        throw new ValidationError(initial, `The value must be at most ${stringify(length)} entries long.`)
      },
    })
  }

  // METHOD
  public some(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this.updateValidation({
      some: (current, initial) => {
        for (const [key, value] of Object.entries(current)) {
          if (callback(value, key, current)) return
        }
        throw new ValidationError(initial, 'No entry satisfies the given validation function.')
      },
    })
  }

  // METHOD
  public every(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this.updateValidation({
      every: (current, initial) => {
        for (const [key, value] of Object.entries(current)) {
          if (!callback(value, key, current)) throw new ValidationError(initial, 'At least one entry does not satisfy the given validation function.')
        }
      },
    })
  }

  // METHOD
  public none(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this.updateValidation({
      none: (current, initial) => {
        for (const [key, value] of Object.entries(current)) {
          if (callback(value, key, current)) throw new ValidationError(initial, 'At least one entry satisfies the given validation function.')
        }
      },
    })
  }

}
