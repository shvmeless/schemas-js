// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Optional } from '@/lib/GenericSchema'

// TYPE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor<T = unknown> = abstract new (...args: Array<any>) => T

// INTERFACE
interface InstanceOfConfig<TConstructor extends AnyConstructor, TOptional extends boolean> {
  constructor: TConstructor
  optional: TOptional
}

// CLASS
export class InstanceOfSchema<TConstructor extends AnyConstructor, TOptional extends boolean>
implements GenericSchema<Optional<InstanceType<TConstructor>, TOptional>> {

  // PROPERTIES
  private readonly _config: InstanceOfConfig<TConstructor, TOptional>

  // CONSTRUCTOR
  private constructor(config: InstanceOfConfig<TConstructor, TOptional>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TConstructor extends AnyConstructor>(constructor: TConstructor): InstanceOfSchema<TConstructor, false> {
    return new InstanceOfSchema({ constructor, optional: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Optional<InstanceType<TConstructor>, TOptional> {

    if (input === undefined && this._config.optional) return input as Optional<InstanceType<TConstructor>, TOptional>

    if (!(input instanceof this._config.constructor)) {
      throw new ValidationError(input, `Expected instance of ${this._config.constructor.name}.`)
    }

    return input as Optional<InstanceType<TConstructor>, TOptional>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): InstanceOfSchema<TConstructor, true> {
    return new InstanceOfSchema({ ...this._config, optional: true })
  }

}
