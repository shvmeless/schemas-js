// IMPORTS
import type { ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { stringify } from '@/utils/stringify'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface NumberConfig {
  optional: boolean
  nullable: boolean
  default: number | Unset
  fallback: number | Unset
}

// INTERFACE
interface NumberPipeline {
  parse: ParseFunction | null
  prepare: Array<PrepareFunction<number>>
  tests: TestObject<number>
  refine: Array<RefineFunction<number>>
}

// CLASS
export class NumberSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<number, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: number | Unset
  protected readonly _fallback: number | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | null
  protected readonly _prepare: Array<PrepareFunction<number>>
  protected readonly _tests: TestObject<number>
  protected readonly _refine: Array<RefineFunction<number>>

  // CONSTRUCTOR
  private constructor(config: NumberConfig, pipeline: NumberPipeline) {
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
  public static create(): NumberSchema<false, false, false> {
    return new NumberSchema({
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
  private get _configuration(): NumberConfig {
    return {
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): NumberPipeline {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<NumberConfig>): NumberSchema<TOptional, TNullable, TDefault> {
    return new NumberSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<number>): NumberSchema<TOptional, TNullable, TDefault> {
    return new NumberSchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<NumberPipeline>): NumberSchema<TOptional, TNullable, TDefault> {
    return new NumberSchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<number, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (typeof current !== 'number') {
        throw new ValidationError(input, 'The value must be a number.')
      }

      return current

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): NumberSchema<true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): NumberSchema<TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: number): NumberSchema<TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: number): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<number>): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<number>): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<number>): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

  // --------------------------------------------------------------------------

  // METHOD
  public lessThan(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this._updateTests({
      max: (current) => {
        if (current >= target) return `The value must be less than ${stringify(target)}.`
        return null
      },
    })
  }

  // METHOD
  public lessThanOrEqual(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this._updateTests({
      max: (current) => {
        if (current > target) return `The value must be less than or equal to ${stringify(target)}.`
        return null
      },
    })
  }

  // METHOD
  public greaterThan(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this._updateTests({
      min: (current) => {
        if (current <= target) return `The value must be greater than ${stringify(target)}.`
        return null
      },
    })
  }

  // METHOD
  public greaterThanOrEqual(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this._updateTests({
      min: (current) => {
        if (current < target) return `The value must be greater than or equal to ${stringify(target)}.`
        return null
      },
    })
  }

  // METHOD
  public negative(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      min: (current) => {
        if (current >= 0) return 'The value must be a negative number.'
        return null
      },
    })
  }

  // METHOD
  public positive(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      max: (current) => {
        if (current <= 0) return 'The value must be a positive number.'
        return null
      },
    })
  }

  // METHOD
  public integer(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      integer: (current) => {
        if (!Number.isInteger(current)) return 'The value must be an integer.'
        return null
      },
    })
  }

  // METHOD
  public finite(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      finite: (current) => {
        if (!Number.isFinite(current)) return 'The value must be a finite number.'
        return null
      },
    })
  }

  // METHOD
  public safe(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      safe: (current) => {
        if (Number.isNaN(current)) return 'The value must be a safe integer.'
        if (current < Number.MIN_SAFE_INTEGER || current > Number.MAX_SAFE_INTEGER) return 'The value must be a safe integer.'
        return null
      },
    })
  }

}
