// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// TYPES
type InferSchemaType<I> = I extends GenericSchema<infer T> ? T : never
type SchemaTypeUnion<A extends ReadonlyArray<GenericSchema<unknown>>> = InferSchemaType<A[number]>

// INTERFACE
interface UnionConfig<TSchemas, TOptional extends boolean, TNullable extends boolean, TDefault extends TSchemas | null> {
  optional: TOptional
  nullable: TNullable
  default: TDefault
  schemas: ReadonlyArray<GenericSchema<TSchemas>>
}

// CLASS
export class UnionSchema<TSchemas, TOptional extends boolean, TNullable extends boolean, TDefault extends TSchemas | null>
implements GenericSchema<Maybe<TSchemas, TOptional, TNullable, TDefault>> {

  // PROPERTIES
  private readonly _config: UnionConfig<TSchemas, TOptional, TNullable, TDefault>

  // CONSTRUCTOR
  private constructor(config: UnionConfig<TSchemas, TOptional, TNullable, TDefault>) {
    if (config.schemas.length < 2) throw new Error('Must provide at least two schemas.')
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<A extends ReadonlyArray<GenericSchema<unknown>>>(...schemas: A): UnionSchema<SchemaTypeUnion<A>, false, false, null> {
    return new UnionSchema<SchemaTypeUnion<A>, false, false, null>({
      schemas: schemas as ReadonlyArray<GenericSchema<SchemaTypeUnion<A>>>,
      optional: false,
      nullable: false,
      default: null,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<TSchemas, TOptional, TNullable, TDefault> {

    if (input === undefined && this._config.optional) {
      return ((this._config.default !== null) ? this._config.default : undefined) as Maybe<TSchemas, TOptional, TNullable, TDefault>
    }

    if (input === null && this._config.nullable) {
      return ((this._config.default !== null) ? this._config.default : null) as Maybe<TSchemas, TOptional, TNullable, TDefault>
    }

    for (const schema of this._config.schemas) {
      try {
        return schema.validate(input) as Maybe<TSchemas, TOptional, TNullable, TDefault>
      } catch (error) {
        if (error instanceof ValidationError) continue
        else throw error
      }
    }

    throw new ValidationError(input, 'The value does not match any of the given schemas.')

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): UnionSchema<TSchemas, true, TNullable, TDefault> {
    return new UnionSchema<TSchemas, true, TNullable, TDefault>({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): UnionSchema<TSchemas, TOptional, true, TDefault> {
    return new UnionSchema<TSchemas, TOptional, true, TDefault>({ ...this._config, nullable: true })
  }

  // CONFIG
  public default(value: TSchemas): UnionSchema<TSchemas, TOptional, TNullable, TSchemas> {
    return new UnionSchema<TSchemas, TOptional, TNullable, TSchemas>({
      ...this._config,
      default: value,
    })
  }

}
