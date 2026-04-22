// IMPORTS
import { GenericSchema } from '@/interfaces'
import { ValidationError } from '@/errors/ValidationError'

// CLASS
export class UndefinedSchema implements GenericSchema<undefined> {

  // CONSTRUCTOR
  private constructor() {}

  // CONSTRUCTOR
  public static create(): UndefinedSchema {
    return new UndefinedSchema()
  }

  // METHOD
  public validate(input: unknown): undefined {

    if (input !== undefined) {
      throw new ValidationError(input, 'The value must be undefined.')
    }

    return input
  }

}
