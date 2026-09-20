// IMPORTS
import type { TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
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
  extends GenericSchema<unknown, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: unknown | Unset
  protected readonly _fallback: unknown | Unset

  // PIPELINE
  protected readonly _tests: TestObject<unknown>

  // CONSTRUCTOR
  private constructor(config: UnknownConfig, tests: TestObject<unknown>) {
    super()
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
    this._tests = tests
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UnknownSchema<false, false, false> {
    return new UnknownSchema({
      optional: false,
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    }, {})
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
    }, this._tests)
  }

  // UPDATER
  private _updateTests(tests: TestObject<unknown>): UnknownSchema<TOptional, TNullable, TDefault> {
    return new UnknownSchema(this._configuration, {
      ...this._tests,
      ...tests,
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

  // --------------------------------------------------------------------------

  // PIPELINE
  public test(id: string, test: TestFunction<unknown>): UnknownSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

}
