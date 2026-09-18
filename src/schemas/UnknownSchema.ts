// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import { NullishSchema } from '@/lib/NullishSchema'

// CLASS
export class UnknownSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<unknown, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: NullishConfig<unknown>
  protected readonly _validations = {}

  // CONSTRUCTOR
  private constructor(config: NullishConfig<unknown>) {
    super()
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UnknownSchema<false, false, false> {
    return new UnknownSchema({
      optional: false,
      nullable: false,
      default: undefined,
      fallback: undefined,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<unknown, TOptional, TNullable, TDefault> {
    return this.validateSchema((current) => {
      return current
    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): UnknownSchema<true, TNullable, TDefault> {
    return new UnknownSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): UnknownSchema<TOptional, true, TDefault> {
    return new UnknownSchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: unknown): UnknownSchema<TOptional, TNullable, true> {
    return new UnknownSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: unknown): UnknownSchema<TOptional, TNullable, TDefault> {
    return new UnknownSchema({
      ...this._config,
      fallback: value,
    })
  }

}
