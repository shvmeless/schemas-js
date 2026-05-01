// IMPORTS
import { GenericSchema } from '@/schemas/GenericSchema'

// CLASS
export class UnknownSchema implements GenericSchema<unknown> {

  // CONSTRUCTOR
  private constructor() {}

  // CONSTRUCTOR
  public static create(): UnknownSchema {
    return new UnknownSchema()
  }

  // METHOD
  public validate(input: unknown): unknown {
    return input
  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

}
