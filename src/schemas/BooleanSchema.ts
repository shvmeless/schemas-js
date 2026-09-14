// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { NullishSchema, Nullish } from '@/lib/GenericSchema'

// INTERFACE
interface BooleanConfig {
  optional: boolean
  nullable: boolean
  default: boolean | null
  fallback: boolean | null
}

// CLASS
export class BooleanSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
implements NullishSchema<boolean, TOptional, TNullable, TDefault> {

  // PROPERTIES
  private readonly _config: BooleanConfig

  // CONSTRUCTOR
  private constructor(config: BooleanConfig) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): BooleanSchema<false, false, false> {
    return new BooleanSchema({ optional: false, nullable: false, default: null, fallback: null })
  }

  // --------------------------------------------------------------------------

  // PRIVATE
  private _resolveInput(input: unknown): boolean | null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    if (typeof input !== 'boolean') {
      throw new ValidationError(input, 'The value must be a boolean.')
    }

    return input

  }

  // VALIDATOR
  public validate(input: unknown): Nullish<boolean, TOptional, TNullable, TDefault> {
    type Output = Nullish<boolean, TOptional, TNullable, TDefault>
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
  public optional(): BooleanSchema<true, TNullable, TDefault> {
    return new BooleanSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): BooleanSchema<TOptional, true, TDefault> {
    return new BooleanSchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: boolean): BooleanSchema<TOptional, TNullable, true> {
    return new BooleanSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: boolean): BooleanSchema<TOptional, TNullable, TDefault> {
    return new BooleanSchema({
      ...this._config,
      fallback: value,
    })
  }

}
