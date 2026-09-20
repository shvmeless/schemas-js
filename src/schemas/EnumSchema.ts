// IMPORTS
import type { ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface EnumConfig<TValues extends string | number> {
  values: ReadonlyArray<TValues>
  optional: boolean
  nullable: boolean
  default: TValues | Unset
  fallback: TValues | Unset
}

// INTERFACE
interface EnumPipeline<TValues extends string | number> {
  parse: ParseFunction | null
  prepare: Array<PrepareFunction<TValues>>
  tests: TestObject<TValues>
  refine: Array<RefineFunction<TValues>>
}

// CLASS
export class EnumSchema<TValues extends string | number, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<TValues, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _values: ReadonlyArray<TValues>
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: TValues | Unset
  protected readonly _fallback: TValues | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | null
  protected readonly _prepare: Array<PrepareFunction<TValues>>
  protected readonly _tests: TestObject<TValues>
  protected readonly _refine: Array<RefineFunction<TValues>>

  // CONSTRUCTOR
  private constructor(config: EnumConfig<TValues>, pipeline: EnumPipeline<TValues>) {
    super()
    this._values = config.values
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
    this._parse = pipeline.parse
    this._prepare = pipeline.prepare
    this._tests = pipeline.tests
    this._refine = pipeline.refine
    if (this._values.length === 0) {
      throw new Error('Must provide at least one literal value.')
    }
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValues extends string | number>(...values: ReadonlyArray<TValues>): EnumSchema<TValues, false, false, false> {
    return new EnumSchema({
      values,
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
  private get _configuration(): EnumConfig<TValues> {
    return {
      values: this._values,
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): EnumPipeline<TValues> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<EnumConfig<TValues>>): EnumSchema<TValues, TOptional, TNullable, TDefault> {
    return new EnumSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<TValues>): EnumSchema<TValues, TOptional, TNullable, TDefault> {
    return new EnumSchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<EnumPipeline<TValues>>): EnumSchema<TValues, TOptional, TNullable, TDefault> {
    return new EnumSchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<TValues, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (!this._values.includes(current as TValues)) {
        throw new ValidationError(input, 'The value must be match one of the allowed literal values.')
      }

      return current as TValues

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): EnumSchema<TValues, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): EnumSchema<TValues, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: TValues): EnumSchema<TValues, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: TValues): EnumSchema<TValues, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): EnumSchema<TValues, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<TValues>): EnumSchema<TValues, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<TValues>): EnumSchema<TValues, TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<TValues>): EnumSchema<TValues, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

}
