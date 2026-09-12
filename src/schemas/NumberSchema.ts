// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type NumberValidations = GenericValidations<'min' | 'max' | 'integer' | 'finite' | 'safe', number>

// INTERFACE
interface NumberConfig<TOptional extends boolean, TNullable extends boolean> {
  optional: TOptional
  nullable: TNullable
}

// CLASS
export class NumberSchema<TOptional extends boolean, TNullable extends boolean>
implements GenericSchema<Maybe<number, TOptional, TNullable>> {

  // PROPERTIES
  private readonly _config: NumberConfig<TOptional, TNullable>
  private readonly _validations: NumberValidations

  // CONSTRUCTOR
  private constructor(config: NumberConfig<TOptional, TNullable>, validations: NumberValidations) {
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): NumberSchema<false, false> {
    return new NumberSchema({ optional: false, nullable: false }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateValidation(validations: NumberValidations): NumberSchema<TOptional, TNullable> {
    return new NumberSchema(this._config, { ...this._validations, ...validations })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<number, TOptional, TNullable> {

    if (input === undefined && this._config.optional) return input as Maybe<number, TOptional, TNullable>
    if (input === null && this._config.nullable) return input as Maybe<number, TOptional, TNullable>

    if (typeof input !== 'number') {
      throw new ValidationError(input, 'The value must be a number.')
    }

    runValidations(this._validations, input, input)

    return input as Maybe<number, TOptional, TNullable>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): NumberSchema<true, TNullable> {
    return new NumberSchema({ ...this._config, optional: true }, this._validations)
  }

  // CONFIG
  public nullable(): NumberSchema<TOptional, true> {
    return new NumberSchema({ ...this._config, nullable: true }, this._validations)
  }

  // METHOD
  public lessThan(target: number): NumberSchema<TOptional, TNullable> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.updateValidation({
      max: (current, initial) => {
        if (current < target) return
        throw new ValidationError(initial, `The value must be less than ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public lessThanOrEqual(target: number): NumberSchema<TOptional, TNullable> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.updateValidation({
      max: (current, initial) => {
        if (current <= target) return
        throw new ValidationError(initial, `The value must be less than or equal to ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public greaterThan(target: number): NumberSchema<TOptional, TNullable> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.updateValidation({
      min: (current, initial) => {
        if (current > target) return
        throw new ValidationError(initial, `The value must be greater than ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public greaterThanOrEqual(target: number): NumberSchema<TOptional, TNullable> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.updateValidation({
      min: (current, initial) => {
        if (current >= target) return
        throw new ValidationError(initial, `The value must be greater than or equal to ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public negative(): NumberSchema<TOptional, TNullable> {
    return this.updateValidation({
      min: (current, initial) => {
        if (current < 0) return
        throw new ValidationError(initial, 'The value must be a negative number.')
      },
    })
  }

  // METHOD
  public positive(): NumberSchema<TOptional, TNullable> {
    return this.updateValidation({
      max: (current, initial) => {
        if (current > 0) return
        throw new ValidationError(initial, 'The value must be a positive number.')
      },
    })
  }

  // METHOD
  public integer(): NumberSchema<TOptional, TNullable> {
    return this.updateValidation({
      integer: (current, initial) => {
        if (Number.isInteger(current)) return
        throw new ValidationError(initial, 'The value must be an integer.')
      },
    })
  }

  // METHOD
  public finite(): NumberSchema<TOptional, TNullable> {
    return this.updateValidation({
      finite: (current, initial) => {
        if (Number.isFinite(current)) return
        throw new ValidationError(initial, 'The value must be a finite number.')
      },
    })
  }

  // METHOD
  public safe(): NumberSchema<TOptional, TNullable> {
    return this.updateValidation({
      safe: (current, initial) => {
        if (current >= Number.MIN_SAFE_INTEGER && current <= Number.MAX_SAFE_INTEGER) return
        throw new ValidationError(initial, 'The value must be a safe integer.')
      },
    })
  }

}
