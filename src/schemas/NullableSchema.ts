// IMPORTS
import { GenericSchema } from '@/interfaces'
import { OptionalSchema } from '@/schemas/OptionalSchema'

// CLASS
export class NullableSchema<T, D extends T | null> implements GenericSchema<T | D> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>
  private readonly _value: D

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>, value: D) {
    this._schema = schema
    this._value = value
  }

  // CONSTRUCTOR
  public static create<T>(schema: GenericSchema<T>): NullableSchema<T, null> {
    return new NullableSchema(schema, null)
  }

  // METHOD
  public validate(input: unknown): T | D {
    if (input === null) {
      if (this._value === null) return null as D
      input = this._value
    }
    return this._schema.validate(input)
  }

  // METHOD
  public default(value: T): NullableSchema<T, T> {
    return new NullableSchema(this._schema, value)
  }

  // METHOD
  public optional(): OptionalSchema<T | D, undefined> {
    return OptionalSchema.create(this)
  }

}
