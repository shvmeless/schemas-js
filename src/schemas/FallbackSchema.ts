// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'

// CLASS
export class FallbackSchema<T> implements GenericSchema<T> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>
  private readonly _value: T

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>, value: T) {
    this._schema = schema
    this._value = value
  }

  // CONSTRUCTOR
  public static create<T>(schema: GenericSchema<T>, value: T): FallbackSchema<T> {
    return new FallbackSchema(schema, value)
  }

  // METHOD
  public validate(input: unknown): T {
    try {

      return this._schema.validate(input)

    } catch (error) {
      if (error instanceof ValidationError) return this._value
      else throw error
    }
  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

}
