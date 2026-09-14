// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, NullishSchema, Nullish } from '@/lib/GenericSchema'

// TYPE
type InferShape<TObject> = {
  [K in keyof TObject]: GenericSchema<TObject[K]>
}

// INTERFACE
interface ObjectConfig<TObject> {
  schema: InferShape<TObject>
  strip: boolean
  optional: boolean
  nullable: boolean
  default: TObject | null
  fallback: TObject | null
}

// CLASS
export class ObjectSchema<TObject, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
implements NullishSchema<TObject, TOptional, TNullable, TDefault> {

  // PROPERTIES
  private readonly _config: ObjectConfig<TObject>

  // CONSTRUCTOR
  private constructor(config: ObjectConfig<TObject>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TObject>(schema: InferShape<TObject>): ObjectSchema<TObject, false, false, false> {
    return new ObjectSchema<TObject, false, false, false>({
      schema: schema,
      strip: false,
      optional: false,
      nullable: false,
      default: null,
      fallback: null,
    })
  }

  // --------------------------------------------------------------------------

  // PRIVATE
  private _resolveInput(input: unknown): Record<string, unknown> | null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default as unknown as Record<string, unknown> : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default as unknown as Record<string, unknown> : null
    }

    if (typeof input !== 'object' || input === null || Array.isArray(input) || (Object.getPrototypeOf(input) !== Object.prototype && Object.getPrototypeOf(input) !== null)) {
      throw new ValidationError(input, 'The value must be an object.')
    }

    return input as Record<string, unknown>

  }

  // VALIDATOR
  public validate(input: unknown): Nullish<TObject, TOptional, TNullable, TDefault> {
    type Output = Nullish<TObject, TOptional, TNullable, TDefault>
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Output
      if (resolved === null) return null as Output

      const result: Record<string, unknown> = {}
      const errors = ValidationError.prepare()

      const keys = new Set([...Object.keys(this._config.schema), ...Object.keys(resolved)])
      for (const key of keys) {
        try {

          const value = resolved[key]
          const schema = this._config.schema[key as keyof TObject]

          if (schema === undefined) {
            if (this._config.strip) continue
            throw new ValidationError(value, 'Unexpected property.')
          }

          result[key] = schema.validate(value)

        } catch (error) {
          if (error instanceof ValidationError) errors.add(key, error)
          else throw error
        }
      }

      if (errors.size > 0) {
        const message = (Object.keys(resolved as object).length !== Object.keys(this._config.schema).length)
          ? (Object.keys(resolved as object).length < Object.keys(this._config.schema).length)
              ? 'The object is missing one or more required properties.'
              : 'The object contains one or more unexpected properties.'
          : 'At least one property does not match the given schema.'
        errors.throw(input, message)
      }

      return result as Output

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public strip(): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return new ObjectSchema({
      ...this._config,
      strip: true,
    })
  }

  // CONFIG
  public optional(): ObjectSchema<TObject, true, TNullable, TDefault> {
    return new ObjectSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): ObjectSchema<TObject, TOptional, true, TDefault> {
    return new ObjectSchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: TObject): ObjectSchema<TObject, TOptional, TNullable, true> {
    return new ObjectSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: TObject): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return new ObjectSchema({
      ...this._config,
      fallback: value,
    })
  }

}
