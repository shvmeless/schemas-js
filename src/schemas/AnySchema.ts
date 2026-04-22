/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// IMPORTS
import { GenericSchema } from '@/interfaces'

// CLASS
export class AnySchema implements GenericSchema<any> {

  // CONSTRUCTOR
  private constructor() {}

  // CONSTRUCTOR
  public static create(): AnySchema {
    return new AnySchema()
  }

  // METHOD
  public validate(input: any): any {
    return input
  }

}
