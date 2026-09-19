// IMPORTS
import type { Optional } from '@/lib/OptionalSchema'
import { ValidationError } from '@/errors/ValidationError'
import { OptionalSchema } from '@/lib/OptionalSchema'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface NullConfig {
  optional: boolean
  default: null | Unset
  fallback: null | Unset
}

// CLASS
export class NullSchema<TOptional extends boolean, TDefault extends boolean>
  extends OptionalSchema<null, TOptional, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _default: null | Unset
  protected readonly _fallback: null | Unset

  // PIPELINE
  protected readonly _tests = {}

  // CONSTRUCTOR
  private constructor(config: NullConfig) {
    super()
    this._optional = config.optional
    this._default = config.default
    this._fallback = config.fallback
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): NullSchema<false, false> {
    return new NullSchema({
      optional: false,
      default: UNSET,
      fallback: UNSET,
    })
  }

  // --------------------------------------------------------------------------

  // UTILITY
  private get _configuration(): NullConfig {
    return {
      optional: this._optional,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TDefault extends boolean>(configuration: Partial<NullConfig>): NullSchema<TOptional, TDefault> {
    return new NullSchema({
      ...this._configuration,
      ...configuration,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Optional<null, TOptional, TDefault> {
    return this._runSchema((current) => {

      if (current !== null) {
        throw new ValidationError(input, 'The value must be null.')
      }

      return current

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): NullSchema<true, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public default(value: null): NullSchema<TOptional, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: null): NullSchema<TOptional, TDefault> {
    return this._updateConfig({ fallback: value })
  }

}
