// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'

// CLASS
export class TupleSchema<TShape extends ReadonlyArray<unknown>> implements GenericSchema<TShape> {

  // PROPERTIES
  private readonly _shape: { [K in keyof TShape]: GenericSchema<TShape[K]> }
  private readonly _strip: boolean

  // CONSTRUCTOR
  private constructor(shape: { [K in keyof TShape]: GenericSchema<TShape[K]> }, strip: boolean) {
    this._shape = [...shape] as unknown as { [K in keyof TShape]: GenericSchema<TShape[K]> }
    this._strip = strip
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TShape extends ReadonlyArray<unknown>>(shape: { [K in keyof TShape]: GenericSchema<TShape[K]> }): TupleSchema<TShape> {
    return new TupleSchema(shape, false)
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): TShape {

    if (!Array.isArray(input)) {
      throw new ValidationError(input, 'The value must be an array.')
    }

    const result: Array<unknown> = []
    const errors = ValidationError.prepare()

    const longest = Math.max(this._shape.length, input.length)
    for (let index = 0; index < longest; index++) {
      try {

        const value = input[index] as unknown
        const shape = this._shape[index]

        if (shape === undefined) {
          if (this._strip) continue
          throw new ValidationError(value, 'Unexpected element.')
        }

        result[index] = shape.validate(value)

      } catch (error) {
        if (error instanceof ValidationError) errors.add(index, error)
        else throw error
      }
    }

    if (errors.size > 0) {
      const message = (input.length !== this._shape.length)
        ? (input.length < this._shape.length)
            ? 'The tuple is missing one or more required elements.'
            : 'The tuple contains one or more unexpected elements.'
        : 'At least one element does not match the given schema.'
      errors.throw(input, message)
    }

    return result as unknown as TShape

  }

  // --------------------------------------------------------------------------

  // METHOD
  public strip(): TupleSchema<TShape> {
    return new TupleSchema(this._shape, true)
  }

}
