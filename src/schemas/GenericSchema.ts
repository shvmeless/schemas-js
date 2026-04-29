// IMPORTS
import { ValidationError } from '@/errors/ValidationError'

// INTERFACE
export class GenericSchema<T> {

  // CONSTRUCTOR
  private constructor() {}

  // STATIC
  public static isValid<T>(schema: GenericSchema<T>, input: unknown): boolean {
    try {
      schema.validate(input)
      return true
    } catch (error) {
      if (error instanceof ValidationError) return false
      else throw error
    }
  }

  // METHOD
  public validate(_input: unknown): T {
    throw new ValidationError(_input, 'Do not use this class directly.')
  }

  // METHOD
  public isValid(_input: unknown): boolean {
    throw new ValidationError(_input, 'Do not use this class directly.')
  }

}
