// IMPORTS
import { ValidationError, ValidationErrorIndex } from '@/errors/ValidationError'
import { GenericSchema } from '@/interfaces'
import { NullableSchema } from '@/schemas/NullableSchema'
import { OptionalSchema } from '@/schemas/OptionalSchema'

// CLASS
export class ArraySchema<T> implements GenericSchema<Array<T>> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>) {
    this._schema = schema
  }

  // CONSTRUCTOR
  public static create<T>(schema: GenericSchema<T>): ArraySchema<T> {
    return new ArraySchema<T>(schema)
  }

  // METHOD
  public validate(input: unknown): Array<T> {

    if (!Array.isArray(input)) {
      throw new ValidationError(input, 'The value must be an array.')
    }

    const result: Array<T> = []
    const errors: ValidationErrorIndex = {}

    input.forEach((element, index) => {
      try {
        result[index] = this._schema.validate(element)
      } catch (error: unknown) {
        if (error instanceof ValidationError) errors[index] = error.index ?? error.message
        else throw error
      }
    })

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(input, 'At least one element does not match the given schema.', errors)
    }

    return result

  }

  // METHOD
  public optional(): OptionalSchema<Array<T>, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<Array<T>, null> {
    return NullableSchema.create(this)
  }

}
