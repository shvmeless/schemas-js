// IMPORTS
import type { GenericConfig, GenericPipeline, ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { stringify } from '@/utils/stringify'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface MapConfig<TKey, TValue> extends GenericConfig<Map<TKey, TValue>> {
  keySchema: GenericSchema<TKey, boolean, boolean, boolean>
  valueSchema: GenericSchema<TValue, boolean, boolean, boolean>
  prune: boolean
}

// CLASS
export class MapSchema<TKey, TValue, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<Map<TKey, TValue>, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _keySchema: GenericSchema<TKey, boolean, boolean, boolean>
  protected readonly _valueSchema: GenericSchema<TValue, boolean, boolean, boolean>
  protected readonly _prune: boolean
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: Map<TKey, TValue> | Unset
  protected readonly _fallback: Map<TKey, TValue> | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | null
  protected readonly _prepare: Array<PrepareFunction<Map<TKey, TValue>>>
  protected readonly _tests: TestObject<Map<TKey, TValue>>
  protected readonly _refine: Array<RefineFunction<Map<TKey, TValue>>>

  // CONSTRUCTOR
  private constructor(config: MapConfig<TKey, TValue>, pipeline: GenericPipeline<Map<TKey, TValue>>) {
    super()
    this._keySchema = config.keySchema
    this._valueSchema = config.valueSchema
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
  public static create<TKey, TValue>(keySchema: GenericSchema<TKey, boolean, boolean, boolean>, valueSchema: GenericSchema<TValue, boolean, boolean, boolean>): MapSchema<TKey, TValue, false, false, false> {
    return new MapSchema<TKey, TValue, false, false, false>({
      keySchema: keySchema,
      valueSchema: valueSchema,
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
  private get _configuration(): MapConfig<TKey, TValue> {
    return {
      keySchema: this._keySchema,
      valueSchema: this._valueSchema,
      prune: this._prune,
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): GenericPipeline<Map<TKey, TValue>> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<MapConfig<TKey, TValue>>): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return new MapSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<Map<TKey, TValue>>): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return new MapSchema<TKey, TValue, TOptional, TNullable, TDefault>(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<GenericPipeline<Map<TKey, TValue>>>): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return new MapSchema<TKey, TValue, TOptional, TNullable, TDefault>(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<Map<TKey, TValue>, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (!(current instanceof Map)) {
        throw new ValidationError(input, 'The value must be a Map.')
      }

      const resolved = current as Map<unknown, unknown>
      const result = new Map<TKey, TValue>()
      const errors = ValidationError.prepare()

      resolved.forEach((value: unknown, key: unknown) => {
        try {
          const validatedKey = this._keySchema.validate(key)
          const validatedValue = this._valueSchema.validate(value)
          result.set(validatedKey as TKey, validatedValue as TValue)
        } catch (error) {
          if (error instanceof ValidationError) {
            if (this._prune) return
            errors.add(key, error)
          } else throw error
        }
      })

      if (errors.size > 0) {
        errors.throw(input, 'At least one entry does not match the given schema.')
      }

      return result

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public prune(): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ prune: true })
  }

  // CONFIG
  public optional(): MapSchema<TKey, TValue, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): MapSchema<TKey, TValue, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: Map<TKey, TValue>): MapSchema<TKey, TValue, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: Map<TKey, TValue>): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<Map<TKey, TValue>>): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<Map<TKey, TValue>>): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<Map<TKey, TValue>>): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

  // --------------------------------------------------------------------------

  // TEST
  public size(size: number): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(size)) throw new Error('The size value must be zero or positive.')
    if (size < 0) throw new Error('The size value must be zero or positive.')
    return this._updateTests({
      min: undefined,
      max: undefined,
      size: (current) => {
        if (current.size !== size) return `The value must be ${stringify(size)} entries long.`
        return null
      },
    })
  }

  // TEST
  public min(size: number): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(size)) throw new Error('The size value must be zero or positive.')
    if (size < 0) throw new Error('The size value must be zero or positive.')
    return this._updateTests({
      min: (current) => {
        if (current.size < size) return `The value must be at least ${stringify(size)} entries long.`
        return null
      },
    })
  }

  // TEST
  public max(size: number): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(size)) throw new Error('The size value must be zero or positive.')
    if (size < 0) throw new Error('The size value must be zero or positive.')
    return this._updateTests({
      max: (current) => {
        if (current.size > size) return `The value must be at most ${stringify(size)} entries long.`
        return null
      },
    })
  }

  // TEST
  public some(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      some: (current) => {
        for (const [key, value] of current) {
          if (callback(value, key, current)) return null
        }
        return 'No entry satisfies the given validation function.'
      },
    })
  }

  // TEST
  public every(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      every: (current) => {
        for (const [key, value] of current) {
          if (!callback(value, key, current)) return 'At least one entry does not satisfy the given validation function.'
        }
        return null
      },
    })
  }

  // TEST
  public none(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      none: (current) => {
        for (const [key, value] of current) {
          if (callback(value, key, current)) return 'At least one entry satisfies the given validation function.'
        }
        return null
      },
    })
  }

}
