// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// INTERFACE
interface LiteralConfig<TValue extends string | number | boolean, TOptional extends boolean, TNullable extends boolean, TDefault extends TValue | null> {
  literal: TValue
  optional: TOptional
  nullable: TNullable
  default: TDefault
}

// CLASS
export class LiteralSchema<TValue extends string | number | boolean, TOptional extends boolean, TNullable extends boolean, TDefault extends TValue | null>
implements GenericSchema<Maybe<TValue, TOptional, TNullable, TDefault>> {

  // PROPERTIES
  private readonly _config: LiteralConfig<TValue, TOptional, TNullable, TDefault>

  // CONSTRUCTOR
  private constructor(config: LiteralConfig<TValue, TOptional, TNullable, TDefault>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue extends string | number | boolean>(literal: TValue): LiteralSchema<TValue, false, false, null> {
    return new LiteralSchema({ literal, optional: false, nullable: false, default: null })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _resolveInput(input: unknown): TValue | null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    if (input !== this._config.literal) {
      throw new ValidationError(input, 'The value must match the literal value.')
    }

    return this._config.literal

  }

  // VALIDATOR
  public validate(input: unknown): Maybe<TValue, TOptional, TNullable, TDefault> {

    const resolved = this._resolveInput(input)

    if (resolved === undefined) return undefined as Maybe<TValue, TOptional, TNullable, TDefault>
    if (resolved === null) return null as Maybe<TValue, TOptional, TNullable, TDefault>

    return resolved as Maybe<TValue, TOptional, TNullable, TDefault>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): LiteralSchema<TValue, true, TNullable, TDefault> {
    return new LiteralSchema({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): LiteralSchema<TValue, TOptional, true, TDefault> {
    return new LiteralSchema({ ...this._config, nullable: true })
  }

  // CONFIG
  public default(value: TValue): LiteralSchema<TValue, TOptional, TNullable, TValue> {
    return new LiteralSchema({
      ...this._config,
      default: value,
    })
  }

}
