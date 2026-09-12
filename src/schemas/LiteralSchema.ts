// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Optional } from '@/lib/GenericSchema'

// INTERFACE
interface LiteralConfig<TValue extends string | number | boolean, TOptional extends boolean> {
  literal: TValue
  optional: TOptional
}

// CLASS
export class LiteralSchema<TValue extends string | number | boolean, TOptional extends boolean>
implements GenericSchema<Optional<TValue, TOptional>> {

  // PROPERTIES
  private readonly _config: LiteralConfig<TValue, TOptional>

  // CONSTRUCTOR
  private constructor(config: LiteralConfig<TValue, TOptional>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue extends string | number | boolean>(literal: TValue): LiteralSchema<TValue, false> {
    return new LiteralSchema({ literal, optional: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Optional<TValue, TOptional> {

    if (input === undefined && this._config.optional) return input as Optional<TValue, TOptional>

    if (input !== this._config.literal) {
      throw new ValidationError(input, 'The value must match the literal value.')
    }

    return this._config.literal as Optional<TValue, TOptional>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): LiteralSchema<TValue, true> {
    return new LiteralSchema({ ...this._config, optional: true })
  }

}
