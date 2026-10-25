// IMPORTS
import type { GenericConfig, GenericPipeline, GenericSchemaLike, InferSchema, ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

// TYPE
type InferShape<TShape> = {
  [K in keyof TShape]: InferSchema<TShape[K]>
}

// TYPE
type ShapeLike<TObject> = {
  [K in keyof TObject]: GenericSchemaLike
}

// INTERFACE
interface ObjectConfig<TObject> extends GenericConfig<TObject> {
  shape: ShapeLike<TObject>
  strip: boolean
}

// CLASS
export class ObjectSchema<TObject, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<TObject, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _shape: ShapeLike<TObject>
  protected readonly _strip: boolean
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: TObject | Unset
  protected readonly _fallback: TObject | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | Unset
  protected readonly _prepare: Array<PrepareFunction<TObject>>
  protected readonly _tests: TestObject<TObject>
  protected readonly _refine: Array<RefineFunction<TObject>>

  // CONSTRUCTOR
  private constructor(config: ObjectConfig<TObject>, pipeline: GenericPipeline<TObject>) {
    super()
    this._shape = { ...config.shape }
    this._strip = config.strip
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
  public static create<TShape extends Record<string, GenericSchemaLike>>(shape: TShape): ObjectSchema<InferShape<TShape>, false, false, false> {
    return new ObjectSchema<InferShape<TShape>, false, false, false>({
      shape: shape,
      strip: false,
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
  private get _configuration(): ObjectConfig<TObject> {
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
  private get _pipeline(): GenericPipeline<TObject> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<ObjectConfig<TObject>>): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return new ObjectSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<TObject>): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return new ObjectSchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<GenericPipeline<TObject>>): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return new ObjectSchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<TObject, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (typeof current !== 'object' || current === null || Array.isArray(current) || (Object.getPrototypeOf(current) !== Object.prototype && Object.getPrototypeOf(current) !== null)) {
        throw new ValidationError(input, 'The value must be an object.')
      }

      const resolved = current as Record<string, unknown>
      const result: Record<string, unknown> = {}
      const errors = ValidationError.prepare()

      const keys = new Set([...Object.keys(this._shape), ...Object.keys(resolved)])
      let missing = false
      let unexpected = false
      for (const key of keys) {
        const hasShape = Object.hasOwn(this._shape, key)
        const hasValue = Object.hasOwn(resolved, key)
        try {

          const value = hasValue ? resolved[key] : undefined
          const shape = hasShape ? this._shape[key as keyof TObject] : undefined

          if (shape === undefined) {
            if (this._strip) continue
            throw new ValidationError(value, 'Unexpected property.')
          }

          Object.defineProperty(result, key, {
            value: shape.validate(value),
            enumerable: true,
            writable: true,
            configurable: true,
          })

        } catch (error) {
          if (error instanceof ValidationError) {
            errors.add(key, error)
            if (!hasShape) unexpected = true
            else if (!hasValue) missing = true
          } else throw error
        }
      }

      if (errors.size > 0) {
        const message = missing
          ? 'The object is missing one or more required properties.'
          : unexpected
            ? 'The object contains one or more unexpected properties.'
            : 'At least one property does not match the given schema.'
        errors.throw(input, message)
      }

      return result as TObject

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public strip(): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return this._updateConfig({ strip: true })
  }

  // CONFIG
  public optional(): ObjectSchema<TObject, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): ObjectSchema<TObject, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: TObject): ObjectSchema<TObject, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: TObject): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<TObject>): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<TObject>): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<TObject>): ObjectSchema<TObject, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

}
