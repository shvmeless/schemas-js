// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Optional } from '@/lib/GenericSchema'

// INTERFACE
interface BooleanConfig<TOptional extends boolean> {
  optional: TOptional
}

// CLASS
export class BooleanSchema<TOptional extends boolean>
implements GenericSchema<Optional<boolean, TOptional>> {

  // PROPERTIES
  private readonly _config: BooleanConfig<TOptional>

  // CONSTRUCTOR
  private constructor(config: BooleanConfig<TOptional>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): BooleanSchema<false> {
    return new BooleanSchema({ optional: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Optional<boolean, TOptional> {

    if (input === undefined && this._config.optional) return input as Optional<boolean, TOptional>

    if (typeof input !== 'boolean') {
      throw new ValidationError(input, 'The value must be a boolean.')
    }

    return input as Optional<boolean, TOptional>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): BooleanSchema<true> {
    return new BooleanSchema({ ...this._config, optional: true })
  }

}
