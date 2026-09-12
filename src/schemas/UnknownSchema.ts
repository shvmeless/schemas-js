// IMPORTS
import type { GenericSchema, Optional } from '@/lib/GenericSchema'

// INTERFACE
interface UnknownConfig<TOptional extends boolean> {
  optional: TOptional
}

// CLASS
export class UnknownSchema<TOptional extends boolean>
implements GenericSchema<Optional<unknown, TOptional>> {

  // PROPERTIES
  private readonly _config: UnknownConfig<TOptional>

  // CONSTRUCTOR
  private constructor(config: UnknownConfig<TOptional>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UnknownSchema<false> {
    return new UnknownSchema({ optional: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Optional<unknown, TOptional> {

    if (input === undefined && this._config.optional) return input as Optional<unknown, TOptional>

    return input as Optional<unknown, TOptional>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): UnknownSchema<true> {
    return new UnknownSchema({ ...this._config, optional: true })
  }

}
