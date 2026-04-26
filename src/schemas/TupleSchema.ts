// IMPORTS
import { GenericSchema } from '@/common'
import { ValidationError, ValidationErrorIndex } from '@/errors/ValidationError'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { TransformSchema } from '@/schemas/TransformSchema'

// CLASS
export class TupleSchema<T extends ReadonlyArray<unknown>> implements GenericSchema<T> {

  // PROPERTIES
  private readonly _shape: { [K in keyof T]: GenericSchema<T[K]> }

  // CONSTRUCTOR
  private constructor(shape: { [K in keyof T]: GenericSchema<T[K]> }) {
    this._shape = [...shape] as unknown as { [K in keyof T]: GenericSchema<T[K]> }
  }

  // CONSTRUCTOR
  public static create<T extends ReadonlyArray<unknown>>(shape: { [K in keyof T]: GenericSchema<T[K]> }): TupleSchema<T> {
    return new TupleSchema(shape)
  }

  // METHOD
  public validate(input: unknown): T {

    if (!Array.isArray(input)) {
      throw new ValidationError(input, 'The value must be an array.')
    }

    const result: Array<unknown> = []
    const errors: ValidationErrorIndex = {}

    const longest = Math.max(this._shape.length, input.length)
    for (let index = 0; index < longest; index++) {
      try {

        const shape = this._shape[index]
        if (shape === undefined) {
          throw new ValidationError(input, 'Unexpected element.')
        }

        result[index] = shape.validate(input[index])

      } catch (error) {
        if (error instanceof ValidationError) errors[index] = error.index ?? error.message
        else throw error
      }
    }

    if (Object.keys(errors).length > 0) {
      const message = (input.length !== this._shape.length)
        ? (input.length < this._shape.length)
            ? 'The tuple is missing one or more required elements.'
            : 'The tuple contains one or more unexpected elements.'
        : 'At least one element does not match the given schema.'
      throw new ValidationError(input, message, errors)
    }

    return result as unknown as T

  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
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
