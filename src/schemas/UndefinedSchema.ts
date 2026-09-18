// IMPORTS
import type { Nullable, NullableConfig } from '@/lib/NullableSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullableSchema } from '@/lib/NullableSchema'

// CLASS
export class UndefinedSchema<TNullable extends boolean, TDefault extends boolean>
  extends NullableSchema<undefined, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: NullableConfig<undefined>
  protected readonly _validations = {}

  // CONSTRUCTOR
  private constructor(config: NullableConfig<undefined>) {
    super()
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): UndefinedSchema<false, false> {
    return new UndefinedSchema({
      nullable: false,
      default: null,
      fallback: null,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullable<undefined, TNullable, TDefault> {
    return this.validateSchema((current) => {

      if (current !== undefined) {
        throw new ValidationError(input, 'The value must be undefined.')
      }

      return current

    }, input)
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
