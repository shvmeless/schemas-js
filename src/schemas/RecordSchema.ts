// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'
import { stringify } from '@/utils/stringify'

// CLASS
export class RecordSchema<T> implements GenericSchema<Record<string, T>> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>
  private readonly _validations: Array<(initial: Record<string, T>, current: Record<string, T>) => undefined>
  private readonly _prune: boolean

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>, validations: Array<(initial: Record<string, T>, current: Record<string, T>) => undefined>, prune: boolean) {
    this._schema = schema
    this._validations = validations
    this._prune = prune
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<T>(schema: GenericSchema<T>): RecordSchema<T> {
    return new RecordSchema<T>(schema, [], false)
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private clone(params: {
    schema?: GenericSchema<T>
    validations?: Array<(initial: Record<string, T>, current: Record<string, T>) => undefined>
    prune?: boolean
  } = {}): RecordSchema<T> {
    return new RecordSchema<T>(
      params.schema ?? this._schema,
      params.validations ?? this._validations,
      params.prune ?? this._prune,
    )
  }

  // UPDATER
  private push(fn: (initial: Record<string, T>, current: Record<string, T>) => undefined): RecordSchema<T> {
    return new RecordSchema<T>(this._schema, [...this._validations, fn], this._prune)
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Record<string, T> {

    if (typeof input !== 'object' || input === null || Array.isArray(input) || (Object.getPrototypeOf(input) !== Object.prototype && Object.getPrototypeOf(input) !== null)) {
      throw new ValidationError(input, 'The value must be an object.')
    }

    const result: Record<string, T> = {}
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

    for (const fn of this._validations) {
      fn(input as Record<string, T>, result)
    }

    return result

  }

  // --------------------------------------------------------------------------

  // METHOD
  public prune(): RecordSchema<T> {
    return this.clone({ prune: true })
  }

  // METHOD
  public length(length: number): RecordSchema<T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (Object.entries(current).length !== length) throw new ValidationError(initial, `The value must be ${stringify(length)} entries long.`)
    })
  }

  // METHOD
  public min(length: number): RecordSchema<T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (Object.entries(current).length < length) throw new ValidationError(initial, `The value must be at least ${stringify(length)} entries long.`)
    })
  }

  // METHOD
  public max(length: number): RecordSchema<T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (Object.entries(current).length > length) throw new ValidationError(initial, `The value must be at most ${stringify(length)} entries long.`)
    })
  }

  // METHOD
  public some(callback: (value: T, key: string, record: Record<string, T>) => boolean): RecordSchema<T> {
    return this.push((initial, current) => {
      for (const [key, value] of Object.entries(current)) {
        if (callback(value, key, current)) return
      }
      throw new ValidationError(initial, 'No entry satisfies the given validation function.')
    })
  }

  // METHOD
  public every(callback: (value: T, key: string, record: Record<string, T>) => boolean): RecordSchema<T> {
    return this.push((initial, current) => {
      for (const [key, value] of Object.entries(current)) {
        if (!callback(value, key, current)) throw new ValidationError(initial, 'At least one entry does not satisfy the given validation function.')
      }
    })
  }

  // METHOD
  public none(callback: (value: T, key: string, record: Record<string, T>) => boolean): RecordSchema<T> {
    return this.push((initial, current) => {
      for (const [key, value] of Object.entries(current)) {
        if (callback(value, key, current)) throw new ValidationError(initial, 'At least one entry satisfies the given validation function.')
      }
    })
  }

}
