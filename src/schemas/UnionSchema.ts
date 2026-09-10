// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'

// TYPES
type InferSchemaType<I> = I extends GenericSchema<infer T> ? T : never
type SchemaTypeUnion<A extends ReadonlyArray<GenericSchema<unknown>>> = InferSchemaType<A[number]>

// CLASS
export class UnionSchema<TSchemas> implements GenericSchema<TSchemas> {

  // PROPERTIES
  private readonly _schemas: ReadonlyArray<GenericSchema<TSchemas>>

  // CONSTRUCTOR
  private constructor(...schemas: ReadonlyArray<GenericSchema<TSchemas>>) {
    if (schemas.length < 2) throw new Error('Must provide at least two schemas.')
    this._schemas = schemas
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<A extends ReadonlyArray<GenericSchema<unknown>>>(...schemas: A): UnionSchema<SchemaTypeUnion<A>> {
    return new UnionSchema(...schemas as ReadonlyArray<GenericSchema<SchemaTypeUnion<A>>>)
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): TSchemas {

    for (const schema of this._schemas) {
      try {
        return schema.validate(input) as TSchemas
      } catch (error) {
        if (error instanceof ValidationError) continue
        else throw error
      }
    }

    throw new ValidationError(input, 'The value does not match any of the given schemas.')

  }

}
