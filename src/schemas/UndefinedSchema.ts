// IMPORTS
import { GenericSchema } from '@/interfaces'
import { ValidationError } from '@/errors/ValidationError'
import { NullableSchema } from '@/schemas/NullableSchema'

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

  // METHOD
  public nullable(): NullableSchema<undefined, null> {
    return NullableSchema.create(this)
  }

}
