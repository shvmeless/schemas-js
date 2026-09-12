// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'

// INTERFACE
interface TupleConfig<TShape extends ReadonlyArray<unknown>> {
  shape: { [K in keyof TShape]: GenericSchema<TShape[K]> }
  strip: boolean
  optional: boolean
  nullable: boolean
  default: TShape | null
  fallback: TShape | null
}

// CLASS
export class TupleSchema<TShape extends ReadonlyArray<unknown>, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
implements GenericSchema<Maybe<TShape, TOptional, TNullable, TDefault>> {

  // PROPERTIES
  private readonly _config: TupleConfig<TShape>

  // CONSTRUCTOR
  private constructor(config: TupleConfig<TShape>) {
    this._config = {
      ...config,
      shape: [...config.shape] as unknown as { [K in keyof TShape]: GenericSchema<TShape[K]> },
    }
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TShape extends ReadonlyArray<unknown>>(shape: { [K in keyof TShape]: GenericSchema<TShape[K]> }): TupleSchema<TShape, false, false, false> {
    return new TupleSchema<TShape, false, false, false>({
      shape: shape,
      strip: false,
      optional: false,
      nullable: false,
      default: null,
      fallback: null,
    })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateConfig(config: Partial<TupleConfig<TShape>> = {}): TupleSchema<TShape, TOptional, TNullable, TDefault> {
    return new TupleSchema<TShape, TOptional, TNullable, TDefault>(
      { ...this._config, ...config },
    )
  }

  // --------------------------------------------------------------------------

  // UPDATER
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
  public validate(input: unknown): Maybe<TShape, TOptional, TNullable, TDefault> {
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Maybe<TShape, TOptional, TNullable, TDefault>
      if (resolved === null) return null as Maybe<TShape, TOptional, TNullable, TDefault>

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

      return result as unknown as Maybe<TShape, TOptional, TNullable, TDefault>

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // METHOD
  public strip(): TupleSchema<TShape, TOptional, TNullable, TDefault> {
    return this.updateConfig({ strip: true })
  }

  // CONFIG
  public optional(): TupleSchema<TShape, true, TNullable, TDefault> {
    return new TupleSchema({
      ...this._config,
      optional: true,
    })
  }

  // CONFIG
  public nullable(): TupleSchema<TShape, TOptional, true, TDefault> {
    return new TupleSchema({
      ...this._config,
      nullable: true,
    })
  }

  // CONFIG
  public default(value: TShape): TupleSchema<TShape, TOptional, TNullable, true> {
    return new TupleSchema({
      ...this._config,
      default: value,
    })
  }

  // CONFIG
  public fallback(value: TShape): TupleSchema<TShape, TOptional, TNullable, TDefault> {
    return new TupleSchema({
      ...this._config,
      fallback: value,
    })
  }

}
