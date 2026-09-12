// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Optional } from '@/lib/GenericSchema'

// INTERFACE
interface NullConfig<TOptional extends boolean, TDefault extends null | undefined> {
  optional: TOptional
  default: TDefault
  fallback: null | undefined
}

// CLASS
export class NullSchema<TOptional extends boolean, TDefault extends null | undefined>
implements GenericSchema<Optional<null, TOptional, TDefault>> {

  // PROPERTIES
  private readonly _config: NullConfig<TOptional, TDefault>

  // CONSTRUCTOR
  private constructor(config: NullConfig<TOptional, TDefault>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): NullSchema<false, undefined> {
    return new NullSchema({ optional: false, default: undefined, fallback: undefined })
  }

  // --------------------------------------------------------------------------

  // UPDATER
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
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Optional<null, TOptional, TDefault>
      if (resolved === null) return null as Optional<null, TOptional, TDefault>

      return resolved as Optional<null, TOptional, TDefault>

    } catch (error) {
      if (this._config.fallback !== undefined) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): NullSchema<true, TDefault> {
    return new NullSchema({ ...this._config, optional: true })
  }

  // CONFIG
  public default(value: null): NullSchema<TOptional, null> {
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
