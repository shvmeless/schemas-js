// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Nullable } from '@/lib/GenericSchema'

// INTERFACE
interface UndefinedConfig<TNullable extends boolean> {
  nullable: TNullable
}

// CLASS
export class UndefinedSchema<TNullable extends boolean>
implements GenericSchema<Nullable<undefined, TNullable>> {

  // PROPERTIES
  private readonly _config: UndefinedConfig<TNullable>

  // CONSTRUCTOR
  private constructor(config: UndefinedConfig<TNullable>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UndefinedSchema<false> {
    return new UndefinedSchema({ nullable: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullable<undefined, TNullable> {

    if (input === null && this._config.nullable) return input as Nullable<undefined, TNullable>

    if (input !== undefined) {
      throw new ValidationError(input, 'The value must be undefined.')
    }

    return input as Nullable<undefined, TNullable>
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public nullable(): UndefinedSchema<true> {
    return new UndefinedSchema({ ...this._config, nullable: true })
  }

}
