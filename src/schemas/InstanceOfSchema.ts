// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// TYPE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor<T = unknown> = abstract new (...args: Array<any>) => T

// INTERFACE
interface InstanceOfConfig<TConstructor extends AnyConstructor, TOptional extends boolean, TNullable extends boolean, TDefault extends InstanceType<TConstructor> | null> {
  constructor: TConstructor
  optional: TOptional
  nullable: TNullable
  default: TDefault
  fallback: InstanceType<TConstructor> | null
}

// CLASS
export class InstanceOfSchema<TConstructor extends AnyConstructor, TOptional extends boolean, TNullable extends boolean, TDefault extends InstanceType<TConstructor> | null>
implements GenericSchema<Maybe<InstanceType<TConstructor>, TOptional, TNullable, TDefault>> {

  // PROPERTIES
  private readonly _config: InstanceOfConfig<TConstructor, TOptional, TNullable, TDefault>

  // CONSTRUCTOR
  private constructor(config: InstanceOfConfig<TConstructor, TOptional, TNullable, TDefault>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TConstructor extends AnyConstructor>(constructor: TConstructor): InstanceOfSchema<TConstructor, false, false, null> {
    return new InstanceOfSchema({ constructor, optional: false, nullable: false, default: null, fallback: null })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _resolveInput(input: unknown): InstanceType<TConstructor> | null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    if (!(input instanceof this._config.constructor)) {
      throw new ValidationError(input, `Expected instance of ${this._config.constructor.name}.`)
    }

    return input as InstanceType<TConstructor>

  }

  // VALIDATOR
  public validate(input: unknown): Maybe<InstanceType<TConstructor>, TOptional, TNullable, TDefault> {
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Maybe<InstanceType<TConstructor>, TOptional, TNullable, TDefault>
      if (resolved === null) return null as Maybe<InstanceType<TConstructor>, TOptional, TNullable, TDefault>

      return resolved as Maybe<InstanceType<TConstructor>, TOptional, TNullable, TDefault>

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): InstanceOfSchema<TConstructor, true, TNullable, TDefault> {
    return new InstanceOfSchema({ ...this._config, optional: true })
  }

  // CONFIG
  public nullable(): InstanceOfSchema<TConstructor, TOptional, true, TDefault> {
    return new InstanceOfSchema({ ...this._config, nullable: true })
  }

  // CONFIG
  public default(value: InstanceType<TConstructor>): InstanceOfSchema<TConstructor, TOptional, TNullable, InstanceType<TConstructor>> {
    return new InstanceOfSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: InstanceType<TConstructor>): InstanceOfSchema<TConstructor, TOptional, TNullable, TDefault> {
    return new InstanceOfSchema({
      ...this._config,
      fallback: value,
    })
  }

}
