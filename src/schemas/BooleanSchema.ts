// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'

// CLASS
export class BooleanSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<boolean, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: NullishConfig<boolean>
  protected readonly _validations = {}

  // CONSTRUCTOR
  private constructor(config: NullishConfig<boolean>) {
    super()
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): BooleanSchema<false, false, false> {
    return new BooleanSchema({
      optional: false,
      nullable: false,
      default: undefined,
      fallback: undefined,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<boolean, TOptional, TNullable, TDefault> {
    return this.validateSchema((current) => {

      if (typeof current !== 'boolean') {
        throw new ValidationError(input, 'The value must be a boolean.')
      }

      return current

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): BooleanSchema<true, TNullable, TDefault> {
    return new BooleanSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): BooleanSchema<TOptional, true, TDefault> {
    return new BooleanSchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: boolean): BooleanSchema<TOptional, TNullable, true> {
    return new BooleanSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: boolean): BooleanSchema<TOptional, TNullable, TDefault> {
    return new BooleanSchema({
      ...this._config,
      fallback: value,
    })
  }

}
