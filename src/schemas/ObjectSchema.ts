// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// INTERFACE
interface ObjectConfig<TShape, TOptional extends boolean, TNullable extends boolean> {
  schema: { [K in keyof TShape]: GenericSchema<TShape[K]> }
  strip: boolean
  optional: TOptional
  nullable: TNullable
}

// CLASS
export class ObjectSchema<TShape, TOptional extends boolean, TNullable extends boolean>
implements GenericSchema<Maybe<TShape, TOptional, TNullable>> {

  // PROPERTIES
  private readonly _config: ObjectConfig<TShape, TOptional, TNullable>

  // CONSTRUCTOR
  private constructor(config: ObjectConfig<TShape, TOptional, TNullable>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TShape>(schema: { [K in keyof TShape]: GenericSchema<TShape[K]> }): ObjectSchema<TShape, false, false> {
    return new ObjectSchema<TShape, false, false>({
      schema: schema,
      strip: false,
      optional: false,
      nullable: false,
    })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateConfig(config: Partial<ObjectConfig<TShape, TOptional, TNullable>> = {}): ObjectSchema<TShape, TOptional, TNullable> {
    return new ObjectSchema<TShape, TOptional, TNullable>(
      { ...this._config, ...config },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<TShape, TOptional, TNullable> {

    if (input === undefined && this._config.optional) return input as Maybe<TShape, TOptional, TNullable>
    if (input === null && this._config.nullable) return input as Maybe<TShape, TOptional, TNullable>

    if (typeof input !== 'object' || input === null || Array.isArray(input) || (Object.getPrototypeOf(input) !== Object.prototype && Object.getPrototypeOf(input) !== null)) {
      throw new ValidationError(input, 'The value must be an object.')
    }

    const object = input as Record<string, unknown>
    const result: Record<string, unknown> = {}
    const errors = ValidationError.prepare()

    const keys = new Set([...Object.keys(this._config.schema), ...Object.keys(input)])
    for (const key of keys) {
      try {

        const value = object[key]
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
      const message = (Object.keys(input as object).length !== Object.keys(this._config.schema).length)
        ? (Object.keys(input as object).length < Object.keys(this._config.schema).length)
            ? 'The object is missing one or more required properties.'
            : 'The object contains one or more unexpected properties.'
        : 'At least one property does not match the given schema.'
      errors.throw(input, message)
    }

    return result as Maybe<TShape, TOptional, TNullable>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public strip(): ObjectSchema<TShape, TOptional, TNullable> {
    return this.updateConfig({ strip: true })
  }

  // CONFIG
  public optional(): ObjectSchema<TShape, true, TNullable> {
    return new ObjectSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): ObjectSchema<TShape, TOptional, true> {
    return new ObjectSchema({
      ...this._config,
      nullable: true,
    })
  }

}
