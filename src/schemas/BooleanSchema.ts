// IMPORTS
import type { Nullish } from '@/lib/NullishSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface BooleanConfig {
  optional: boolean
  nullable: boolean
  default: boolean | Unset
  fallback: boolean | Unset
}

// CLASS
export class BooleanSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<boolean, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: boolean | Unset
  protected readonly _fallback: boolean | Unset

  // PIPELINE
  protected readonly _tests = {}

  // CONSTRUCTOR
  private constructor(config: BooleanConfig) {
    super()
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): BooleanSchema<false, false, false> {
    return new BooleanSchema({
      optional: false,
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    })
  }

  // --------------------------------------------------------------------------

  // UTILITY
  private get _configuration(): BooleanConfig {
    return {
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<BooleanConfig>): BooleanSchema<TOptional, TNullable, TDefault> {
    return new BooleanSchema({
      ...this._configuration,
      ...configuration,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<boolean, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (typeof current !== 'boolean') {
        throw new ValidationError(input, 'The value must be a boolean.')
      }

      return current

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): BooleanSchema<true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): BooleanSchema<TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: boolean): BooleanSchema<TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: boolean): BooleanSchema<TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

}
