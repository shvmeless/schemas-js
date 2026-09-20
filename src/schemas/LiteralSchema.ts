// IMPORTS
import type { ParseFunction, PrepareFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface LiteralConfig<TValue extends string | number | boolean> {
  literal: TValue
  optional: boolean
  nullable: boolean
  default: TValue | Unset
  fallback: TValue | Unset
}

// INTERFACE
interface LiteralPipeline<TValue extends string | number | boolean> {
  parse: ParseFunction | null
  prepare: Array<PrepareFunction<TValue>>
  tests: TestObject<TValue>
}

// CLASS
export class LiteralSchema<TValue extends string | number | boolean, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<TValue, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _literal: TValue
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: TValue | Unset
  protected readonly _fallback: TValue | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | null
  protected readonly _prepare: Array<PrepareFunction<TValue>>
  protected readonly _tests: TestObject<TValue>

  // CONSTRUCTOR
  private constructor(config: LiteralConfig<TValue>, pipeline: LiteralPipeline<TValue>) {
    super()
    this._literal = config.literal
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
  public static create<TValue extends string | number | boolean>(literal: TValue): LiteralSchema<TValue, false, false, false> {
    return new LiteralSchema({
      literal,
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
  private get _configuration(): LiteralConfig<TValue> {
    return {
      literal: this._literal,
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): LiteralPipeline<TValue> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<LiteralConfig<TValue>>): LiteralSchema<TValue, TOptional, TNullable, TDefault> {
    return new LiteralSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<TValue>): LiteralSchema<TValue, TOptional, TNullable, TDefault> {
    return new LiteralSchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<LiteralPipeline<TValue>>): LiteralSchema<TValue, TOptional, TNullable, TDefault> {
    return new LiteralSchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<TValue, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (current !== this._literal) {
        throw new ValidationError(input, 'The value must match the literal value.')
      }

      return current as TValue

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): LiteralSchema<TValue, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): LiteralSchema<TValue, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: TValue): LiteralSchema<TValue, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: TValue): LiteralSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): LiteralSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<TValue>): LiteralSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<TValue>): LiteralSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

}
