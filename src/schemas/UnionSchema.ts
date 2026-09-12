// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// TYPES
type InferSchemaType<I> = I extends GenericSchema<infer T> ? T : never
type SchemaTypeUnion<A extends ReadonlyArray<GenericSchema<unknown>>> = InferSchemaType<A[number]>

// INTERFACE
interface UnionConfig<TSchemas, TOptional extends boolean, TNullable extends boolean> {
  optional: TOptional
  nullable: TNullable
  schemas: ReadonlyArray<GenericSchema<TSchemas>>
}

// CLASS
export class UnionSchema<TSchemas, TOptional extends boolean, TNullable extends boolean>
implements GenericSchema<Maybe<TSchemas, TOptional, TNullable>> {

  // PROPERTIES
  private readonly _config: UnionConfig<TSchemas, TOptional, TNullable>

  // CONSTRUCTOR
  private constructor(config: UnionConfig<TSchemas, TOptional, TNullable>) {
    if (config.schemas.length < 2) throw new Error('Must provide at least two schemas.')
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<A extends ReadonlyArray<GenericSchema<unknown>>>(...schemas: A): UnionSchema<SchemaTypeUnion<A>, false, false> {
    return new UnionSchema<SchemaTypeUnion<A>, false, false>({
      schemas: schemas as ReadonlyArray<GenericSchema<SchemaTypeUnion<A>>>,
      optional: false,
      nullable: false,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<TSchemas, TOptional, TNullable> {

    if (input === undefined && this._config.optional) return input as Maybe<TSchemas, TOptional, TNullable>
    if (input === null && this._config.nullable) return input as Maybe<TSchemas, TOptional, TNullable>

    for (const schema of this._config.schemas) {
      try {
        return schema.validate(input) as Maybe<TSchemas, TOptional, TNullable>
      } catch (error) {
        if (error instanceof ValidationError) continue
        else throw error
      }
    }

    throw new ValidationError(input, 'The value does not match any of the given schemas.')

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): UnionSchema<TSchemas, true, TNullable> {
    return new UnionSchema<TSchemas, true, TNullable>({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): UnionSchema<TSchemas, TOptional, true> {
    return new UnionSchema<TSchemas, TOptional, true>({ ...this._config, nullable: true })
  }

}
