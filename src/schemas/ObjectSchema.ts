// IMPORTS
import { ValidationError, ValidationErrorIndex } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { TransformSchema } from '@/schemas/TransformSchema'
import { UnionSchema } from '@/schemas/UnionSchema'

// CLASS
export class ObjectSchema<T> implements GenericSchema<T> {

  // PROPERTIES
  private readonly _schema: { [K in keyof T]: GenericSchema<T[K]> }
  private _strip: boolean

  // CONSTRUCTOR
  private constructor(schema: { [K in keyof T]: GenericSchema<T[K]> }) {
    this._schema = schema
    this._strip = false
  }

  // FACTORY
  public static create<T>(schema: { [K in keyof T]: GenericSchema<T[K]> }): ObjectSchema<T> {
    return new ObjectSchema(schema)
  }

  // METHOD
  public validate(input: unknown): T {

    if (typeof input !== 'object' || input === null || Array.isArray(input) || (Object.getPrototypeOf(input) !== Object.prototype && Object.getPrototypeOf(input) !== null)) {
      throw new ValidationError(input, 'The value must be an object.')
    }

    const object = input as Record<string, unknown>
    const result: Record<string, unknown> = {}
    const errors: ValidationErrorIndex = {}

    const keys = new Set([...Object.keys(this._schema), ...Object.keys(input)])
    for (const key of keys) {
      try {

        const schema = this._schema[key as keyof T]
        if (schema === undefined) {
          if (this._strip) continue
          throw new ValidationError(input, 'Unexpected property.')
        }

        const value = object[key]
        result[key] = schema.validate(value)

      } catch (error) {
        if (error instanceof ValidationError) errors[key] = error.index ?? error.message
        else throw error
      }
    }

    if (Object.keys(errors).length > 0) {
      const message = (Object.keys(input as object).length !== Object.keys(this._schema).length)
        ? (Object.keys(input as object).length < Object.keys(this._schema).length)
            ? 'The object is missing one or more required properties.'
            : 'The object contains one or more unexpected properties.'
        : 'At least one property does not match the given schema.'
      throw new ValidationError(input, message, errors)
    }

    return result as T

  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public strip(): this {
    this._strip = true
    return this
  }

  // METHOD
  public optional(): OptionalSchema<T, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<T, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<T | NT> {
    return UnionSchema.create(this as GenericSchema<T>, schema)
  }

  // METHOD
  public fallback(value: T): FallbackSchema<T> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: T) => V): TransformSchema<T, V> {
    return TransformSchema.create(this, fn)
  }

}
