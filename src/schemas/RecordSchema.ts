// IMPORTS
import type { GenericConfig, GenericPipeline, ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { stringify } from '@/utils/stringify'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface RecordConfig<TValue> extends GenericConfig<Record<string, TValue>> {
  schema: GenericSchema<TValue, boolean, boolean, boolean>
  prune: boolean
}

// CLASS
export class RecordSchema<TValue, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<Record<string, TValue>, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _schema: GenericSchema<TValue, boolean, boolean, boolean>
  protected readonly _prune: boolean
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: Record<string, TValue> | Unset
  protected readonly _fallback: Record<string, TValue> | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | null
  protected readonly _prepare: Array<PrepareFunction<Record<string, TValue>>>
  protected readonly _tests: TestObject<Record<string, TValue>>
  protected readonly _refine: Array<RefineFunction<Record<string, TValue>>>

  // CONSTRUCTOR
  private constructor(config: RecordConfig<TValue>, pipeline: GenericPipeline<Record<string, TValue>>) {
    super()
    this._schema = config.schema
    this._prune = config.prune
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
  public static create<TValue>(schema: GenericSchema<TValue, boolean, boolean, boolean>): RecordSchema<TValue, false, false, false> {
    return new RecordSchema<TValue, false, false, false>({
      schema: schema,
      prune: false,
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
  private get _configuration(): RecordConfig<TValue> {
    return {
      schema: this._schema,
      prune: this._prune,
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): GenericPipeline<Record<string, TValue>> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<RecordConfig<TValue>>): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return new RecordSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<Record<string, TValue>>): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return new RecordSchema<TValue, TOptional, TNullable, TDefault>(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<GenericPipeline<Record<string, TValue>>>): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return new RecordSchema<TValue, TOptional, TNullable, TDefault>(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<Record<string, TValue>, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (typeof current !== 'object' || current === null || Array.isArray(current) || (Object.getPrototypeOf(current) !== Object.prototype && Object.getPrototypeOf(current) !== null)) {
        throw new ValidationError(input, 'The value must be an object.')
      }

      const resolved = current as Record<string, unknown>
      const result: Record<string, TValue> = {}
      const errors = ValidationError.prepare()

      for (const [key, value] of Object.entries(resolved)) {
        try {
          result[key] = this._schema.validate(value) as TValue
        } catch (error) {
          if (error instanceof ValidationError) {
            if (this._prune) continue
            errors.add(key, error)
          } else throw error
        }
      }

      if (errors.size > 0) {
        errors.throw(input, 'At least one entry does not match the given schema.')
      }

      return result

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public prune(): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ prune: true })
  }

  // CONFIG
  public optional(): RecordSchema<TValue, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): RecordSchema<TValue, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: Record<string, TValue>): RecordSchema<TValue, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: Record<string, TValue>): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<Record<string, TValue>>): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<Record<string, TValue>>): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<Record<string, TValue>>): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

  // --------------------------------------------------------------------------

  // TEST
  public length(length: number): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      min: undefined,
      max: undefined,
      length: (current) => {
        if (Object.entries(current).length !== length) return `The value must be ${stringify(length)} entries long.`
        return null
      },
    })
  }

  // TEST
  public min(length: number): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      min: (current) => {
        if (Object.entries(current).length < length) return `The value must be at least ${stringify(length)} entries long.`
        return null
      },
    })
  }

  // TEST
  public max(length: number): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      max: (current) => {
        if (Object.entries(current).length > length) return `The value must be at most ${stringify(length)} entries long.`
        return null
      },
    })
  }

  // TEST
  public some(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      some: (current) => {
        for (const [key, value] of Object.entries(current)) {
          if (callback(value, key, current)) return null
        }
        return 'No entry satisfies the given validation function.'
      },
    })
  }

  // TEST
  public every(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      every: (current) => {
        for (const [key, value] of Object.entries(current)) {
          if (!callback(value, key, current)) return 'At least one entry does not satisfy the given validation function.'
        }
        return null
      },
    })
  }

  // TEST
  public none(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      none: (current) => {
        for (const [key, value] of Object.entries(current)) {
          if (callback(value, key, current)) return 'At least one entry satisfies the given validation function.'
        }
        return null
      },
    })
  }

}
