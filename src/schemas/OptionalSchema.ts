// IMPORTS
import { GenericSchema } from '@/interfaces'

// CLASS
export class OptionalSchema<T> implements GenericSchema<T | undefined> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>) {
    this._schema = schema
  }

  // CONSTRUCTOR
  public static create<T>(schema: GenericSchema<T>): OptionalSchema<T> {
    return new OptionalSchema(schema)
  }

  // METHOD
  public validate(input: unknown): T | undefined {
    if (input === undefined) return undefined
    return this._schema.validate(input)
  }

}
