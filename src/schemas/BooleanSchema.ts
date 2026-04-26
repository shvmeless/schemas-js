// IMPORTS
import { GenericSchema } from '@/interfaces'
import { ValidationError } from '@/errors/ValidationError'
import { OptionalSchema } from '@/schemas/OptionalSchema'

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

}
