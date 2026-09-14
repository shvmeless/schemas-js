// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { NullableSchema, Nullable } from '@/lib/GenericSchema'

// INTERFACE
interface UndefinedConfig {
  nullable: boolean
  default: undefined | null
  fallback: undefined | null
}

// CLASS
export class UndefinedSchema<TNullable extends boolean, TDefault extends boolean>
implements NullableSchema<undefined, TNullable, TDefault> {

  // PROPERTIES
  private readonly _config: UndefinedConfig

  // CONSTRUCTOR
  private constructor(config: UndefinedConfig) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UndefinedSchema<false, false> {
    return new UndefinedSchema({ nullable: false, default: null, fallback: null })
  }

  // --------------------------------------------------------------------------

  // PRIVATE
  private _resolveInput(input: unknown): undefined | null {

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    if (input !== undefined) {
      throw new ValidationError(input, 'The value must be undefined.')
    }

    return (this._config.default !== null) ? this._config.default : undefined

  }

  // VALIDATOR
  public validate(input: unknown): Nullable<undefined, TNullable, TDefault> {
    type Output = Nullable<undefined, TNullable, TDefault>
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
  public nullable(): UndefinedSchema<true, TDefault> {
    return new UndefinedSchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: undefined): UndefinedSchema<TNullable, true> {
    return new UndefinedSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: undefined): UndefinedSchema<TNullable, TDefault> {
    return new UndefinedSchema({
      ...this._config,
      fallback: value,
    })
  }

}
