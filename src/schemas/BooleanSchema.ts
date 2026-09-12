// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// INTERFACE
interface BooleanConfig<TOptional extends boolean, TNullable extends boolean> {
  optional: TOptional
  nullable: TNullable
}

// CLASS
export class BooleanSchema<TOptional extends boolean, TNullable extends boolean>
implements GenericSchema<Maybe<boolean, TOptional, TNullable>> {

  // PROPERTIES
  private readonly _config: BooleanConfig<TOptional, TNullable>

  // CONSTRUCTOR
  private constructor(config: BooleanConfig<TOptional, TNullable>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): BooleanSchema<false, false> {
    return new BooleanSchema({ optional: false, nullable: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<boolean, TOptional, TNullable> {

    if (input === undefined && this._config.optional) return input as Maybe<boolean, TOptional, TNullable>
    if (input === null && this._config.nullable) return input as Maybe<boolean, TOptional, TNullable>

    if (typeof input !== 'boolean') {
      throw new ValidationError(input, 'The value must be a boolean.')
    }

    return input as Maybe<boolean, TOptional, TNullable>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): BooleanSchema<true, TNullable> {
    return new BooleanSchema({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): BooleanSchema<TOptional, true> {
    return new BooleanSchema({ ...this._config, nullable: true })
  }

}
