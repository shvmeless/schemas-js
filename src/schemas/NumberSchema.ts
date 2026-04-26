// IMPORTS
import { GenericSchema } from '@/interfaces'
import { ValidationError } from '@/errors/ValidationError'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'

// CLASS
export class NumberSchema implements GenericSchema<number> {

  // CONSTRUCTOR
  private constructor() {}

  // CONSTRUCTOR
  public static create(): NumberSchema {
    return new NumberSchema()
  }

  // METHOD
  public validate(input: unknown): number {

    if (typeof input !== 'number') {
      throw new ValidationError(input, 'The value must be a number.')
    }

    return input
  }

  // METHOD
  public optional(): OptionalSchema<number, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<number, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<number | NT> {
    return UnionSchema.create(this, schema)
  }

  // METHOD
  public fallback(value: number): FallbackSchema<number> {
    return FallbackSchema.create(this, value)
  }

}
