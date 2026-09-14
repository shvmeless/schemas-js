/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// IMPORTS
import type { NullishSchema, Nullish } from '@/lib/GenericSchema'

// INTERFACE
interface AnyConfig {
  optional: boolean
  nullable: boolean
  default: any
  fallback: any
}

// CLASS
export class AnySchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
implements NullishSchema<any, TOptional, TNullable, TDefault> {

  // PROPERTIES
  private readonly _config: AnyConfig

  // CONSTRUCTOR
  private constructor(config: AnyConfig) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): AnySchema<false, false, false> {
    return new AnySchema({ optional: false, nullable: false, default: null, fallback: null })
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
  public validate(input: any): Nullish<any, TOptional, TNullable, TDefault> {
    type Output = Nullish<any, TOptional, TNullable, TDefault>
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
  public optional(): AnySchema<true, TNullable, TDefault> {
    return new AnySchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): AnySchema<TOptional, true, TDefault> {
    return new AnySchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: unknown): AnySchema<TOptional, TNullable, true> {
    return new AnySchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: unknown): AnySchema<TOptional, TNullable, TDefault> {
    return new AnySchema({
      ...this._config,
      fallback: value,
    })
  }

}
