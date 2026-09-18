// IMPORTS
import type { Optional, OptionalConfig } from '@/lib/OptionalSchema'
import { ValidationError } from '@/errors/ValidationError'
import { OptionalSchema } from '@/lib/OptionalSchema'

// CLASS
export class NullSchema<TOptional extends boolean, TDefault extends boolean>
  extends OptionalSchema<null, TOptional, TDefault> {

  // PROPERTIES
  protected readonly _config: OptionalConfig<null>
  protected readonly _tests = {}

  // CONSTRUCTOR
  private constructor(config: OptionalConfig<null>) {
    super()
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): NullSchema<false, false> {
    return new NullSchema({
      optional: false,
      default: undefined,
      fallback: undefined,
    })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _updateConfig<TOptional extends boolean, TDefault extends boolean>(config: Partial<OptionalConfig<null>>): NullSchema<TOptional, TDefault> {
    return new NullSchema(
      { ...this._config, ...config },
    )
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
