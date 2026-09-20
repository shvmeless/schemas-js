// IMPORTS
import type { ParseFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface BooleanConfig {
  optional: boolean
  nullable: boolean
  default: boolean | Unset
  fallback: boolean | Unset
}

// INTERFACE
interface BooleanPipeline {
  parse: ParseFunction | null
  tests: TestObject<boolean>
}

// CLASS
export class BooleanSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<boolean, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: boolean | Unset
  protected readonly _fallback: boolean | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | null
  protected readonly _tests: TestObject<boolean>

  // CONSTRUCTOR
  private constructor(config: BooleanConfig, pipeline: BooleanPipeline) {
    super()
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
    this._parse = pipeline.parse
    this._tests = pipeline.tests
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): BooleanSchema<false, false, false> {
    return new BooleanSchema({
      optional: false,
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    }, {
      parse: null,
      tests: {},
    })
  }

  // --------------------------------------------------------------------------

  // UTILITY
  private get _configuration(): BooleanConfig {
    return {
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): BooleanPipeline {
    return {
      parse: this._parse,
      tests: this._tests,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<BooleanConfig>): BooleanSchema<TOptional, TNullable, TDefault> {
    return new BooleanSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<boolean>): BooleanSchema<TOptional, TNullable, TDefault> {
    return new BooleanSchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<BooleanPipeline>): BooleanSchema<TOptional, TNullable, TDefault> {
    return new BooleanSchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<boolean, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (typeof current !== 'boolean') {
        throw new ValidationError(input, 'The value must be a boolean.')
      }

      return current

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): BooleanSchema<true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): BooleanSchema<TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: boolean): BooleanSchema<TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: boolean): BooleanSchema<TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): BooleanSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<boolean>): BooleanSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

}
