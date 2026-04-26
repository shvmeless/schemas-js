// IMPORTS
import { GenericSchema } from '@/interfaces'
import { ValidationError } from '@/errors/ValidationError'
import { OptionalSchema } from '@/schemas/OptionalSchema'

// TYPES
type InferSchemaType<I> = I extends GenericSchema<infer T> ? T : never
type SchemaTypeUnion<A extends ReadonlyArray<GenericSchema<unknown>>> = InferSchemaType<A[number]>

// CLASS
export class UnionSchema<T> implements GenericSchema<T> {

  // PROPERTIES
  private readonly _schemas: ReadonlyArray<GenericSchema<T>>

  // CONSTRUCTOR
  private constructor(...schemas: ReadonlyArray<GenericSchema<T>>) {
    this._schemas = schemas
  }

  // CONSTRUCTOR
  public static create<A extends ReadonlyArray<GenericSchema<unknown>>>(...schemas: A): UnionSchema<SchemaTypeUnion<A>> {
    return new UnionSchema(...schemas as ReadonlyArray<GenericSchema<SchemaTypeUnion<A>>>)
  }

  // METHOD
  public validate(input: unknown): T {

    for (const schema of this._schemas) {
      try {
        return schema.validate(input) as T
      } catch (error) {
        if (error instanceof ValidationError) continue
        else throw error
      }
    }

    throw new ValidationError(input, 'The value does not match any of the given schemas.')

  }

  // METHOD
  public optional(): OptionalSchema<T, undefined> {
    return OptionalSchema.create(this)
  }

}
