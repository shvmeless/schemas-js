/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import { NullishSchema } from '@/lib/NullishSchema'

// CLASS
export class AnySchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<any, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: NullishConfig<any>
  protected readonly _validations = {}

  // CONSTRUCTOR
  private constructor(config: NullishConfig<any>) {
    super()
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): AnySchema<false, false, false> {
    return new AnySchema({
      optional: false,
      nullable: false,
      default: undefined,
      fallback: undefined,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: any): Nullish<any, TOptional, TNullable, TDefault> {
    return this.validateSchema((current) => {
      return current
    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): AnySchema<true, TNullable, TDefault> {
    return new AnySchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): AnySchema<TOptional, true, TDefault> {
    return new AnySchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: unknown): AnySchema<TOptional, TNullable, true> {
    return new AnySchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: unknown): AnySchema<TOptional, TNullable, TDefault> {
    return new AnySchema({
      ...this._config,
      fallback: value,
    })
  }

}
