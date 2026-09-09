/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// IMPORTS
import type { GenericSchema } from '@/lib/GenericSchema'

// CLASS
export class AnySchema implements GenericSchema<any> {

  // CONSTRUCTOR
  private constructor() {}

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): AnySchema {
    return new AnySchema()
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: any): any {
    return input
  }

}
