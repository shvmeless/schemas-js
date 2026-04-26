// IMPORTS
import { GenericSchema } from '@/interfaces'
import { ValidationError } from '@/errors/ValidationError'
import { OptionalSchema } from '@/schemas/OptionalSchema'

// CLASS
export class NullSchema implements GenericSchema<null> {

  // CONSTRUCTOR
  private constructor() {}

  // CONSTRUCTOR
  public static create(): NullSchema {
    return new NullSchema()
  }

  // METHOD
  public validate(input: unknown): null {

    if (input !== null) {
      throw new ValidationError(input, 'The value must be null.')
    }

    return input
  }

  // METHOD
  public optional(): OptionalSchema<null, undefined> {
    return OptionalSchema.create(this)
  }

}
