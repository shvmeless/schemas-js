// IMPORTS
import type { Nullish } from '@/lib/NullishSchema'
import type { GenericSchema } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'
import { type Unset, UNSET } from '@/utils/unset'

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
  default: TObject | Unset
  fallback: TObject | Unset
}

// CLASS
export class ObjectSchema<TObject, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<TObject, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _schema: InferShape<TObject>
  protected readonly _strip: boolean
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: TObject | Unset
  protected readonly _fallback: TObject | Unset

  // PIPELINE
  protected readonly _tests = {}

  // CONSTRUCTOR
  private constructor(config: ObjectConfig<TObject>) {
    super()
    this._schema = config.schema
    this._strip = config.strip
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TObject>(schema: InferShape<TObject>): ObjectSchema<TObject, false, false, false> {
    return new ObjectSchema<TObject, false, false, false>({
      schema: schema,
      strip: false,
      optional: false,
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    })
  }

  // --------------------------------------------------------------------------

  // UTILITY
  private get _configuration(): ObjectConfig<TObject> {
    return {
      schema: this._schema,
      strip: this._strip,
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<ObjectConfig<TObject>>): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return new ObjectSchema({
      ...this._configuration,
      ...configuration,
    })
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

      const keys = new Set([...Object.keys(this._schema), ...Object.keys(resolved)])
      for (const key of keys) {
        try {

          const value = resolved[key]
          const schema = this._schema[key as keyof TObject]

          if (schema === undefined) {
            if (this._strip) continue
            throw new ValidationError(value, 'Unexpected property.')
          }

          result[key] = schema.validate(value)

        } catch (error) {
          if (error instanceof ValidationError) errors.add(key, error)
          else throw error
        }
      }

      if (errors.size > 0) {
        const message = (Object.keys(resolved as object).length !== Object.keys(this._schema).length)
          ? (Object.keys(resolved as object).length < Object.keys(this._schema).length)
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
