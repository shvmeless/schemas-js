// IMPORTS
import type { Nullish } from '@/lib/NullishSchema'
import { NullishSchema } from '@/lib/NullishSchema'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface UnknownConfig {
  optional: boolean
  nullable: boolean
  default: unknown | Unset
  fallback: unknown | Unset
}

// CLASS
export class UnknownSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<unknown, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: unknown | Unset
  protected readonly _fallback: unknown | Unset

  // PIPELINE
  protected readonly _tests = {}

  // CONSTRUCTOR
  private constructor(config: UnknownConfig) {
    super()
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UnknownSchema<false, false, false> {
    return new UnknownSchema({
      optional: false,
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    })
  }

  // --------------------------------------------------------------------------

  // UTILITY
  private get _configuration(): UnknownConfig {
    return {
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<UnknownConfig>): UnknownSchema<TOptional, TNullable, TDefault> {
    return new UnknownSchema({
      ...this._configuration,
      ...configuration,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<unknown, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {
      return current
    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): UnknownSchema<true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): UnknownSchema<TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: unknown): UnknownSchema<TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: unknown): UnknownSchema<TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

}
