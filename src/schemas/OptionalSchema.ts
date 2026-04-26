// IMPORTS
import { GenericSchema } from '@/interfaces'

// CLASS
export class OptionalSchema<T, D extends T | undefined> implements GenericSchema<T | D> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>
  private readonly _value: D

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>, value: D) {
    this._schema = schema
    this._value = value
  }

  // CONSTRUCTOR
  public static create<T>(schema: GenericSchema<T>): OptionalSchema<T, undefined> {
    return new OptionalSchema(schema, undefined)
  }

  // METHOD
  public validate(input: unknown): T | D {
    if (input === undefined) {
      if (this._value === undefined) return undefined as D
      input = this._value
    }
    return this._schema.validate(input)
  }

  // METHOD
  public default(value: T): OptionalSchema<T, T> {
    return new OptionalSchema(this._schema, value)
  }

}
