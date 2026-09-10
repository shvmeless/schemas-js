// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'

// CLASS
export class EnumSchema<TValue extends string | number = never> implements GenericSchema<TValue> {

  // PROPERTIES
  private readonly _values: ReadonlyArray<TValue>

  // CONSTRUCTOR
  private constructor(...values: ReadonlyArray<TValue>) {
    this._values = values
    if (this._values.length === 0) {
      throw new Error('Must provide at least one literal value.')
    }
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue extends string | number = never>(...values: ReadonlyArray<TValue>): EnumSchema<TValue> {
    return new EnumSchema(...values)
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): TValue {

    if (!this._values.includes(input as TValue)) {
      throw new ValidationError(input, 'The value must be match one of the allowed literal values.')
    }

    return input as TValue

  }

}
