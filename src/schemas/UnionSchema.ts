// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// TYPES
type InferSchemaType<I> = I extends GenericSchema<infer T> ? T : never
type SchemaTypeUnion<A extends ReadonlyArray<GenericSchema<unknown>>> = InferSchemaType<A[number]>

// INTERFACE
interface UnionConfig<TSchemas> {
  optional: boolean
  nullable: boolean
  default: TSchemas | null
  fallback: TSchemas | null
  schemas: ReadonlyArray<GenericSchema<TSchemas>>
}

// CLASS
export class UnionSchema<TSchemas, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
implements GenericSchema<Maybe<TSchemas, TOptional, TNullable, TDefault>> {

  // PROPERTIES
  private readonly _config: UnionConfig<TSchemas>

  // CONSTRUCTOR
  private constructor(config: UnionConfig<TSchemas>) {
    if (config.schemas.length < 2) throw new Error('Must provide at least two schemas.')
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<A extends ReadonlyArray<GenericSchema<unknown>>>(...schemas: A): UnionSchema<SchemaTypeUnion<A>, false, false, false> {
    return new UnionSchema<SchemaTypeUnion<A>, false, false, false>({
      schemas: schemas as ReadonlyArray<GenericSchema<SchemaTypeUnion<A>>>,
      optional: false,
      nullable: false,
      default: null,
      fallback: null,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<TSchemas, TOptional, TNullable, TDefault> {
    try {

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

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
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
  public default(value: TSchemas): UnionSchema<TSchemas, TOptional, TNullable, true> {
    return new UnionSchema<TSchemas, TOptional, TNullable, true>({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: TSchemas): UnionSchema<TSchemas, TOptional, TNullable, TDefault> {
    return new UnionSchema<TSchemas, TOptional, TNullable, TDefault>({
      ...this._config,
      fallback: value,
    })
  }

}
