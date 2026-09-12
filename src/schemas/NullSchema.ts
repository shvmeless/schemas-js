// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Optional } from '@/lib/GenericSchema'

// INTERFACE
interface NullConfig<TOptional extends boolean> {
  optional: TOptional
}

// CLASS
export class NullSchema<TOptional extends boolean>
implements GenericSchema<Optional<null, TOptional>> {

  // PROPERTIES
  private readonly _config: NullConfig<TOptional>

  // CONSTRUCTOR
  private constructor(config: NullConfig<TOptional>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): NullSchema<false> {
    return new NullSchema({ optional: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Optional<null, TOptional> {

    if (input === undefined && this._config.optional) return input as Optional<null, TOptional>

    if (input !== null) {
      throw new ValidationError(input, 'The value must be null.')
    }

    return input as Optional<null, TOptional>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): NullSchema<true> {
    return new NullSchema({ ...this._config, optional: true })
  }

}
