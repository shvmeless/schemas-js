// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import type { GenericSchema } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'

// TYPES
type InferSchemaType<I> = I extends GenericSchema<infer T> ? T : never
type SchemaTypeUnion<A extends ReadonlyArray<GenericSchema<unknown>>> = InferSchemaType<A[number]>

// INTERFACE
interface UnionConfig<TSchemas> extends NullishConfig<TSchemas> {
  schemas: ReadonlyArray<GenericSchema<TSchemas>>
}

// CLASS
export class UnionSchema<TSchemas, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<TSchemas, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: UnionConfig<TSchemas>
  protected readonly _validations = {}

  // CONSTRUCTOR
  private constructor(config: UnionConfig<TSchemas>) {
    super()
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
      default: undefined,
      fallback: undefined,
    })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(config: Partial<UnionConfig<TSchemas>>): UnionSchema<TSchemas, TOptional, TNullable, TDefault> {
    return new UnionSchema(
      { ...this._config, ...config },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<TSchemas, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      for (const schema of this._config.schemas) {
        try {
          return schema.validate(current) as TSchemas
        } catch (error) {
          if (error instanceof ValidationError) continue
          else throw error
        }
      }

      throw new ValidationError(input, 'The value does not match any of the given schemas.')

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): UnionSchema<TSchemas, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): UnionSchema<TSchemas, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: TSchemas): UnionSchema<TSchemas, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: TSchemas): UnionSchema<TSchemas, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

}
