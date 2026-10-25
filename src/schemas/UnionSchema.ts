/* eslint-disable @typescript-eslint/no-explicit-any */

// IMPORTS
import type { GenericConfig, GenericPipeline, ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

// TYPES
type InferSchemaType<I> = I extends GenericSchema<infer T, any, any, any> ? T : never
type SchemaTypeUnion<A extends ReadonlyArray<GenericSchema<any, any, any, any>>> = InferSchemaType<A[number]>

// INTERFACE
interface UnionConfig<TUnion> extends GenericConfig<TUnion> {
  schemas: ReadonlyArray<GenericSchema<TUnion, boolean, boolean, boolean>>
}

// CLASS
export class UnionSchema<TUnion, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<TUnion, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _schemas: ReadonlyArray<GenericSchema<TUnion, boolean, boolean, boolean>>
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: TUnion | Unset
  protected readonly _fallback: TUnion | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | Unset
  protected readonly _prepare: Array<PrepareFunction<TUnion>>
  protected readonly _tests: TestObject<TUnion>
  protected readonly _refine: Array<RefineFunction<TUnion>>

  // CONSTRUCTOR
  private constructor(config: UnionConfig<TUnion>, pipeline: GenericPipeline<TUnion>) {
    super()
    this._schemas = config.schemas
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
    this._parse = pipeline.parse
    this._prepare = pipeline.prepare
    this._tests = pipeline.tests
    this._refine = pipeline.refine
    if (this._schemas.length < 2) throw new Error('Must provide at least two schemas.')
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<A extends ReadonlyArray<GenericSchema<any, any, any, any>>>(...schemas: A): UnionSchema<SchemaTypeUnion<A>, false, false, false> {
    return new UnionSchema<SchemaTypeUnion<A>, false, false, false>({
      schemas: schemas as ReadonlyArray<GenericSchema<SchemaTypeUnion<A>, boolean, boolean, boolean>>,
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
  private get _configuration(): UnionConfig<TUnion> {
    return {
      schemas: this._schemas,
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): GenericPipeline<TUnion> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<UnionConfig<TUnion>>): UnionSchema<TUnion, TOptional, TNullable, TDefault> {
    return new UnionSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<TUnion>): UnionSchema<TUnion, TOptional, TNullable, TDefault> {
    return new UnionSchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<GenericPipeline<TUnion>>): UnionSchema<TUnion, TOptional, TNullable, TDefault> {
    return new UnionSchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<TUnion, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      for (const schema of this._schemas) {
        try {
          return schema.validate(current) as TUnion
        } catch (error) {
          if (error instanceof ValidationError) continue
          else throw error
        }
      }

      throw new ValidationError(input, 'The value does not match any of the given schemas.')

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): UnionSchema<TUnion, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): UnionSchema<TUnion, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: TUnion): UnionSchema<TUnion, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: TUnion): UnionSchema<TUnion, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): UnionSchema<TUnion, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<TUnion>): UnionSchema<TUnion, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<TUnion>): UnionSchema<TUnion, TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<TUnion>): UnionSchema<TUnion, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

}
