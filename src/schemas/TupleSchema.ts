// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { TransformSchema } from '@/schemas/TransformSchema'

// CLASS
export class TupleSchema<T extends ReadonlyArray<unknown>> implements GenericSchema<T> {

  // PROPERTIES
  private readonly _shape: { [K in keyof T]: GenericSchema<T[K]> }
  private readonly _strip: boolean

  // CONSTRUCTOR
  private constructor(shape: { [K in keyof T]: GenericSchema<T[K]> }, strip: boolean) {
    this._shape = [...shape] as unknown as { [K in keyof T]: GenericSchema<T[K]> }
    this._strip = strip
  }

  // CONSTRUCTOR
  public static create<T extends ReadonlyArray<unknown>>(shape: { [K in keyof T]: GenericSchema<T[K]> }): TupleSchema<T> {
    return new TupleSchema(shape, false)
  }

  // METHOD
  public validate(input: unknown): T {

    if (!Array.isArray(input)) {
      throw new ValidationError(input, 'The value must be an array.')
    }

    const result: Array<unknown> = []
    const errors = ValidationError.prepare()

    const longest = Math.max(this._shape.length, input.length)
    for (let index = 0; index < longest; index++) {
      try {

        const value = input[index] as unknown
        const shape = this._shape[index]

        if (shape === undefined) {
          if (this._strip) continue
          throw new ValidationError(value, 'Unexpected element.')
        }

        result[index] = shape.validate(value)

      } catch (error) {
        if (error instanceof ValidationError) errors.add(index, error)
        else throw error
      }
    }

    if (errors.size > 0) {
      const message = (input.length !== this._shape.length)
        ? (input.length < this._shape.length)
            ? 'The tuple is missing one or more required elements.'
            : 'The tuple contains one or more unexpected elements.'
        : 'At least one element does not match the given schema.'
      errors.throw(input, message)
    }

    return result as unknown as T

  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public strip(): TupleSchema<T> {
    return new TupleSchema(this._shape, true)
  }

  // METHOD
  public optional(): OptionalSchema<T, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<T, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<T | NT> {
    return UnionSchema.create(this as GenericSchema<T>, schema)
  }

  // METHOD
  public fallback(value: T): FallbackSchema<T> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: T) => V): TransformSchema<T, V> {
    return TransformSchema.create(this, fn)
  }

}
