// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import type { GenericSchema } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'

// TYPE
type InferShape<TObject> = {
  [K in keyof TObject]: GenericSchema<TObject[K]>
}

// INTERFACE
interface ObjectConfig<TObject> extends NullishConfig<TObject> {
  schema: InferShape<TObject>
  strip: boolean
}

// CLASS
export class ObjectSchema<TObject, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<TObject, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: ObjectConfig<TObject>
  protected readonly _validations = {}

  // CONSTRUCTOR
  private constructor(config: ObjectConfig<TObject>) {
    super()
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
      default: undefined,
      fallback: undefined,
    })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(config: Partial<ObjectConfig<TObject>>): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return new ObjectSchema(
      { ...this._config, ...config },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<TObject, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (typeof current !== 'object' || current === null || Array.isArray(current) || (Object.getPrototypeOf(current) !== Object.prototype && Object.getPrototypeOf(current) !== null)) {
        throw new ValidationError(input, 'The value must be an object.')
      }

      const resolved = current as Record<string, unknown>
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

      return result as TObject

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public strip(): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return this._updateConfig({ strip: true })
  }

  // CONFIG
  public optional(): ObjectSchema<TObject, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): ObjectSchema<TObject, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: TObject): ObjectSchema<TObject, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: TObject): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

}
