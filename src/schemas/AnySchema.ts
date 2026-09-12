/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// IMPORTS
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// INTERFACE
interface AnyConfig<TOptional extends boolean, TNullable extends boolean> {
  optional: TOptional
  nullable: TNullable
}

// CLASS
export class AnySchema<TOptional extends boolean, TNullable extends boolean>
implements GenericSchema<Maybe<any, TOptional, TNullable>> {

  // PROPERTIES
  private readonly _config: AnyConfig<TOptional, TNullable>

  // CONSTRUCTOR
  private constructor(config: AnyConfig<TOptional, TNullable>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): AnySchema<false, false> {
    return new AnySchema({ optional: false, nullable: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: any): Maybe<any, TOptional, TNullable> {

    if (input === undefined && this._config.optional) return input as Maybe<any, TOptional, TNullable>
    if (input === null && this._config.nullable) return input as Maybe<any, TOptional, TNullable>

    return input as Maybe<any, TOptional, TNullable>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): AnySchema<true, TNullable> {
    return new AnySchema({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): AnySchema<TOptional, true> {
    return new AnySchema({ ...this._config, nullable: true })
  }

}
