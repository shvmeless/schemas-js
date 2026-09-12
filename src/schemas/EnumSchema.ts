// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// INTERFACE
interface EnumConfig<TValue extends string | number, TOptional extends boolean, TNullable extends boolean> {
  values: ReadonlyArray<TValue>
  optional: TOptional
  nullable: TNullable
}

// CLASS
export class EnumSchema<TValue extends string | number, TOptional extends boolean, TNullable extends boolean>
implements GenericSchema<Maybe<TValue, TOptional, TNullable>> {

  // PROPERTIES
  private readonly _config: EnumConfig<TValue, TOptional, TNullable>

  // CONSTRUCTOR
  private constructor(config: EnumConfig<TValue, TOptional, TNullable>) {
    this._config = config
    if (this._config.values.length === 0) {
      throw new Error('Must provide at least one literal value.')
    }
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue extends string | number>(...values: ReadonlyArray<TValue>): EnumSchema<TValue, false, false> {
    return new EnumSchema({ values, optional: false, nullable: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<TValue, TOptional, TNullable> {

    if (input === undefined && this._config.optional) return input as Maybe<TValue, TOptional, TNullable>
    if (input === null && this._config.nullable) return input as Maybe<TValue, TOptional, TNullable>

    if (!this._config.values.includes(input as TValue)) {
      throw new ValidationError(input, 'The value must be match one of the allowed literal values.')
    }

    return input as Maybe<TValue, TOptional, TNullable>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): EnumSchema<TValue, true, TNullable> {
    return new EnumSchema({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): EnumSchema<TValue, TOptional, true> {
    return new EnumSchema({ ...this._config, nullable: true })
  }

}
