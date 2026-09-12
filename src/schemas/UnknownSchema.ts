// IMPORTS
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// INTERFACE
interface UnknownConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends unknown | null> {
  optional: TOptional
  nullable: TNullable
  default: TDefault
}

// CLASS
export class UnknownSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends unknown | null>
implements GenericSchema<Maybe<unknown, TOptional, TNullable, TDefault>> {

  // PROPERTIES
  private readonly _config: UnknownConfig<TOptional, TNullable, TDefault>

  // CONSTRUCTOR
  private constructor(config: UnknownConfig<TOptional, TNullable, TDefault>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UnknownSchema<false, false, null> {
    return new UnknownSchema({ optional: false, nullable: false, default: null })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _resolveInput(input: unknown): unknown {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    return input

  }

  // VALIDATOR
  public validate(input: unknown): Maybe<unknown, TOptional, TNullable, TDefault> {

    const resolved = this._resolveInput(input)

    if (resolved === undefined) return undefined as Maybe<unknown, TOptional, TNullable, TDefault>
    if (resolved === null) return null as Maybe<unknown, TOptional, TNullable, TDefault>

    return resolved as Maybe<unknown, TOptional, TNullable, TDefault>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): UnknownSchema<true, TNullable, TDefault> {
    return new UnknownSchema({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): UnknownSchema<TOptional, true, TDefault> {
    return new UnknownSchema({ ...this._config, nullable: true })
  }

  // CONFIG
  public default(value: unknown): UnknownSchema<TOptional, TNullable, unknown> {
    return new UnknownSchema({
      ...this._config,
      default: value,
    })
  }

}
