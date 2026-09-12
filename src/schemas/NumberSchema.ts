// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type NumberValidations = GenericValidations<'min' | 'max' | 'integer' | 'finite' | 'safe', number>

// INTERFACE
interface NumberConfig {
  optional: boolean
  nullable: boolean
  default: number | null
  fallback: number | null
}

// CLASS
export class NumberSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
implements GenericSchema<Maybe<number, TOptional, TNullable, TDefault>> {

  // PROPERTIES
  private readonly _config: NumberConfig
  private readonly _validations: NumberValidations

  // CONSTRUCTOR
  private constructor(config: NumberConfig, validations: NumberValidations) {
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): NumberSchema<false, false, false> {
    return new NumberSchema({ optional: false, nullable: false, default: null, fallback: null }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateValidation(validations: NumberValidations): NumberSchema<TOptional, TNullable, TDefault> {
    return new NumberSchema(this._config, { ...this._validations, ...validations })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _resolveInput(input: unknown): number | null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    if (typeof input !== 'number') {
      throw new ValidationError(input, 'The value must be a number.')
    }

    return input

  }

  // VALIDATOR
  public validate(input: unknown): Maybe<number, TOptional, TNullable, TDefault> {
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Maybe<number, TOptional, TNullable, TDefault>
      if (resolved === null) return null as Maybe<number, TOptional, TNullable, TDefault>

      runValidations(this._validations, input, resolved)

      return resolved as Maybe<number, TOptional, TNullable, TDefault>

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): NumberSchema<true, TNullable, TDefault> {
    return new NumberSchema({ ...this._config, optional: true }, this._validations)
  }

  // CONFIG
  public nullable(): NumberSchema<TOptional, true, TDefault> {
    return new NumberSchema({ ...this._config, nullable: true }, this._validations)
  }

  // CONFIG
  public default(value: number): NumberSchema<TOptional, TNullable, true> {
    return new NumberSchema({
      ...this._config,
      default: value,
    }, this._validations)
  }

  // CONFIG
  public fallback(value: number): NumberSchema<TOptional, TNullable, TDefault> {
    return new NumberSchema({
      ...this._config,
      fallback: value,
    }, this._validations)
  }

  // --------------------------------------------------------------------------

  // METHOD
  public lessThan(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.updateValidation({
      max: (current, initial) => {
        if (current < target) return
        throw new ValidationError(initial, `The value must be less than ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public lessThanOrEqual(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.updateValidation({
      max: (current, initial) => {
        if (current <= target) return
        throw new ValidationError(initial, `The value must be less than or equal to ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public greaterThan(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.updateValidation({
      min: (current, initial) => {
        if (current > target) return
        throw new ValidationError(initial, `The value must be greater than ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public greaterThanOrEqual(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.updateValidation({
      min: (current, initial) => {
        if (current >= target) return
        throw new ValidationError(initial, `The value must be greater than or equal to ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public negative(): NumberSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      min: (current, initial) => {
        if (current < 0) return
        throw new ValidationError(initial, 'The value must be a negative number.')
      },
    })
  }

  // METHOD
  public positive(): NumberSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      max: (current, initial) => {
        if (current > 0) return
        throw new ValidationError(initial, 'The value must be a positive number.')
      },
    })
  }

  // METHOD
  public integer(): NumberSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      integer: (current, initial) => {
        if (Number.isInteger(current)) return
        throw new ValidationError(initial, 'The value must be an integer.')
      },
    })
  }

  // METHOD
  public finite(): NumberSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      finite: (current, initial) => {
        if (Number.isFinite(current)) return
        throw new ValidationError(initial, 'The value must be a finite number.')
      },
    })
  }

  // METHOD
  public safe(): NumberSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      safe: (current, initial) => {
        if (current >= Number.MIN_SAFE_INTEGER && current <= Number.MAX_SAFE_INTEGER) return
        throw new ValidationError(initial, 'The value must be a safe integer.')
      },
    })
  }

}
