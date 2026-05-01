/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// IMPORTS
import { GenericSchema } from '@/schemas/GenericSchema'

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

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

}
