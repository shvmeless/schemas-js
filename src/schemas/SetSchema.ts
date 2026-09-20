// IMPORTS
import type { GenericConfig, GenericPipeline, ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { stringify } from '@/utils/stringify'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface SetConfig<TValue> extends GenericConfig<Set<TValue>> {
  schema: GenericSchema<TValue, boolean, boolean, boolean>
  prune: boolean
}

// CLASS
export class SetSchema<TValue, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<Set<TValue>, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _schema: GenericSchema<TValue, boolean, boolean, boolean>
  protected readonly _prune: boolean
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: Set<TValue> | Unset
  protected readonly _fallback: Set<TValue> | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | null
  protected readonly _prepare: Array<PrepareFunction<Set<TValue>>>
  protected readonly _tests: TestObject<Set<TValue>>
  protected readonly _refine: Array<RefineFunction<Set<TValue>>>

  // CONSTRUCTOR
  private constructor(config: SetConfig<TValue>, pipeline: GenericPipeline<Set<TValue>>) {
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
  public static create<TValue>(schema: GenericSchema<TValue, boolean, boolean, boolean>): SetSchema<TValue, false, false, false> {
    return new SetSchema<TValue, false, false, false>({
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
  private get _configuration(): SetConfig<TValue> {
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
  private get _pipeline(): GenericPipeline<Set<TValue>> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<SetConfig<TValue>>): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return new SetSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<Set<TValue>>): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return new SetSchema<TValue, TOptional, TNullable, TDefault>(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<GenericPipeline<Set<TValue>>>): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return new SetSchema<TValue, TOptional, TNullable, TDefault>(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<Set<TValue>, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (!(current instanceof Set)) {
        throw new ValidationError(input, 'The value must be a Set.')
      }

      const resolved = current as Set<unknown>
      const result = new Set<TValue>()
      const errors = ValidationError.prepare()

      for (const element of resolved) {
        try {
          const value = this._schema.validate(element)
          result.add(value as TValue)
        } catch (error) {
          if (error instanceof ValidationError) {
            if (this._prune) continue
            errors.add(element, error)
          } else throw error
        }
      }

      if (errors.size > 0) {
        errors.throw(input, 'At least one element does not match the given schema.')
      }

      return result

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public prune(): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ prune: true })
  }

  // CONFIG
  public optional(): SetSchema<TValue, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): SetSchema<TValue, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: Set<TValue>): SetSchema<TValue, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: Set<TValue>): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<Set<TValue>>): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<Set<TValue>>): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<Set<TValue>>): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

  // --------------------------------------------------------------------------

  // TEST
  public size(size: number): SetSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(size) || size < 0) throw new Error('The size value must be zero or positive.')
    return this._updateTests({
      min: undefined,
      max: undefined,
      size: (current, initial) => {
        if (current.size !== size)
          throw new ValidationError(initial, `The value must be ${stringify(size)} elements long.`)
      },
    })
  }

  // TEST
  public min(size: number): SetSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(size) || size < 0) throw new Error('The size value must be zero or positive.')
    return this._updateTests({
      min: (current, initial) => {
        if (current.size < size)
          throw new ValidationError(initial, `The value must be at least ${stringify(size)} elements long.`)
      },
    })
  }

  // TEST
  public max(size: number): SetSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(size) || size < 0) throw new Error('The size value must be zero or positive.')
    return this._updateTests({
      max: (current, initial) => {
        if (current.size > size)
          throw new ValidationError(initial, `The value must be at most ${stringify(size)} elements long.`)
      },
    })
  }

  // TEST
  public some(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      some: (current, initial) => {
        for (const value of current) {
          if (callback(value, current)) return
        }
        throw new ValidationError(initial, 'No element satisfies the given validation function.')
      },
    })
  }

  // TEST
  public every(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      every: (current, initial) => {
        for (const value of current) {
          if (!callback(value, current))
            throw new ValidationError(initial, 'At least one element does not satisfy the given validation function.')
        }
      },
    })
  }

  // TEST
  public none(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      none: (current, initial) => {
        for (const value of current) {
          if (callback(value, current))
            throw new ValidationError(initial, 'At least one element satisfies the given validation function.')
        }
      },
    })
  }

}
