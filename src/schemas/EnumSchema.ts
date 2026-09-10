// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'

// CLASS
export class EnumSchema<T extends string | number = never> implements GenericSchema<T> {

  // PROPERTIES
  private readonly _values: ReadonlyArray<T>

  // CONSTRUCTOR
  private constructor(...values: ReadonlyArray<T>) {
    this._values = values
    if (this._values.length === 0) {
      throw new Error('Must provide at least one literal value.')
    }
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<T extends string | number = never>(...values: ReadonlyArray<T>): EnumSchema<T> {
    return new EnumSchema(...values)
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): T {

    if (!this._values.includes(input as T)) {
      throw new ValidationError(input, 'The value must be match one of the allowed literal values.')
    }

    return input as T

  }

}
