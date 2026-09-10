// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type NumberValidations = GenericValidations<'min' | 'max' | 'integer' | 'finite' | 'safe', number>

// CLASS
export class NumberSchema implements GenericSchema<number> {

  // PROPERTIES
  private readonly _validations: NumberValidations

  // CONSTRUCTOR
  private constructor(validations: NumberValidations) {
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): NumberSchema {
    return new NumberSchema({})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateValidation(validations: NumberValidations): NumberSchema {
    return new NumberSchema({ ...this._validations, ...validations })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): number {

    if (typeof input !== 'number') {
      throw new ValidationError(input, 'The value must be a number.')
    }

    runValidations(this._validations, input, input)

    return input

  }

  // --------------------------------------------------------------------------

  // METHOD
  public lessThan(target: number): NumberSchema {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.updateValidation({
      max: (current, initial) => {
        if (current < target) return
        throw new ValidationError(initial, `The value must be less than ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public lessThanOrEqual(target: number): NumberSchema {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.updateValidation({
      max: (current, initial) => {
        if (current <= target) return
        throw new ValidationError(initial, `The value must be less than or equal to ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public greaterThan(target: number): NumberSchema {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.updateValidation({
      min: (current, initial) => {
        if (current > target) return
        throw new ValidationError(initial, `The value must be greater than ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public greaterThanOrEqual(target: number): NumberSchema {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.updateValidation({
      min: (current, initial) => {
        if (current >= target) return
        throw new ValidationError(initial, `The value must be greater than or equal to ${stringify(target)}.`)
      },
    })
  }

  // METHOD
  public negative(): NumberSchema {
    return this.updateValidation({
      min: (current, initial) => {
        if (current < 0) return
        throw new ValidationError(initial, 'The value must be a negative number.')
      },
    })
  }

  // METHOD
  public positive(): NumberSchema {
    return this.updateValidation({
      max: (current, initial) => {
        if (current > 0) return
        throw new ValidationError(initial, 'The value must be a positive number.')
      },
    })
  }

  // METHOD
  public integer(): NumberSchema {
    return this.updateValidation({
      integer: (current, initial) => {
        if (Number.isInteger(current)) return
        throw new ValidationError(initial, 'The value must be an integer.')
      },
    })
  }

  // METHOD
  public finite(): NumberSchema {
    return this.updateValidation({
      finite: (current, initial) => {
        if (Number.isFinite(current)) return
        throw new ValidationError(initial, 'The value must be a finite number.')
      },
    })
  }

  // METHOD
  public safe(): NumberSchema {
    return this.updateValidation({
      safe: (current, initial) => {
        if (current >= Number.MIN_SAFE_INTEGER && current <= Number.MAX_SAFE_INTEGER) return
        throw new ValidationError(initial, 'The value must be a safe integer.')
      },
    })
  }

}
