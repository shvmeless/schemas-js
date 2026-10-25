// IMPORTS
import type { GenericConfig, GenericPipeline, GenericSchemaLike, InferSchema, ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { stringify } from '@/utils/stringify'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface ArrayConfig<TValue> extends GenericConfig<Array<TValue>> {
  schema: GenericSchemaLike
  prune: boolean
}

// CLASS
export class ArraySchema<TValue, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<Array<TValue>, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _schema: GenericSchemaLike
  protected readonly _prune: boolean
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: Array<TValue> | Unset
  protected readonly _fallback: Array<TValue> | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | Unset
  protected readonly _prepare: Array<PrepareFunction<Array<TValue>>>
  protected readonly _tests: TestObject<Array<TValue>>
  protected readonly _refine: Array<RefineFunction<Array<TValue>>>

  // CONSTRUCTOR
  private constructor(config: ArrayConfig<TValue>, pipeline: GenericPipeline<Array<TValue>>) {
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
  public static create<TSchema extends GenericSchemaLike>(schema: TSchema): ArraySchema<InferSchema<TSchema>, false, false, false> {
    return new ArraySchema({
      schema: schema,
      prune: false,
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
  private get _configuration(): ArrayConfig<TValue> {
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
  private get _pipeline(): GenericPipeline<Array<TValue>> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<ArrayConfig<TValue>>): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    return new ArraySchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<Array<TValue>>): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    return new ArraySchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<GenericPipeline<Array<TValue>>>): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    return new ArraySchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<Array<TValue>, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (!Array.isArray(current)) {
        throw new ValidationError(input, 'The value must be an array.')
      }

      const resolved = current as Array<unknown>
      const output: Array<TValue> = []
      const errors = ValidationError.prepare()

      resolved.forEach((element, index) => {
        try {
          const value = this._schema.validate(element)
          output.push(value as TValue)
        } catch (error) {
          if (error instanceof ValidationError) {
            if (this._prune) return
            errors.add(index, error)
          } else throw error
        }
      })

      if (errors.size > 0) {
        errors.throw(input, 'At least one element does not match the given schema.')
      }

      return output

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public prune(): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ prune: true })
  }

  // CONFIG
  public optional(): ArraySchema<TValue, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): ArraySchema<TValue, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: Array<TValue>): ArraySchema<TValue, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: Array<TValue>): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<Array<TValue>>): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<Array<TValue>>): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<Array<TValue>>): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

  // --------------------------------------------------------------------------

  // TEST
  public length(length: number): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      min: undefined,
      max: undefined,
      length: (current, initial) => {
        if (current.length !== length)
          throw new ValidationError(initial, `The value must be ${stringify(length)} elements long.`)
      },
    })
  }

  // TEST
  public min(length: number): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      length: undefined,
      min: (current, initial) => {
        if (current.length < length)
          throw new ValidationError(initial, `The value must be at least ${stringify(length)} elements long.`)
      },
    })
  }

  // TEST
  public max(length: number): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      length: undefined,
      max: (current, initial) => {
        if (current.length > length)
          throw new ValidationError(initial, `The value must be at most ${stringify(length)} elements long.`)
      },
    })
  }

  // TEST
  public some(callback: (value: TValue, index: number, array: Array<TValue>) => boolean): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      some: (current, initial) => {
        for (let index = 0; index < current.length; index++) {
          const value = current[index] as TValue
          if (callback(value, index, current)) return
        }
        throw new ValidationError(initial, 'No element satisfies the given validation function.')
      },
    })
  }

  // TEST
  public every(callback: (value: TValue, index: number, array: Array<TValue>) => boolean): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      every: (current, initial) => {
        for (let index = 0; index < current.length; index++) {
          const value = current[index] as TValue
          if (!callback(value, index, current))
            throw new ValidationError(initial, 'At least one element does not satisfy the given validation function.')
        }
      },
    })
  }

  // TEST
  public none(callback: (value: TValue, index: number, array: Array<TValue>) => boolean): ArraySchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      none: (current, initial) => {
        for (let index = 0; index < current.length; index++) {
          const value = current[index] as TValue
          if (callback(value, index, current))
            throw new ValidationError(initial, 'At least one element satisfies the given validation function.')
        }
      },
    })
  }

}
