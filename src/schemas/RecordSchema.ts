// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type RecordValidations<TValue> = GenericValidations<'length' | 'min' | 'max' | 'some' | 'every' | 'none', Record<string, TValue>>

// INTERFACE
interface RecordConfig<TValue, TOptional extends boolean, TNullable extends boolean> {
  schema: GenericSchema<TValue>
  prune: boolean
  optional: TOptional
  nullable: TNullable
}

// CLASS
export class RecordSchema<TValue, TOptional extends boolean, TNullable extends boolean>
implements GenericSchema<Maybe<Record<string, TValue>, TOptional, TNullable>> {

  // PROPERTIES
  private readonly _config: RecordConfig<TValue, TOptional, TNullable>
  private readonly _validations: RecordValidations<TValue>

  // CONSTRUCTOR
  private constructor(config: RecordConfig<TValue, TOptional, TNullable>, validations: RecordValidations<TValue>) {
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue>(schema: GenericSchema<TValue>): RecordSchema<TValue, false, false> {
    return new RecordSchema<TValue, false, false>({
      schema: schema,
      prune: false,
      optional: false,
      nullable: false,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateConfig(config: Partial<RecordConfig<TValue, TOptional, TNullable>> = {}): RecordSchema<TValue, TOptional, TNullable> {
    return new RecordSchema<TValue, TOptional, TNullable>(
      { ...this._config, ...config },
      this._validations,
    )
  }

  // UPDATER
  private updateValidation(validations: RecordValidations<TValue>): RecordSchema<TValue, TOptional, TNullable> {
    return new RecordSchema<TValue, TOptional, TNullable>(
      this._config,
      { ...this._validations, ...validations },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<Record<string, TValue>, TOptional, TNullable> {

    if (input === undefined && this._config.optional) return input as Maybe<Record<string, TValue>, TOptional, TNullable>
    if (input === null && this._config.nullable) return input as Maybe<Record<string, TValue>, TOptional, TNullable>

    if (typeof input !== 'object' || input === null || Array.isArray(input) || (Object.getPrototypeOf(input) !== Object.prototype && Object.getPrototypeOf(input) !== null)) {
      throw new ValidationError(input, 'The value must be an object.')
    }

    const result: Record<string, TValue> = {}
    const errors = ValidationError.prepare()

    for (const [key, value] of Object.entries(input)) {
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

    return result as Maybe<Record<string, TValue>, TOptional, TNullable>

  }

  // --------------------------------------------------------------------------

  // METHOD
  public prune(): RecordSchema<TValue, TOptional, TNullable> {
    return this.updateConfig({ prune: true })
  }

  // CONFIG
  public optional(): RecordSchema<TValue, true, TNullable> {
    return new RecordSchema({
      ...this._config,
      optional: true,
    }, this._validations)
  }

  // CONFIG
  public nullable(): RecordSchema<TValue, TOptional, true> {
    return new RecordSchema({
      ...this._config,
      nullable: true,
    }, this._validations)
  }

  // METHOD
  public length(length: number): RecordSchema<TValue, TOptional, TNullable> {
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
  public min(length: number): RecordSchema<TValue, TOptional, TNullable> {
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
  public max(length: number): RecordSchema<TValue, TOptional, TNullable> {
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
  public some(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue, TOptional, TNullable> {
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
  public every(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue, TOptional, TNullable> {
    return this.updateValidation({
      every: (current, initial) => {
        for (const [key, value] of Object.entries(current)) {
          if (!callback(value, key, current)) throw new ValidationError(initial, 'At least one entry does not satisfy the given validation function.')
        }
      },
    })
  }

  // METHOD
  public none(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue, TOptional, TNullable> {
    return this.updateValidation({
      none: (current, initial) => {
        for (const [key, value] of Object.entries(current)) {
          if (callback(value, key, current)) throw new ValidationError(initial, 'At least one entry satisfies the given validation function.')
        }
      },
    })
  }

}
