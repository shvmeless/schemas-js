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
interface UnionConfig<TSchemas> extends GenericConfig<TSchemas> {
  schemas: ReadonlyArray<GenericSchema<TSchemas, boolean, boolean, boolean>>
}

// CLASS
export class UnionSchema<TSchemas, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<TSchemas, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _schemas: ReadonlyArray<GenericSchema<TSchemas, boolean, boolean, boolean>>
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: TSchemas | Unset
  protected readonly _fallback: TSchemas | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | null
  protected readonly _prepare: Array<PrepareFunction<TSchemas>>
  protected readonly _tests: TestObject<TSchemas>
  protected readonly _refine: Array<RefineFunction<TSchemas>>

  // CONSTRUCTOR
  private constructor(config: UnionConfig<TSchemas>, pipeline: GenericPipeline<TSchemas>) {
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
      parse: null,
      prepare: [],
      tests: {},
      refine: [],
    })
  }

  // --------------------------------------------------------------------------

  // UTILITY
  private get _configuration(): UnionConfig<TSchemas> {
    return {
      schemas: this._schemas,
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): GenericPipeline<TSchemas> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<UnionConfig<TSchemas>>): UnionSchema<TSchemas, TOptional, TNullable, TDefault> {
    return new UnionSchema({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<TSchemas>): UnionSchema<TSchemas, TOptional, TNullable, TDefault> {
    return new UnionSchema(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<GenericPipeline<TSchemas>>): UnionSchema<TSchemas, TOptional, TNullable, TDefault> {
    return new UnionSchema(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<TSchemas, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      for (const schema of this._schemas) {
        try {
          return schema.validate(current) as TSchemas
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
  public optional(): UnionSchema<TSchemas, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): UnionSchema<TSchemas, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: TSchemas): UnionSchema<TSchemas, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: TSchemas): UnionSchema<TSchemas, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): UnionSchema<TSchemas, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<TSchemas>): UnionSchema<TSchemas, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<TSchemas>): UnionSchema<TSchemas, TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<TSchemas>): UnionSchema<TSchemas, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

}
