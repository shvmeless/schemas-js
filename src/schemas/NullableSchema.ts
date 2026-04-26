// IMPORTS
import { GenericSchema } from '@/interfaces'

// CLASS
export class NullableSchema<T> implements GenericSchema<T | null> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>) {
    this._schema = schema
  }

  // CONSTRUCTOR
  public static create<T>(schema: GenericSchema<T>): NullableSchema<T> {
    return new NullableSchema(schema)
  }

  // METHOD
  public validate(input: unknown): T | null {
    if (input === null) return null
    return this._schema.validate(input)
  }

}
