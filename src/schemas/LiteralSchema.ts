// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// INTERFACE
interface LiteralConfig<TValue extends string | number | boolean, TOptional extends boolean, TNullable extends boolean> {
  literal: TValue
  optional: TOptional
  nullable: TNullable
}

// CLASS
export class LiteralSchema<TValue extends string | number | boolean, TOptional extends boolean, TNullable extends boolean>
implements GenericSchema<Maybe<TValue, TOptional, TNullable>> {

  // PROPERTIES
  private readonly _config: LiteralConfig<TValue, TOptional, TNullable>

  // CONSTRUCTOR
  private constructor(config: LiteralConfig<TValue, TOptional, TNullable>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue extends string | number | boolean>(literal: TValue): LiteralSchema<TValue, false, false> {
    return new LiteralSchema({ literal, optional: false, nullable: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<TValue, TOptional, TNullable> {

    if (input === undefined && this._config.optional) return input as Maybe<TValue, TOptional, TNullable>
    if (input === null && this._config.nullable) return input as Maybe<TValue, TOptional, TNullable>

    if (input !== this._config.literal) {
      throw new ValidationError(input, 'The value must match the literal value.')
    }

    return this._config.literal as Maybe<TValue, TOptional, TNullable>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): LiteralSchema<TValue, true, TNullable> {
    return new LiteralSchema({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): LiteralSchema<TValue, TOptional, true> {
    return new LiteralSchema({ ...this._config, nullable: true })
  }

}
