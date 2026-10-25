// IMPORTS
import type { GenericConfig, GenericPipeline, ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

// CLASS
export class UndefinedSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<undefined, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: undefined | Unset
  protected readonly _fallback: undefined | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | Unset
  protected readonly _prepare: Array<PrepareFunction<undefined>>
  protected readonly _tests: TestObject<undefined>
  protected readonly _refine: Array<RefineFunction<undefined>>

  // CONSTRUCTOR
  private constructor(config: GenericConfig<undefined>, pipeline: GenericPipeline<undefined>) {
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
  public static create(): UndefinedSchema<false, false, false> {
    return new UndefinedSchema({
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
  private get _configuration(): GenericConfig<undefined> {
    return {
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): GenericPipeline<undefined> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<GenericConfig<undefined>>): UndefinedSchema<TOptional, TNullable, TDefault> {
    return new UndefinedSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<undefined>): UndefinedSchema<TOptional, TNullable, TDefault> {
    return new UndefinedSchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<GenericPipeline<undefined>>): UndefinedSchema<TOptional, TNullable, TDefault> {
    return new UndefinedSchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
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

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): UndefinedSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<undefined>): UndefinedSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<undefined>): UndefinedSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<undefined>): UndefinedSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

}
