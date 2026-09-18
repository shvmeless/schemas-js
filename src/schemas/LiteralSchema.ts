// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'

// INTERFACE
interface LiteralConfig<TValue extends string | number | boolean> extends NullishConfig<TValue> {
  literal: TValue
}

// CLASS
export class LiteralSchema<TValue extends string | number | boolean, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<TValue, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: LiteralConfig<TValue>
  protected readonly _validations = {}

  // CONSTRUCTOR
  private constructor(config: LiteralConfig<TValue>) {
    super()
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue extends string | number | boolean>(literal: TValue): LiteralSchema<TValue, false, false, false> {
    return new LiteralSchema({
      literal,
      optional: false,
      nullable: false,
      default: undefined,
      fallback: undefined,
    })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(config: Partial<LiteralConfig<TValue>>): LiteralSchema<TValue, TOptional, TNullable, TDefault> {
    return new LiteralSchema(
      { ...this._config, ...config },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<TValue, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (current !== this._config.literal) {
        throw new ValidationError(input, 'The value must match the literal value.')
      }

      return current as TValue

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): LiteralSchema<TValue, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): LiteralSchema<TValue, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: TValue): LiteralSchema<TValue, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: TValue): LiteralSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

}
