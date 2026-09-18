// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'

// INTERFACE
interface EnumConfig<TValues extends string | number> extends NullishConfig<TValues> {
  values: ReadonlyArray<TValues>
}

// CLASS
export class EnumSchema<TValues extends string | number, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<TValues, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: EnumConfig<TValues>
  protected readonly _validations = {}

  // CONSTRUCTOR
  private constructor(config: EnumConfig<TValues>) {
    super()
    this._config = config
    if (this._config.values.length === 0) {
      throw new Error('Must provide at least one literal value.')
    }
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValues extends string | number>(...values: ReadonlyArray<TValues>): EnumSchema<TValues, false, false, false> {
    return new EnumSchema({
      values,
      optional: false,
      nullable: false,
      default: undefined,
      fallback: undefined,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<TValues, TOptional, TNullable, TDefault> {
    return this.validateSchema((current) => {

      if (!this._config.values.includes(current as TValues)) {
        throw new ValidationError(input, 'The value must be match one of the allowed literal values.')
      }

      return current as TValues

    }, input)
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
