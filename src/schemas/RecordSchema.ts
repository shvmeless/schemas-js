// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type RecordValidations<TValue> = GenericValidations<'length' | 'min' | 'max' | 'some' | 'every' | 'none', Record<string, TValue>>

// CLASS
export class RecordSchema<TValue> implements GenericSchema<Record<string, TValue>> {

  // PROPERTIES
  private readonly _schema: GenericSchema<TValue>
  private readonly _validations: RecordValidations<TValue>
  private readonly _prune: boolean

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<TValue>, validations: RecordValidations<TValue>, prune: boolean) {
    this._schema = schema
    this._validations = validations
    this._prune = prune
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue>(schema: GenericSchema<TValue>): RecordSchema<TValue> {
    return new RecordSchema<TValue>(schema, {}, false)
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private clone(params: {
    schema?: GenericSchema<TValue>
    validations?: RecordValidations<TValue>
    prune?: boolean
  } = {}): RecordSchema<TValue> {
    return new RecordSchema<TValue>(
      params.schema ?? this._schema,
      params.validations ?? this._validations,
      params.prune ?? this._prune,
    )
  }

  // UPDATER
  private updateValidation(validations: RecordValidations<TValue>): RecordSchema<TValue> {
    return new RecordSchema<TValue>(this._schema, { ...this._validations, ...validations }, this._prune)
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Record<string, TValue> {

    if (typeof input !== 'object' || input === null || Array.isArray(input) || (Object.getPrototypeOf(input) !== Object.prototype && Object.getPrototypeOf(input) !== null)) {
      throw new ValidationError(input, 'The value must be an object.')
    }

    const result: Record<string, TValue> = {}
    const errors = ValidationError.prepare()

    for (const [key, value] of Object.entries(input)) {
      try {
        result[key] = this._schema.validate(value)
      } catch (error) {
        if (error instanceof ValidationError) {
          if (this._prune) continue
          errors.add(key, error)
        } else throw error
      }
    }

    if (errors.size > 0) {
      errors.throw(input, 'At least one entry does not match the given schema.')
    }

    runValidations(this._validations, input, result)

    return result

  }

  // --------------------------------------------------------------------------

  // METHOD
  public prune(): RecordSchema<TValue> {
    return this.clone({ prune: true })
  }

  // METHOD
  public length(length: number): RecordSchema<TValue> {
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
  public min(length: number): RecordSchema<TValue> {
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
  public max(length: number): RecordSchema<TValue> {
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
  public some(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue> {
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
  public every(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue> {
    return this.updateValidation({
      every: (current, initial) => {
        for (const [key, value] of Object.entries(current)) {
          if (!callback(value, key, current)) throw new ValidationError(initial, 'At least one entry does not satisfy the given validation function.')
        }
      },
    })
  }

  // METHOD
  public none(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue> {
    return this.updateValidation({
      none: (current, initial) => {
        for (const [key, value] of Object.entries(current)) {
          if (callback(value, key, current)) throw new ValidationError(initial, 'At least one entry satisfies the given validation function.')
        }
      },
    })
  }

}
