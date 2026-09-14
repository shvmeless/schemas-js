// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { NullishSchema, Nullish } from '@/lib/GenericSchema'

// INTERFACE
interface LiteralConfig<TValue extends string | number | boolean> {
  literal: TValue
  optional: boolean
  nullable: boolean
  default: TValue | null
  fallback: TValue | null
}

// CLASS
export class LiteralSchema<TValue extends string | number | boolean, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
implements NullishSchema<TValue, TOptional, TNullable, TDefault> {

  // PROPERTIES
  private readonly _config: LiteralConfig<TValue>

  // CONSTRUCTOR
  private constructor(config: LiteralConfig<TValue>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue extends string | number | boolean>(literal: TValue): LiteralSchema<TValue, false, false, false> {
    return new LiteralSchema({ literal, optional: false, nullable: false, default: null, fallback: null })
  }

  // --------------------------------------------------------------------------

  // PRIVATE
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
  public validate(input: unknown): Nullish<TValue, TOptional, TNullable, TDefault> {
    type Output = Nullish<TValue, TOptional, TNullable, TDefault>
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Output
      if (resolved === null) return null as Output

      return resolved as Output

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): LiteralSchema<TValue, true, TNullable, TDefault> {
    return new LiteralSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): LiteralSchema<TValue, TOptional, true, TDefault> {
    return new LiteralSchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: TValue): LiteralSchema<TValue, TOptional, TNullable, true> {
    return new LiteralSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: TValue): LiteralSchema<TValue, TOptional, TNullable, TDefault> {
    return new LiteralSchema({
      ...this._config,
      fallback: value,
    })
  }

}
