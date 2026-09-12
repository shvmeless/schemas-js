// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// INTERFACE
interface BooleanConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean | null> {
  optional: TOptional
  nullable: TNullable
  default: TDefault
}

// CLASS
export class BooleanSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean | null>
implements GenericSchema<Maybe<boolean, TOptional, TNullable, TDefault>> {

  // PROPERTIES
  private readonly _config: BooleanConfig<TOptional, TNullable, TDefault>

  // CONSTRUCTOR
  private constructor(config: BooleanConfig<TOptional, TNullable, TDefault>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): BooleanSchema<false, false, null> {
    return new BooleanSchema({ optional: false, nullable: false, default: null })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _resolveInput(input: unknown): boolean | null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    if (typeof input !== 'boolean') {
      throw new ValidationError(input, 'The value must be a boolean.')
    }

    return input

  }

  // VALIDATOR
  public validate(input: unknown): Maybe<boolean, TOptional, TNullable, TDefault> {

    const resolved = this._resolveInput(input)

    if (resolved === undefined) return undefined as Maybe<boolean, TOptional, TNullable, TDefault>
    if (resolved === null) return null as Maybe<boolean, TOptional, TNullable, TDefault>

    return resolved as Maybe<boolean, TOptional, TNullable, TDefault>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): BooleanSchema<true, TNullable, TDefault> {
    return new BooleanSchema({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): BooleanSchema<TOptional, true, TDefault> {
    return new BooleanSchema({ ...this._config, nullable: true })
  }

  // CONFIG
  public default(value: boolean): BooleanSchema<TOptional, TNullable, boolean> {
    return new BooleanSchema({
      ...this._config,
      default: value,
    })
  }

}
