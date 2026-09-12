/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// IMPORTS
import type { GenericSchema, Optional } from '@/lib/GenericSchema'

// INTERFACE
interface AnyConfig<TOptional extends boolean> {
  optional: TOptional
}

// CLASS
export class AnySchema<TOptional extends boolean>
implements GenericSchema<Optional<any, TOptional>> {

  // PROPERTIES
  private readonly _config: AnyConfig<TOptional>

  // CONSTRUCTOR
  private constructor(config: AnyConfig<TOptional>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): AnySchema<false> {
    return new AnySchema({ optional: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: any): Optional<any, TOptional> {

    if (input === undefined && this._config.optional) return input as Optional<any, TOptional>

    return input as Optional<any, TOptional>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): AnySchema<true> {
    return new AnySchema({ ...this._config, optional: true })
  }

}
