// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { TransformSchema } from '@/schemas/TransformSchema'
import { UnionSchema } from '@/schemas/UnionSchema'

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
    const errors = ValidationError.prepare()

    input.forEach((element, index) => {
      try {
        result[index] = this._schema.validate(element)
      } catch (error) {
        if (error instanceof ValidationError) errors.addError(index, error)
        else throw error
      }
    })

    if (errors.size > 0) {
      errors.throw(input, 'At least one element does not match the given schema.')
    }

    return result

  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public optional(): OptionalSchema<Array<T>, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<Array<T>, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<Array<T> | NT> {
    return UnionSchema.create(this as GenericSchema<Array<T>>, schema)
  }

  // METHOD
  public fallback(value: Array<T>): FallbackSchema<Array<T>> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: Array<T>) => V): TransformSchema<Array<T>, V> {
    return TransformSchema.create(this, fn)
  }

}
