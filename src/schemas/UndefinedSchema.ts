// IMPORTS
import type { Nullable } from '@/lib/NullableSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullableSchema } from '@/lib/NullableSchema'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface UndefinedConfig {
  nullable: boolean
  default: undefined | Unset
  fallback: undefined | Unset
}

// CLASS
export class UndefinedSchema<TNullable extends boolean, TDefault extends boolean>
  extends NullableSchema<undefined, TNullable, TDefault> {

  // CONFIG
  protected readonly _nullable: boolean
  protected readonly _default: undefined | Unset
  protected readonly _fallback: undefined | Unset

  // PIPELINE
  protected readonly _tests = {}

  // CONSTRUCTOR
  private constructor(config: UndefinedConfig) {
    super()
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UndefinedSchema<false, false> {
    return new UndefinedSchema({
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    })
  }

  // --------------------------------------------------------------------------

  // UTILITY
  private get _configuration(): UndefinedConfig {
    return {
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UPDATER
  private _updateConfig<TNullable extends boolean, TDefault extends boolean>(configuration: Partial<UndefinedConfig>): UndefinedSchema<TNullable, TDefault> {
    return new UndefinedSchema({
      ...this._configuration,
      ...configuration,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullable<undefined, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (current !== undefined) {
        throw new ValidationError(input, 'The value must be undefined.')
      }

      return current

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public nullable(): UndefinedSchema<true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: undefined): UndefinedSchema<TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: undefined): UndefinedSchema<TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

}
