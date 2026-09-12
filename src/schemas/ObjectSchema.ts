// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// INTERFACE
interface ObjectConfig<TShape, TOptional extends boolean, TNullable extends boolean, TDefault extends TShape | null> {
  schema: { [K in keyof TShape]: GenericSchema<TShape[K]> }
  strip: boolean
  optional: TOptional
  nullable: TNullable
  default: TDefault
  fallback: TShape | null
}

// CLASS
export class ObjectSchema<TShape, TOptional extends boolean, TNullable extends boolean, TDefault extends TShape | null>
implements GenericSchema<Maybe<TShape, TOptional, TNullable, TDefault>> {

  // PROPERTIES
  private readonly _config: ObjectConfig<TShape, TOptional, TNullable, TDefault>

  // CONSTRUCTOR
  private constructor(config: ObjectConfig<TShape, TOptional, TNullable, TDefault>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TShape>(schema: { [K in keyof TShape]: GenericSchema<TShape[K]> }): ObjectSchema<TShape, false, false, null> {
    return new ObjectSchema<TShape, false, false, null>({
      schema: schema,
      strip: false,
      optional: false,
      nullable: false,
      default: null,
      fallback: null,
    })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateConfig(config: Partial<ObjectConfig<TShape, TOptional, TNullable, TDefault>> = {}): ObjectSchema<TShape, TOptional, TNullable, TDefault> {
    return new ObjectSchema<TShape, TOptional, TNullable, TDefault>(
      { ...this._config, ...config },
    )
  }

  // --------------------------------------------------------------------------

  // UPDATER
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
  public validate(input: unknown): Maybe<TShape, TOptional, TNullable, TDefault> {
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Maybe<TShape, TOptional, TNullable, TDefault>
      if (resolved === null) return null as Maybe<TShape, TOptional, TNullable, TDefault>

      const result: Record<string, unknown> = {}
      const errors = ValidationError.prepare()

      const keys = new Set([...Object.keys(this._config.schema), ...Object.keys(resolved)])
      for (const key of keys) {
        try {

          const value = resolved[key]
          const schema = this._config.schema[key as keyof TShape]

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

      return result as Maybe<TShape, TOptional, TNullable, TDefault>

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public strip(): ObjectSchema<TShape, TOptional, TNullable, TDefault> {
    return this.updateConfig({ strip: true })
  }

  // CONFIG
  public optional(): ObjectSchema<TShape, true, TNullable, TDefault> {
    return new ObjectSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): ObjectSchema<TShape, TOptional, true, TDefault> {
    return new ObjectSchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: TShape): ObjectSchema<TShape, TOptional, TNullable, TShape> {
    return new ObjectSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: TShape): ObjectSchema<TShape, TOptional, TNullable, TDefault> {
    return new ObjectSchema({
      ...this._config,
      fallback: value,
    })
  }

}
