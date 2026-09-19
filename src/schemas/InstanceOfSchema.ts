// IMPORTS
import type { Nullish } from '@/lib/NullishSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'
import { type Unset, UNSET } from '@/utils/unset'

// TYPE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor<T = unknown> = abstract new (...args: Array<any>) => T

// INTERFACE
interface InstanceOfConfig<TConstructor extends AnyConstructor> {
  constructor: TConstructor
  optional: boolean
  nullable: boolean
  default: InstanceType<TConstructor> | Unset
  fallback: InstanceType<TConstructor> | Unset
}

// CLASS
export class InstanceOfSchema<TConstructor extends AnyConstructor, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<InstanceType<TConstructor>, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _constructor: TConstructor
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: InstanceType<TConstructor> | Unset
  protected readonly _fallback: InstanceType<TConstructor> | Unset

  // PIPELINE
  protected readonly _tests = {}

  // CONSTRUCTOR
  private constructor(config: InstanceOfConfig<TConstructor>) {
    super()
    this._constructor = config.constructor
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
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

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<Omit<InstanceOfConfig<TConstructor>, 'constructor'>>): InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault> {
    return new InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault>({
      ...this._configuration,
      ...configuration,
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

}
