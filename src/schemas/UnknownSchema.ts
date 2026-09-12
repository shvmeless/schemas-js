// IMPORTS
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// INTERFACE
interface UnknownConfig<TOptional extends boolean, TNullable extends boolean> {
  optional: TOptional
  nullable: TNullable
}

// CLASS
export class UnknownSchema<TOptional extends boolean, TNullable extends boolean>
implements GenericSchema<Maybe<unknown, TOptional, TNullable>> {

  // PROPERTIES
  private readonly _config: UnknownConfig<TOptional, TNullable>

  // CONSTRUCTOR
  private constructor(config: UnknownConfig<TOptional, TNullable>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UnknownSchema<false, false> {
    return new UnknownSchema({ optional: false, nullable: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<unknown, TOptional, TNullable> {

    if (input === undefined && this._config.optional) return input as Maybe<unknown, TOptional, TNullable>
    if (input === null && this._config.nullable) return input as Maybe<unknown, TOptional, TNullable>

    return input as Maybe<unknown, TOptional, TNullable>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): UnknownSchema<true, TNullable> {
    return new UnknownSchema({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): UnknownSchema<TOptional, true> {
    return new UnknownSchema({ ...this._config, nullable: true })
  }

}
