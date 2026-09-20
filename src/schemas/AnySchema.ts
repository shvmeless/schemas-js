/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// IMPORTS
import { GenericSchema, type Nullish } from '@/lib/GenericSchema'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface AnyConfig {
  optional: boolean
  nullable: boolean
  default: any | Unset
  fallback: any | Unset
}

// CLASS
export class AnySchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<any, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: any | Unset
  protected readonly _fallback: any | Unset

  // PIPELINE
  protected readonly _tests = {}

  // CONSTRUCTOR
  private constructor(config: AnyConfig) {
    super()
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
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

  // UTILITY
  private get _configuration(): AnyConfig {
    return {
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<AnyConfig>): AnySchema<TOptional, TNullable, TDefault> {
    return new AnySchema({
      ...this._configuration,
      ...configuration,
    })
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
