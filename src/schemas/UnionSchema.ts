// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, NullishSchema, Nullish } from '@/lib/GenericSchema'

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
implements NullishSchema<TSchemas, TOptional, TNullable, TDefault> {

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
  public validate(input: unknown): Nullish<TSchemas, TOptional, TNullable, TDefault> {
    type Output = Nullish<TSchemas, TOptional, TNullable, TDefault>
    try {

      if (input === undefined && this._config.optional) {
        return ((this._config.default !== null) ? this._config.default : undefined) as Output
      }

      if (input === null && this._config.nullable) {
        return ((this._config.default !== null) ? this._config.default : null) as Output
      }

      for (const schema of this._config.schemas) {
        try {
          return schema.validate(input) as Output
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
    return new UnionSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): UnionSchema<TSchemas, TOptional, true, TDefault> {
    return new UnionSchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: TSchemas): UnionSchema<TSchemas, TOptional, TNullable, true> {
    return new UnionSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: TSchemas): UnionSchema<TSchemas, TOptional, TNullable, TDefault> {
    return new UnionSchema({
      ...this._config,
      fallback: value,
    })
  }

}
