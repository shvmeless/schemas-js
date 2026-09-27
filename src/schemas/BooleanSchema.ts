// IMPORTS
import type { GenericConfig, GenericPipeline, ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

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
  protected readonly _prepare: Array<PrepareFunction<boolean>>
  protected readonly _tests: TestObject<boolean>
  protected readonly _refine: Array<RefineFunction<boolean>>

  // CONSTRUCTOR
  private constructor(config: GenericConfig<boolean>, pipeline: GenericPipeline<boolean>) {
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
  public static create(): BooleanSchema<false, false, false> {
    return new BooleanSchema({
      optional: false,
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    }, {
      parse: null,
      prepare: [],
      tests: {},
      refine: [],
    })
  }

  // --------------------------------------------------------------------------

  // UTILITY
  private get _configuration(): GenericConfig<boolean> {
    return {
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): GenericPipeline<boolean> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<GenericConfig<boolean>>): BooleanSchema<TOptional, TNullable, TDefault> {
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
  private _updatePipeline(pipeline: Partial<GenericPipeline<boolean>>): BooleanSchema<TOptional, TNullable, TDefault> {
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
  public prepare(fn: PrepareFunction<boolean>): BooleanSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<boolean>): BooleanSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<boolean>): BooleanSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

}
