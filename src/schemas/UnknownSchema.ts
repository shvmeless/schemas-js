// IMPORTS
import type { NullishSchema, Nullish } from '@/lib/GenericSchema'

// INTERFACE
interface UnknownConfig {
  optional: boolean
  nullable: boolean
  default: unknown
  fallback: unknown
}

// CLASS
export class UnknownSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
implements NullishSchema<unknown, TOptional, TNullable, TDefault> {

  // PROPERTIES
  private readonly _config: UnknownConfig

  // CONSTRUCTOR
  private constructor(config: UnknownConfig) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UnknownSchema<false, false, false> {
    return new UnknownSchema({ optional: false, nullable: false, default: null, fallback: null })
  }

  // --------------------------------------------------------------------------

  // PRIVATE
  private _resolveInput(input: unknown): unknown {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    return input

  }

  // VALIDATOR
  public validate(input: unknown): Nullish<unknown, TOptional, TNullable, TDefault> {
    type Output = Nullish<unknown, TOptional, TNullable, TDefault>
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Output
      if (resolved === null) return null as Output

      return resolved as Output

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): UnknownSchema<true, TNullable, TDefault> {
    return new UnknownSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): UnknownSchema<TOptional, true, TDefault> {
    return new UnknownSchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: unknown): UnknownSchema<TOptional, TNullable, true> {
    return new UnknownSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: unknown): UnknownSchema<TOptional, TNullable, TDefault> {
    return new UnknownSchema({
      ...this._config,
      fallback: value,
    })
  }

}
