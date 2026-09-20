/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// IMPORTS
import type { ParseFunction, PrepareFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface AnyConfig {
  optional: boolean
  nullable: boolean
  default: any | Unset
  fallback: any | Unset
}

// INTERFACE
interface AnyPipeline {
  parse: ParseFunction | null
  prepare: Array<PrepareFunction<any>>
  tests: TestObject<any>
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
  protected readonly _parse: ParseFunction | null
  protected readonly _prepare: Array<PrepareFunction<any>>
  protected readonly _tests: TestObject<any>

  // CONSTRUCTOR
  private constructor(config: AnyConfig, pipeline: AnyPipeline) {
    super()
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
    this._parse = pipeline.parse
    this._prepare = pipeline.prepare
    this._tests = pipeline.tests
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): AnySchema<false, false, false> {
    return new AnySchema({
      optional: false,
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    }, {
      parse: null,
      prepare: [],
      tests: {},
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

  // UTILITY
  private get _pipeline(): AnyPipeline {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<AnyConfig>): AnySchema<TOptional, TNullable, TDefault> {
    return new AnySchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<any>): AnySchema<TOptional, TNullable, TDefault> {
    return new AnySchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<AnyPipeline>): AnySchema<TOptional, TNullable, TDefault> {
    return new AnySchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
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

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): AnySchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<any>): AnySchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<any>): AnySchema<TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

}
