// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Optional } from '@/lib/GenericSchema'

// TYPES
type InferSchemaType<I> = I extends GenericSchema<infer T> ? T : never
type SchemaTypeUnion<A extends ReadonlyArray<GenericSchema<unknown>>> = InferSchemaType<A[number]>

// INTERFACE
interface UnionConfig<TSchemas, TOptional extends boolean> {
  optional: TOptional
  schemas: ReadonlyArray<GenericSchema<TSchemas>>
}

// CLASS
export class UnionSchema<TSchemas, TOptional extends boolean>
implements GenericSchema<Optional<TSchemas, TOptional>> {

  // PROPERTIES
  private readonly _config: UnionConfig<TSchemas, TOptional>

  // CONSTRUCTOR
  private constructor(config: UnionConfig<TSchemas, TOptional>) {
    if (config.schemas.length < 2) throw new Error('Must provide at least two schemas.')
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<A extends ReadonlyArray<GenericSchema<unknown>>>(...schemas: A): UnionSchema<SchemaTypeUnion<A>, false> {
    return new UnionSchema<SchemaTypeUnion<A>, false>({
      schemas: schemas as ReadonlyArray<GenericSchema<SchemaTypeUnion<A>>>,
      optional: false,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Optional<TSchemas, TOptional> {

    if (input === undefined && this._config.optional) return input as Optional<TSchemas, TOptional>

    for (const schema of this._config.schemas) {
      try {
        return schema.validate(input) as Optional<TSchemas, TOptional>
      } catch (error) {
        if (error instanceof ValidationError) continue
        else throw error
      }
    }

    throw new ValidationError(input, 'The value does not match any of the given schemas.')

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): UnionSchema<TSchemas, true> {
    return new UnionSchema<TSchemas, true>({ ...this._config, optional: true })
  }

}
