// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import type { TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'
import { stringify } from '@/utils/stringify'

// CLASS
export class NumberSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<number, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: NullishConfig<number>
  protected readonly _tests: TestObject<number>

  // CONSTRUCTOR
  private constructor(config: NullishConfig<number>, tests: TestObject<number>) {
    super()
    this._config = config
    this._tests = tests
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
      this._tests,
    )
  }

  // UPDATER
  private _updateTests(tests: TestObject<number>): NumberSchema<TOptional, TNullable, TDefault> {
    return new NumberSchema(
      this._config,
      { ...this._tests, ...tests },
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
    return this._updateTests({
      max: (current) => {
        if (current >= target) return `The value must be less than ${stringify(target)}.`
        return null
      },
    })
  }

  // METHOD
  public lessThanOrEqual(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this._updateTests({
      max: (current) => {
        if (current > target) return `The value must be less than or equal to ${stringify(target)}.`
        return null
      },
    })
  }

  // METHOD
  public greaterThan(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this._updateTests({
      min: (current) => {
        if (current <= target) return `The value must be greater than ${stringify(target)}.`
        return null
      },
    })
  }

  // METHOD
  public greaterThanOrEqual(target: number): NumberSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this._updateTests({
      min: (current) => {
        if (current < target) return `The value must be greater than or equal to ${stringify(target)}.`
        return null
      },
    })
  }

  // METHOD
  public negative(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      min: (current) => {
        if (current >= 0) return 'The value must be a negative number.'
        return null
      },
    })
  }

  // METHOD
  public positive(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      max: (current) => {
        if (current <= 0) return 'The value must be a positive number.'
        return null
      },
    })
  }

  // METHOD
  public integer(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      integer: (current) => {
        if (!Number.isInteger(current)) return 'The value must be an integer.'
        return null
      },
    })
  }

  // METHOD
  public finite(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      finite: (current) => {
        if (!Number.isFinite(current)) return 'The value must be a finite number.'
        return null
      },
    })
  }

  // METHOD
  public safe(): NumberSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      safe: (current) => {
        if (Number.isNaN(current)) return 'The value must be a safe integer.'
        if (current < Number.MIN_SAFE_INTEGER || current > Number.MAX_SAFE_INTEGER) return 'The value must be a safe integer.'
        return null
      },
    })
  }

}
