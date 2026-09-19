// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'
import { UNSET } from '@/utils/unset'

// TYPE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor<T = unknown> = abstract new (...args: Array<any>) => T

// INTERFACE
interface InstanceOfConfig<TConstructor extends AnyConstructor> extends NullishConfig<InstanceType<TConstructor>> {
  constructor: TConstructor
}

// CLASS
export class InstanceOfSchema<TConstructor extends AnyConstructor, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<InstanceType<TConstructor>, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: InstanceOfConfig<TConstructor>
  protected readonly _tests = {}

  // CONSTRUCTOR
  private constructor(config: InstanceOfConfig<TConstructor>) {
    super()
    this._config = config
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

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(config: Partial<Omit<InstanceOfConfig<TConstructor>, 'constructor'>>): InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault> {
    return new InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault>(
      { ...this._config, ...config },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<InstanceType<TConstructor>, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (!(current instanceof this._config.constructor)) {
        throw new ValidationError(input, `Expected instance of ${this._config.constructor.name}.`)
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
