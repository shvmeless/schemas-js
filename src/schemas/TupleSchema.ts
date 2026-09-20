// IMPORTS
import type { ParseFunction, PrepareFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

// TYPE
type InferShape<TTuple extends ReadonlyArray<unknown>> = {
  [K in keyof TTuple]: GenericSchema<TTuple[K], boolean, boolean, boolean>
}

// INTERFACE
interface TupleConfig<TTuple extends ReadonlyArray<unknown>> {
  shape: InferShape<TTuple>
  strip: boolean
  optional: boolean
  nullable: boolean
  default: TTuple | Unset
  fallback: TTuple | Unset
}

// INTERFACE
interface TuplePipeline<TTuple extends ReadonlyArray<unknown>> {
  parse: ParseFunction | null
  prepare: Array<PrepareFunction<TTuple>>
  tests: TestObject<TTuple>
}

// CLASS
export class TupleSchema<TTuple extends ReadonlyArray<unknown>, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<TTuple, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _shape: InferShape<TTuple>
  protected readonly _strip: boolean
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: TTuple | Unset
  protected readonly _fallback: TTuple | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | null
  protected readonly _prepare: Array<PrepareFunction<TTuple>>
  protected readonly _tests: TestObject<TTuple>

  // CONSTRUCTOR
  private constructor(config: TupleConfig<TTuple>, pipeline: TuplePipeline<TTuple>) {
    super()
    this._shape = config.shape
    this._strip = config.strip
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
  public static create<TTuple extends ReadonlyArray<unknown>>(shape: InferShape<TTuple>): TupleSchema<TTuple, false, false, false> {
    return new TupleSchema<TTuple, false, false, false>({
      shape: shape,
      strip: false,
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
  private get _configuration(): TupleConfig<TTuple> {
    return {
      shape: this._shape,
      strip: this._strip,
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): TuplePipeline<TTuple> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<TupleConfig<TTuple>>): TupleSchema<TTuple, TOptional, TNullable, TDefault> {
    return new TupleSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<TTuple>): TupleSchema<TTuple, TOptional, TNullable, TDefault> {
    return new TupleSchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<TuplePipeline<TTuple>>): TupleSchema<TTuple, TOptional, TNullable, TDefault> {
    return new TupleSchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<TTuple, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (!Array.isArray(current)) {
        throw new ValidationError(input, 'The value must be an array.')
      }

      const resolved = current as Array<unknown>
      const result: Array<unknown> = []
      const errors = ValidationError.prepare()

      const longest = Math.max(this._shape.length, resolved.length)
      for (let index = 0; index < longest; index++) {
        try {

          const value = resolved[index]
          const shape = this._shape[index]

          if (shape === undefined) {
            if (this._strip) continue
            throw new ValidationError(value, 'Unexpected element.')
          }

          result[index] = shape.validate(value)

        } catch (error) {
          if (error instanceof ValidationError) errors.add(index, error)
          else throw error
        }
      }

      if (errors.size > 0) {
        const message = (resolved.length !== this._shape.length)
          ? (resolved.length < this._shape.length)
              ? 'The tuple is missing one or more required elements.'
              : 'The tuple contains one or more unexpected elements.'
          : 'At least one element does not match the given schema.'
        errors.throw(input, message)
      }

      return result as unknown as TTuple

    }, input)
  }

  // --------------------------------------------------------------------------

  // METHOD
  public strip(): TupleSchema<TTuple, TOptional, TNullable, TDefault> {
    return this._updateConfig({ strip: true })
  }

  // CONFIG
  public optional(): TupleSchema<TTuple, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): TupleSchema<TTuple, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: TTuple): TupleSchema<TTuple, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: TTuple): TupleSchema<TTuple, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): TupleSchema<TTuple, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<TTuple>): TupleSchema<TTuple, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<TTuple>): TupleSchema<TTuple, TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

}
