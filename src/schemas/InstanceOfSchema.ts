// IMPORTS
import type { GenericConfig, GenericPipeline, ParseFunction, PrepareFunction, RefineFunction, TestFunction } from '@/lib/GenericSchema'
import { GenericSchema, type Nullish, type TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

// TYPE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor<T = unknown> = abstract new (...args: Array<any>) => T

// INTERFACE
interface InstanceOfConfig<TConstructor extends AnyConstructor> extends GenericConfig<InstanceType<TConstructor>> {
  constructor: TConstructor
}

// CLASS
export class InstanceOfSchema<TConstructor extends AnyConstructor, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<InstanceType<TConstructor>, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _constructor: TConstructor
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: InstanceType<TConstructor> | Unset
  protected readonly _fallback: InstanceType<TConstructor> | Unset

  // PIPELINE
  protected readonly _parse: ParseFunction | null
  protected readonly _prepare: Array<PrepareFunction<InstanceType<TConstructor>>>
  protected readonly _tests: TestObject<InstanceType<TConstructor>>
  protected readonly _refine: Array<RefineFunction<InstanceType<TConstructor>>>

  // CONSTRUCTOR
  private constructor(config: InstanceOfConfig<TConstructor>, pipeline: GenericPipeline<InstanceType<TConstructor>>) {
    super()
    this._constructor = config.constructor
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
  public static create<TConstructor extends AnyConstructor>(constructor: TConstructor): InstanceOfSchema<TConstructor, false, false, false> {
    return new InstanceOfSchema({
      constructor,
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
  private get _configuration(): InstanceOfConfig<TConstructor> {
    return {
      constructor: this._constructor,
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UTILITY
  private get _pipeline(): GenericPipeline<InstanceType<TConstructor>> {
    return {
      parse: this._parse,
      prepare: this._prepare,
      tests: this._tests,
      refine: this._refine,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<Omit<InstanceOfConfig<TConstructor>, 'constructor'>>): InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault> {
    return new InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault>({
      ...this._configuration,
      ...configuration,
    }, this._pipeline)
  }

  // UPDATER
  private _updateTests(tests: TestObject<InstanceType<TConstructor>>): InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault> {
    return new InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault>(this._configuration, {
      ...this._pipeline,
      tests: {
        ...this._tests,
        ...tests,
      },
    })
  }

  // UPDATER
  private _updatePipeline(pipeline: Partial<GenericPipeline<InstanceType<TConstructor>>>): InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault> {
    return new InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault>(this._configuration, {
      ...this._pipeline,
      ...pipeline,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<InstanceType<TConstructor>, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (!(current instanceof this._constructor)) {
        throw new ValidationError(input, `Expected instance of ${this._constructor.name}.`)
      }

      return current as InstanceType<TConstructor>

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): InstanceOfSchema<TConstructor, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): InstanceOfSchema<TConstructor, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: InstanceType<TConstructor>): InstanceOfSchema<TConstructor, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: InstanceType<TConstructor>): InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // PIPELINE
  public parse(fn: ParseFunction): InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ parse: fn })
  }

  // PIPELINE
  public prepare(fn: PrepareFunction<InstanceType<TConstructor>>): InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ prepare: [...this._prepare, fn] })
  }

  // PIPELINE
  public test(id: string, test: TestFunction<InstanceType<TConstructor>>): InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault> {
    return this._updateTests({ [`_${id}`]: test })
  }

  // PIPELINE
  public refine(fn: RefineFunction<InstanceType<TConstructor>>): InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault> {
    return this._updatePipeline({ refine: [...this._refine, fn] })
  }

}
