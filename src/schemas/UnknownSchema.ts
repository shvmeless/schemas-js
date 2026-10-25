// IMPORTS
import type { GenericConfig, GenericPipeline, ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { type Unset, UNSET } from '@/utils/unset'

// CLASS
export class UnknownSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<unknown, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: unknown | Unset
  protected readonly _fallback: unknown | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | Unset
  protected readonly _prepare: Array<PrepareFunction<unknown>>
  protected readonly _tests: TestObject<unknown>
  protected readonly _refine: Array<RefineFunction<unknown>>

  // CONSTRUCTOR
  private constructor(config: GenericConfig<unknown>, pipeline: GenericPipeline<unknown>) {
    super()
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
    this._parse = pipeline.parse
    this._prepare = pipeline.prepare
    this._tests = pipeline.tests
    this._refine = pipeline.refine
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UnknownSchema<false, false, false> {
    return new UnknownSchema({
      optional: false,
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    }, {
      parse: UNSET,
      prepare: [],
      tests: {},
      refine: [],
    })
  }

  // --------------------------------------------------------------------------

  // UTILITY
  private get _configuration(): GenericConfig<unknown> {
    return {
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): GenericPipeline<unknown> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<GenericConfig<unknown>>): UnknownSchema<TOptional, TNullable, TDefault> {
    return new UnknownSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<unknown>): UnknownSchema<TOptional, TNullable, TDefault> {
    return new UnknownSchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<GenericPipeline<unknown>>): UnknownSchema<TOptional, TNullable, TDefault> {
    return new UnknownSchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
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
  public parse(fn: ParseFunction): UnknownSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<unknown>): UnknownSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<unknown>): UnknownSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<unknown>): UnknownSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

}
