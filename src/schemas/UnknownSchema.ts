// IMPORTS
import type { GenericSchema } from '@/schemas/GenericSchema'

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

}
