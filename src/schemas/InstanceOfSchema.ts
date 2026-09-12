// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// TYPE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor<T = unknown> = abstract new (...args: Array<any>) => T

// INTERFACE
interface InstanceOfConfig<TConstructor extends AnyConstructor, TOptional extends boolean, TNullable extends boolean> {
  constructor: TConstructor
  optional: TOptional
  nullable: TNullable
}

// CLASS
export class InstanceOfSchema<TConstructor extends AnyConstructor, TOptional extends boolean, TNullable extends boolean>
implements GenericSchema<Maybe<InstanceType<TConstructor>, TOptional, TNullable>> {

  // PROPERTIES
  private readonly _config: InstanceOfConfig<TConstructor, TOptional, TNullable>

  // CONSTRUCTOR
  private constructor(config: InstanceOfConfig<TConstructor, TOptional, TNullable>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TConstructor extends AnyConstructor>(constructor: TConstructor): InstanceOfSchema<TConstructor, false, false> {
    return new InstanceOfSchema({ constructor, optional: false, nullable: false })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<InstanceType<TConstructor>, TOptional, TNullable> {

    if (input === undefined && this._config.optional) return input as Maybe<InstanceType<TConstructor>, TOptional, TNullable>
    if (input === null && this._config.nullable) return input as Maybe<InstanceType<TConstructor>, TOptional, TNullable>

    if (!(input instanceof this._config.constructor)) {
      throw new ValidationError(input, `Expected instance of ${this._config.constructor.name}.`)
    }

    return input as Maybe<InstanceType<TConstructor>, TOptional, TNullable>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): InstanceOfSchema<TConstructor, true, TNullable> {
    return new InstanceOfSchema({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): InstanceOfSchema<TConstructor, TOptional, true> {
    return new InstanceOfSchema({ ...this._config, nullable: true })
  }

}
