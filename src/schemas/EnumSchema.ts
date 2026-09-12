// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Optional } from '@/lib/GenericSchema'

// INTERFACE
interface EnumConfig<TValue extends string | number, TOptional extends boolean> {
  values: ReadonlyArray<TValue>
  optional: TOptional
}

// CLASS
export class EnumSchema<TValue extends string | number, TOptional extends boolean>
implements GenericSchema<Optional<TValue, TOptional>> {

  // PROPERTIES
  private readonly _config: EnumConfig<TValue, TOptional>

  // CONSTRUCTOR
  private constructor(config: EnumConfig<TValue, TOptional>) {
    this._config = config
    if (this._config.values.length === 0) {
      throw new Error('Must provide at least one literal value.')
    }
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue extends string | number>(...values: ReadonlyArray<TValue>): EnumSchema<TValue, false> {
    return new EnumSchema({ values, optional: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Optional<TValue, TOptional> {

    if (input === undefined && this._config.optional) return input as Optional<TValue, TOptional>

    if (!this._config.values.includes(input as TValue)) {
      throw new ValidationError(input, 'The value must be match one of the allowed literal values.')
    }

    return input as Optional<TValue, TOptional>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): EnumSchema<TValue, true> {
    return new EnumSchema({ ...this._config, optional: true })
  }

}
