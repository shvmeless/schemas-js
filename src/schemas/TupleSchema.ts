// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, NullishSchema, Nullish } from '@/lib/GenericSchema'

// TYPE
type InferShape<TTuple extends ReadonlyArray<unknown>> = {
  [K in keyof TTuple]: GenericSchema<TTuple[K]>
}

// INTERFACE
interface TupleConfig<TTuple extends ReadonlyArray<unknown>> {
  shape: InferShape<TTuple>
  strip: boolean
  optional: boolean
  nullable: boolean
  default: TTuple | null
  fallback: TTuple | null
}

// CLASS
export class TupleSchema<TTuple extends ReadonlyArray<unknown>, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
implements NullishSchema<TTuple, TOptional, TNullable, TDefault> {

  // PROPERTIES
  private readonly _config: TupleConfig<TTuple>

  // CONSTRUCTOR
  private constructor(config: TupleConfig<TTuple>) {
    this._config = config
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TTuple extends ReadonlyArray<unknown>>(shape: InferShape<TTuple>): TupleSchema<TTuple, false, false, false> {
    return new TupleSchema<TTuple, false, false, false>({
      shape: shape,
      strip: false,
      optional: false,
      nullable: false,
      default: null,
      fallback: null,
    })
  }

  // --------------------------------------------------------------------------

  // PRIVATE
  private _resolveInput(input: unknown): Array<unknown> | null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default as unknown as Array<unknown> : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default as unknown as Array<unknown> : null
    }

    if (!Array.isArray(input)) {
      throw new ValidationError(input, 'The value must be an array.')
    }

    return input as Array<unknown>

  }

  // VALIDATOR
  public validate(input: unknown): Nullish<TTuple, TOptional, TNullable, TDefault> {
    type Output = Nullish<TTuple, TOptional, TNullable, TDefault>
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Output
      if (resolved === null) return null as Output

      const result: Array<unknown> = []
      const errors = ValidationError.prepare()

      const longest = Math.max(this._config.shape.length, resolved.length)
      for (let index = 0; index < longest; index++) {
        try {

          const value = resolved[index]
          const shape = this._config.shape[index]

          if (shape === undefined) {
            if (this._config.strip) continue
            throw new ValidationError(value, 'Unexpected element.')
          }

          result[index] = shape.validate(value)

        } catch (error) {
          if (error instanceof ValidationError) errors.add(index, error)
          else throw error
        }
      }

      if (errors.size > 0) {
        const message = (resolved.length !== this._config.shape.length)
          ? (resolved.length < this._config.shape.length)
              ? 'The tuple is missing one or more required elements.'
              : 'The tuple contains one or more unexpected elements.'
          : 'At least one element does not match the given schema.'
        errors.throw(input, message)
      }

      return result as unknown as Output

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // METHOD
  public strip(): TupleSchema<TTuple, TOptional, TNullable, TDefault> {
    return new TupleSchema({
      ...this._config,
      strip: true,
    })
  }

  // CONFIG
  public optional(): TupleSchema<TTuple, true, TNullable, TDefault> {
    return new TupleSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): TupleSchema<TTuple, TOptional, true, TDefault> {
    return new TupleSchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: TTuple): TupleSchema<TTuple, TOptional, TNullable, true> {
    return new TupleSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: TTuple): TupleSchema<TTuple, TOptional, TNullable, TDefault> {
    return new TupleSchema({
      ...this._config,
      fallback: value,
    })
  }

}
