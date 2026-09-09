// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'

// CLASS
export class NullSchema implements GenericSchema<null> {

  // CONSTRUCTOR
  private constructor() {}

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): NullSchema {
    return new NullSchema()
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): null {

    if (input !== null) {
      throw new ValidationError(input, 'The value must be null.')
    }

    return input
  }

}
