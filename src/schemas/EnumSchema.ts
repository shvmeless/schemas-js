// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { NullishSchema, Nullish } from '@/lib/GenericSchema'

// INTERFACE
interface EnumConfig<TValues extends string | number> {
  values: ReadonlyArray<TValues>
  optional: boolean
  nullable: boolean
  default: TValues | null
  fallback: TValues | null
}

// CLASS
export class EnumSchema<TValues extends string | number, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
implements NullishSchema<TValues, TOptional, TNullable, TDefault> {

  // PROPERTIES
  private readonly _config: EnumConfig<TValues>

  // CONSTRUCTOR
  private constructor(config: EnumConfig<TValues>) {
    this._config = config
    if (this._config.values.length === 0) {
      throw new Error('Must provide at least one literal value.')
    }
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValues extends string | number>(...values: ReadonlyArray<TValues>): EnumSchema<TValues, false, false, false> {
    return new EnumSchema({ values, optional: false, nullable: false, default: null, fallback: null })
  }

  // --------------------------------------------------------------------------

  // PRIVATE
  private _resolveInput(input: unknown): TValues | null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    if (!this._config.values.includes(input as TValues)) {
      throw new ValidationError(input, 'The value must be match one of the allowed literal values.')
    }

    return input as TValues

  }

  // VALIDATOR
  public validate(input: unknown): Nullish<TValues, TOptional, TNullable, TDefault> {
    type Output = Nullish<TValues, TOptional, TNullable, TDefault>
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Output
      if (resolved === null) return null as Output

      return resolved as Output

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): EnumSchema<TValues, true, TNullable, TDefault> {
    return new EnumSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): EnumSchema<TValues, TOptional, true, TDefault> {
    return new EnumSchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: TValues): EnumSchema<TValues, TOptional, TNullable, true> {
    return new EnumSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: TValues): EnumSchema<TValues, TOptional, TNullable, TDefault> {
    return new EnumSchema({
      ...this._config,
      fallback: value,
    })
  }

}
