// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { OptionalSchema, Optional } from '@/lib/GenericSchema'

// INTERFACE
interface NullConfig {
  optional: boolean
  default: null | undefined
  fallback: null | undefined
}

// CLASS
export class NullSchema<TOptional extends boolean, TDefault extends boolean>
implements OptionalSchema<null, TOptional, TDefault> {

  // PROPERTIES
  private readonly _config: NullConfig

  // CONSTRUCTOR
  private constructor(config: NullConfig) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): NullSchema<false, false> {
    return new NullSchema({ optional: false, default: undefined, fallback: undefined })
  }

  // --------------------------------------------------------------------------

  // PRIVATE
  private _resolveInput(input: unknown): null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== undefined) ? this._config.default : undefined
    }

    if (input !== null) {
      throw new ValidationError(input, 'The value must be null.')
    }

    return input

  }

  // VALIDATOR
  public validate(input: unknown): Optional<null, TOptional, TDefault> {
    type Output = Optional<null, TOptional, TDefault>
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Output
      if (resolved === null) return null as Output

      return resolved as Output

    } catch (error) {
      if (this._config.fallback !== undefined) return this._config.fallback
      throw error
    }
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
