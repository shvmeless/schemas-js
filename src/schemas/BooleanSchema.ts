// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'

// CLASS
export class BooleanSchema implements GenericSchema<boolean> {

  // CONSTRUCTOR
  private constructor() {}

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): BooleanSchema {
    return new BooleanSchema()
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): boolean {

    if (typeof input !== 'boolean') {
      throw new ValidationError(input, 'The value must be a boolean.')
    }

    return input
  }

}
