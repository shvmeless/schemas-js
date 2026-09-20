// IMPORTS
import { GenericSchema, type Nullish } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface UndefinedConfig {
  optional: boolean
  nullable: boolean
  default: undefined | Unset
  fallback: undefined | Unset
}

// CLASS
export class UndefinedSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<undefined, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: undefined | Unset
  protected readonly _fallback: undefined | Unset

  // PIPELINE
  protected readonly _tests = {}

  // CONSTRUCTOR
  private constructor(config: UndefinedConfig) {
    super()
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UndefinedSchema<false, false, false> {
    return new UndefinedSchema({
      optional: false,
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    })
  }

  // --------------------------------------------------------------------------

  // UTILITY
  private get _configuration(): UndefinedConfig {
    return {
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<UndefinedConfig>): UndefinedSchema<TOptional, TNullable, TDefault> {
    return new UndefinedSchema({
      ...this._configuration,
      ...configuration,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<undefined, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (current !== undefined) {
        throw new ValidationError(input, 'The value must be undefined.')
      }

      return current

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): UndefinedSchema<true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): UndefinedSchema<TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: undefined): UndefinedSchema<TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: undefined): UndefinedSchema<TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

}
