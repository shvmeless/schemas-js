// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'

// CLASS
export class ObjectSchema<T> implements GenericSchema<T> {

  // PROPERTIES
  private readonly _schema: { [K in keyof T]: GenericSchema<T[K]> }
  private readonly _strip: boolean

  // CONSTRUCTOR
  private constructor(schema: { [K in keyof T]: GenericSchema<T[K]> }, strip: boolean) {
    this._schema = schema
    this._strip = strip
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<T>(schema: { [K in keyof T]: GenericSchema<T[K]> }): ObjectSchema<T> {
    return new ObjectSchema(schema, false)
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): T {

    if (typeof input !== 'object' || input === null || Array.isArray(input) || (Object.getPrototypeOf(input) !== Object.prototype && Object.getPrototypeOf(input) !== null)) {
      throw new ValidationError(input, 'The value must be an object.')
    }

    const object = input as Record<string, unknown>
    const result: Record<string, unknown> = {}
    const errors = ValidationError.prepare()

    const keys = new Set([...Object.keys(this._schema), ...Object.keys(input)])
    for (const key of keys) {
      try {

        const value = object[key]
        const schema = this._schema[key as keyof T]

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
      const message = (Object.keys(input as object).length !== Object.keys(this._schema).length)
        ? (Object.keys(input as object).length < Object.keys(this._schema).length)
            ? 'The object is missing one or more required properties.'
            : 'The object contains one or more unexpected properties.'
        : 'At least one property does not match the given schema.'
      errors.throw(input, message)
    }

    return result as T

  }

  // --------------------------------------------------------------------------

  // METHOD
  public strip(): ObjectSchema<T> {
    return new ObjectSchema(this._schema, true)
  }

}
