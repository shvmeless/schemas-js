// IMPORTS
import type { ParseFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface NullConfig {
  optional: boolean
  nullable: boolean
  default: null | Unset
  fallback: null | Unset
}

// INTERFACE
interface NullPipeline {
  parse: ParseFunction | null
  tests: TestObject<null>
}

// CLASS
export class NullSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<null, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: null | Unset
  protected readonly _fallback: null | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | null
  protected readonly _tests: TestObject<null>

  // CONSTRUCTOR
  private constructor(config: NullConfig, pipeline: NullPipeline) {
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
  public static create(): NullSchema<false, false, false> {
    return new NullSchema({
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
  private get _configuration(): NullConfig {
    return {
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): NullPipeline {
    return {
      parse: this._parse,
      tests: this._tests,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<NullConfig>): NullSchema<TOptional, TNullable, TDefault> {
    return new NullSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<null>): NullSchema<TOptional, TNullable, TDefault> {
    return new NullSchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<NullPipeline>): NullSchema<TOptional, TNullable, TDefault> {
    return new NullSchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<null, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (current !== null) {
        throw new ValidationError(input, 'The value must be null.')
      }

      return current

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): NullSchema<true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): NullSchema<TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: null): NullSchema<TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: null): NullSchema<TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): NullSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<null>): NullSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

}
