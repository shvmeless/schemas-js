// IMPORTS
import type { Optional, OptionalConfig } from '@/lib/OptionalSchema'
import { ValidationError } from '@/errors/ValidationError'
import { OptionalSchema } from '@/lib/OptionalSchema'

// CLASS
export class NullSchema<TOptional extends boolean, TDefault extends boolean>
  extends OptionalSchema<null, TOptional, TDefault> {

  // PROPERTIES
  protected readonly _config: OptionalConfig<null>
  protected readonly _validations = {}

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

  // VALIDATOR
  public validate(input: unknown): Optional<null, TOptional, TDefault> {
    return this.validateSchema((current) => {

      if (current !== null) {
        throw new ValidationError(input, 'The value must be null.')
      }

      return current

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): NullSchema<true, TDefault> {
    return new NullSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public default(value: null): NullSchema<TOptional, true> {
    return new NullSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: null): NullSchema<TOptional, TDefault> {
    return new NullSchema({
      ...this._config,
      fallback: value,
    })
  }

}
