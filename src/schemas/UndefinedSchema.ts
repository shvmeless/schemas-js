// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'

// CLASS
export class UndefinedSchema implements GenericSchema<undefined> {

  // CONSTRUCTOR
  private constructor() {}

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UndefinedSchema {
    return new UndefinedSchema()
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): undefined {

    if (input !== undefined) {
      throw new ValidationError(input, 'The value must be undefined.')
    }

    return input
  }

}
