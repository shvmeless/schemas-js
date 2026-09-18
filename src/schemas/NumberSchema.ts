// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import type { GenericValidations } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'
import { stringify } from '@/utils/stringify'

// TYPE
type NumberValidations = GenericValidations<'min' | 'max' | 'integer' | 'finite' | 'safe', number>

// CLASS
export class NumberSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<number, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: NullishConfig<number>
  protected readonly _validations: NumberValidations

  // CONSTRUCTOR
  private constructor(config: NullishConfig<number>, validations: NumberValidations) {
    super()
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): NumberSchema<false, false, false> {
    return new NumberSchema({
      optional: false,
      nullable: false,
      default: undefined,
      fallback: undefined,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(config: Partial<NullishConfig<number>>): NumberSchema<TOptional, TNullable, TDefault> {
    return new NumberSchema(
      { ...this._config, ...config },
      this._validations,
    )
  }

  // UPDATER
  private _updateValidation(validations: NumberValidations): NumberSchema<TOptional, TNullable, TDefault> {
    return new NumberSchema(
      this._config,
      { ...this._validations, ...validations },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<number, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (typeof current !== 'number') {
        throw new ValidationError(input, 'The value must be a number.')
      }

      return current

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): NumberSchema<true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): NumberSchema<TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: number): NumberSchema<TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: number): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // METHOD
  public lessThan(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this._updateValidation({
      max: (current, initial) => {
        if (current < target) return
        throw new ValidationError(initial, `The value must be less than ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public lessThanOrEqual(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this._updateValidation({
      max: (current, initial) => {
        if (current <= target) return
        throw new ValidationError(initial, `The value must be less than or equal to ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public greaterThan(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this._updateValidation({
      min: (current, initial) => {
        if (current > target) return
        throw new ValidationError(initial, `The value must be greater than ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public greaterThanOrEqual(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this._updateValidation({
      min: (current, initial) => {
        if (current >= target) return
        throw new ValidationError(initial, `The value must be greater than or equal to ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public negative(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      min: (current, initial) => {
        if (current < 0) return
        throw new ValidationError(initial, 'The value must be a negative number.')
      },
    })
  }

  // METHOD
  public positive(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      max: (current, initial) => {
        if (current > 0) return
        throw new ValidationError(initial, 'The value must be a positive number.')
      },
    })
  }

  // METHOD
  public integer(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      integer: (current, initial) => {
        if (Number.isInteger(current)) return
        throw new ValidationError(initial, 'The value must be an integer.')
      },
    })
  }

  // METHOD
  public finite(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      finite: (current, initial) => {
        if (Number.isFinite(current)) return
        throw new ValidationError(initial, 'The value must be a finite number.')
      },
    })
  }

  // METHOD
  public safe(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      safe: (current, initial) => {
        if (current >= Number.MIN_SAFE_INTEGER && current <= Number.MAX_SAFE_INTEGER) return
        throw new ValidationError(initial, 'The value must be a safe integer.')
      },
    })
  }

}
