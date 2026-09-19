/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import { NullishSchema } from '@/lib/NullishSchema'
import { UNSET } from '@/utils/unset'

// CLASS
export class AnySchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<any, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: NullishConfig<any>
  protected readonly _tests = {}

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
      default: UNSET,
      fallback: UNSET,
    })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(config: Partial<NullishConfig<any>>): AnySchema<TOptional, TNullable, TDefault> {
    return new AnySchema(
      { ...this._config, ...config },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: any): Nullish<any, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {
      return current
    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): AnySchema<true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): AnySchema<TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: unknown): AnySchema<TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: unknown): AnySchema<TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

}
