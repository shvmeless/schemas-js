// IMPORTS
import { GenericSchema } from '@/interfaces'
import { ValidationError, ValidationErrorIndex } from '@/errors/ValidationError'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'

// CLASS
export class RecordSchema<T> implements GenericSchema<Record<string, T>> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>) {
    this._schema = schema
  }

  // CONSTRUCTOR
  public static create<T>(schema: GenericSchema<T>): RecordSchema<T> {
    return new RecordSchema<T>(schema)
  }

  // METHOD
  public validate(input: unknown): Record<string, T> {

    if (typeof input !== 'object' || input === null || Array.isArray(input) || (Object.getPrototypeOf(input) !== Object.prototype && Object.getPrototypeOf(input) !== null)) {
      throw new ValidationError(input, 'The value must be an object.')
    }

    const result: Record<string, T> = {}
    const errors: ValidationErrorIndex = {}

    for (const [key, value] of Object.entries(input)) {
      try {
        result[key] = this._schema.validate(value)
      } catch (error) {
        if (error instanceof ValidationError) errors[key] = error.index ?? error.message
        else throw error
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(input, 'At least one entry does not match the given schema.', errors)
    }

    return result

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
    return UnionSchema.create(this, schema)
  }

  // METHOD
  public fallback(value: Record<string, T>): FallbackSchema<Record<string, T>> {
    return FallbackSchema.create(this, value)
  }

}
