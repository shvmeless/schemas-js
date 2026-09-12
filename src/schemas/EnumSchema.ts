// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// INTERFACE
interface EnumConfig<TValue extends string | number, TOptional extends boolean, TNullable extends boolean, TDefault extends TValue | null> {
  values: ReadonlyArray<TValue>
  optional: TOptional
  nullable: TNullable
  default: TDefault
}

// CLASS
export class EnumSchema<TValue extends string | number, TOptional extends boolean, TNullable extends boolean, TDefault extends TValue | null>
implements GenericSchema<Maybe<TValue, TOptional, TNullable, TDefault>> {

  // PROPERTIES
  private readonly _config: EnumConfig<TValue, TOptional, TNullable, TDefault>

  // CONSTRUCTOR
  private constructor(config: EnumConfig<TValue, TOptional, TNullable, TDefault>) {
    this._config = config
    if (this._config.values.length === 0) {
      throw new Error('Must provide at least one literal value.')
    }
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue extends string | number>(...values: ReadonlyArray<TValue>): EnumSchema<TValue, false, false, null> {
    return new EnumSchema({ values, optional: false, nullable: false, default: null })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _resolveInput(input: unknown): TValue | null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    if (!this._config.values.includes(input as TValue)) {
      throw new ValidationError(input, 'The value must be match one of the allowed literal values.')
    }

    return input as TValue

  }

  // VALIDATOR
  public validate(input: unknown): Maybe<TValue, TOptional, TNullable, TDefault> {

    const resolved = this._resolveInput(input)

    if (resolved === undefined) return undefined as Maybe<TValue, TOptional, TNullable, TDefault>
    if (resolved === null) return null as Maybe<TValue, TOptional, TNullable, TDefault>

    return resolved as Maybe<TValue, TOptional, TNullable, TDefault>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): EnumSchema<TValue, true, TNullable, TDefault> {
    return new EnumSchema({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): EnumSchema<TValue, TOptional, true, TDefault> {
    return new EnumSchema({ ...this._config, nullable: true })
  }

  // CONFIG
  public default(value: TValue): EnumSchema<TValue, TOptional, TNullable, TValue> {
    return new EnumSchema({
      ...this._config,
      default: value,
    })
  }

}
