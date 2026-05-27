// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { TransformSchema } from '@/schemas/TransformSchema'
import { stringify } from '@/utils/stringify'

// CLASS
export class RecordSchema<T> implements GenericSchema<Record<string, T>> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>
  private readonly _queue: Array<(original: Record<string, T>, output: Record<string, T>) => Record<string, T>>

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>, queue: Array<(original: Record<string, T>, output: Record<string, T>) => Record<string, T>>) {
    this._schema = schema
    this._queue = queue
  }

  // CONSTRUCTOR
  public static create<T>(schema: GenericSchema<T>): RecordSchema<T> {
    return new RecordSchema<T>(schema, [])
  }

  // CONSTRUCTOR
  private push(fn: (original: Record<string, T>, output: Record<string, T>) => Record<string, T>): RecordSchema<T> {
    return new RecordSchema<T>(this._schema, [...this._queue, fn])
  }

  // METHOD
  public validate(input: unknown): Record<string, T> {

    if (typeof input !== 'object' || input === null || Array.isArray(input) || (Object.getPrototypeOf(input) !== Object.prototype && Object.getPrototypeOf(input) !== null)) {
      throw new ValidationError(input, 'The value must be an object.')
    }

    let result: Record<string, T> = {}
    const errors = ValidationError.prepare()

    for (const [key, value] of Object.entries(input)) {
      try {
        result[key] = this._schema.validate(value)
      } catch (error) {
        if (error instanceof ValidationError) errors.add(key, error)
        else throw error
      }
    }

    if (errors.size > 0) {
      errors.throw(input, 'At least one entry does not match the given schema.')
    }

    for (const fn of this._queue) {
      result = fn(input as Record<string, T>, result)
    }

    return result

  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public optional(): OptionalSchema<Record<string, T>, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<Record<string, T>, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<Record<string, T> | NT> {
    return UnionSchema.create(this as GenericSchema<Record<string, T>>, schema)
  }

  // METHOD
  public fallback(value: Record<string, T>): FallbackSchema<Record<string, T>> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: Record<string, T>) => V): TransformSchema<Record<string, T>, V> {
    return TransformSchema.create(this, fn)
  }

  // METHOD
  public length(length: number): RecordSchema<T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (Object.entries(output).length !== length) throw new ValidationError(original, `The value must be ${stringify(length)} elements long.`)
      return output
    })
  }

}
