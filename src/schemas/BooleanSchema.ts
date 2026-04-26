// IMPORTS
import { GenericSchema } from '@/interfaces'
import { ValidationError } from '@/errors/ValidationError'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'

// CLASS
export class BooleanSchema implements GenericSchema<boolean> {

  // CONSTRUCTOR
  private constructor() {}

  // CONSTRUCTOR
  public static create(): BooleanSchema {
    return new BooleanSchema()
  }

  // METHOD
  public validate(input: unknown): boolean {

    if (typeof input !== 'boolean') {
      throw new ValidationError(input, 'The value must be a boolean.')
    }

    return input
  }

  // METHOD
  public optional(): OptionalSchema<boolean, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<boolean, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<boolean | NT> {
    return UnionSchema.create(this, schema)
  }

  // METHOD
  public fallback(value: boolean): FallbackSchema<boolean> {
    return FallbackSchema.create(this, value)
  }

}
