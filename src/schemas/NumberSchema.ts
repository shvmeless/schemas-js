// IMPORTS
import { GenericSchema } from '@/interfaces'
import { ValidationError } from '@/errors/ValidationError'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'

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

}
