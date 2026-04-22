// IMPORTS
import { GenericSchema } from '@/interfaces'
import { ValidationError } from '@/errors/ValidationError'

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

}
