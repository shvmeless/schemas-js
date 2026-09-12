// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Optional } from '@/lib/GenericSchema'

// INTERFACE
interface TupleConfig<TShape extends ReadonlyArray<unknown>, TOptional extends boolean> {
  shape: { [K in keyof TShape]: GenericSchema<TShape[K]> }
  strip: boolean
  optional: TOptional
}

// CLASS
export class TupleSchema<TShape extends ReadonlyArray<unknown>, TOptional extends boolean>
implements GenericSchema<Optional<TShape, TOptional>> {

  // PROPERTIES
  private readonly _config: TupleConfig<TShape, TOptional>

  // CONSTRUCTOR
  private constructor(config: TupleConfig<TShape, TOptional>) {
    this._config = {
      ...config,
      shape: [...config.shape] as unknown as { [K in keyof TShape]: GenericSchema<TShape[K]> },
    }
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TShape extends ReadonlyArray<unknown>>(shape: { [K in keyof TShape]: GenericSchema<TShape[K]> }): TupleSchema<TShape, false> {
    return new TupleSchema<TShape, false>({
      shape: shape,
      strip: false,
      optional: false,
    })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateConfig(config: Partial<TupleConfig<TShape, TOptional>> = {}): TupleSchema<TShape, TOptional> {
    return new TupleSchema<TShape, TOptional>(
      { ...this._config, ...config },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Optional<TShape, TOptional> {

    if (input === undefined && this._config.optional) return input as Optional<TShape, TOptional>

    if (!Array.isArray(input)) {
      throw new ValidationError(input, 'The value must be an array.')
    }

    const result: Array<unknown> = []
    const errors = ValidationError.prepare()

    const longest = Math.max(this._config.shape.length, input.length)
    for (let index = 0; index < longest; index++) {
      try {

        const value = input[index] as unknown
        const shape = this._config.shape[index]

        if (shape === undefined) {
          if (this._config.strip) continue
          throw new ValidationError(value, 'Unexpected element.')
        }

        result[index] = shape.validate(value)

      } catch (error) {
        if (error instanceof ValidationError) errors.add(index, error)
        else throw error
      }
    }

    if (errors.size > 0) {
      const message = (input.length !== this._config.shape.length)
        ? (input.length < this._config.shape.length)
            ? 'The tuple is missing one or more required elements.'
            : 'The tuple contains one or more unexpected elements.'
        : 'At least one element does not match the given schema.'
      errors.throw(input, message)
    }

    return result as unknown as Optional<TShape, TOptional>

  }

  // --------------------------------------------------------------------------

  // METHOD
  public strip(): TupleSchema<TShape, TOptional> {
    return this.updateConfig({ strip: true })
  }

  // CONFIG
  public optional(): TupleSchema<TShape, true> {
    return new TupleSchema({
      ...this._config,
      optional: true,
    })
  }

}
