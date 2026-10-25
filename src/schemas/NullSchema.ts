// IMPORTS
import type { GenericConfig, GenericPipeline, ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

// CLASS
export class NullSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<null, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: null | Unset
  protected readonly _fallback: null | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | Unset
  protected readonly _prepare: Array<PrepareFunction<null>>
  protected readonly _tests: TestObject<null>
  protected readonly _refine: Array<RefineFunction<null>>

  // CONSTRUCTOR
  private constructor(config: GenericConfig<null>, pipeline: GenericPipeline<null>) {
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
  public static create(): NullSchema<false, false, false> {
    return new NullSchema({
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
  private get _configuration(): GenericConfig<null> {
    return {
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): GenericPipeline<null> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<GenericConfig<null>>): NullSchema<TOptional, TNullable, TDefault> {
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
  private _updatePipeline(pipeline: Partial<GenericPipeline<null>>): NullSchema<TOptional, TNullable, TDefault> {
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
  public prepare(fn: PrepareFunction<null>): NullSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<null>): NullSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<null>): NullSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

}
