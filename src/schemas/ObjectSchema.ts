// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'

// INTERFACE
interface ObjectConfig<TShape> {
  schema: { [K in keyof TShape]: GenericSchema<TShape[K]> }
  strip: boolean
}

// CLASS
export class ObjectSchema<TShape> implements GenericSchema<TShape> {

  // PROPERTIES
  private readonly _config: ObjectConfig<TShape>

  // CONSTRUCTOR
  private constructor(config: ObjectConfig<TShape>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TShape>(schema: { [K in keyof TShape]: GenericSchema<TShape[K]> }): ObjectSchema<TShape> {
    return new ObjectSchema<TShape>({
      schema: schema,
      strip: false,
    })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateConfig(config: Partial<ObjectConfig<TShape>> = {}): ObjectSchema<TShape> {
    return new ObjectSchema<TShape>(
      { ...this._config, ...config },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): TShape {

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

    return result as TShape

  }

  // --------------------------------------------------------------------------

  // METHOD
  public strip(): ObjectSchema<TShape> {
    return this.updateConfig({ strip: true })
  }

}
