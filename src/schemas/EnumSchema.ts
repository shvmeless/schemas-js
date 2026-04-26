// IMPORTS
import { GenericSchema } from '@/interfaces'
import { ValidationError } from '@/errors/ValidationError'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'

// CLASS
export class EnumSchema<T extends string | number> implements GenericSchema<T> {

  // PROPERTIES
  private readonly _values: ReadonlyArray<T>

  // CONSTRUCTOR
  private constructor(...values: ReadonlyArray<T>) {
    this._values = values
    if (this._values.length === 0) {
      throw new Error('Must provide at least one value.')
    }
  }

  // CONSTRUCTOR
  public static create<T extends string | number>(...values: ReadonlyArray<T>): EnumSchema<T> {
    return new EnumSchema(...values)
  }

  // METHOD
  public validate(input: unknown): T {

    if (!this._values.includes(input as T)) {
      const valuesStr = this._values.map((v) => JSON.stringify(v)).join(', ')
      throw new ValidationError(input, `The value must be one of ${valuesStr}.`)
    }

    return input as T

  }

  // METHOD
  public optional(): OptionalSchema<T, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<T, null> {
    return NullableSchema.create(this)
  }

}
