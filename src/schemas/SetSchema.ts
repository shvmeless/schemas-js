// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { TransformSchema } from '@/schemas/TransformSchema'
import { UnionSchema } from '@/schemas/UnionSchema'

// CLASS
export class SetSchema<T> implements GenericSchema<Set<T>> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>) {
    this._schema = schema
  }

  // CONSTRUCTOR
  public static create<T>(schema: GenericSchema<T>): SetSchema<T> {
    return new SetSchema<T>(schema)
  }

  // METHOD
  public validate(input: unknown): Set<T> {

    if (!(input instanceof Set)) {
      throw new ValidationError(input, 'The value must be a Set.')
    }

    const result = new Set<T>()
    const errors = ValidationError.prepare()

    for (const element of input) {
      try {
        const value = this._schema.validate(element)
        result.add(value)
      } catch (error) {
        if (error instanceof ValidationError) errors.add(element, error)
        else throw error
      }
    }

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
  public optional(): OptionalSchema<Set<T>, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<Set<T>, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<Set<T> | NT> {
    return UnionSchema.create(this as GenericSchema<Set<T>>, schema)
  }

  // METHOD
  public fallback(value: Set<T>): FallbackSchema<Set<T>> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: Set<T>) => V): TransformSchema<Set<T>, V> {
    return TransformSchema.create(this, fn)
  }

}
