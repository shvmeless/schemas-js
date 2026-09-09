// IMPORTS
import type { GenericSchema } from '@/lib/GenericSchema'

// CLASS
export class UnknownSchema implements GenericSchema<unknown> {

  // CONSTRUCTOR
  private constructor() {}

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UnknownSchema {
    return new UnknownSchema()
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): unknown {
    return input
  }

}
