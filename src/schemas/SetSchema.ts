// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Optional } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type SetValidations<TValue> = GenericValidations<'size' | 'min' | 'max' | 'some' | 'every' | 'none', Set<TValue>>

// INTERFACE
interface SetConfig<TValue, TOptional extends boolean> {
  schema: GenericSchema<TValue>
  prune: boolean
  optional: TOptional
}

// CLASS
export class SetSchema<TValue, TOptional extends boolean>
implements GenericSchema<Optional<Set<TValue>, TOptional>> {

  // PROPERTIES
  private readonly _config: SetConfig<TValue, TOptional>
  private readonly _validations: SetValidations<TValue>

  // CONSTRUCTOR
  private constructor(config: SetConfig<TValue, TOptional>, validations: SetValidations<TValue>) {
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue>(schema: GenericSchema<TValue>): SetSchema<TValue, false> {
    return new SetSchema<TValue, false>({
      schema: schema,
      prune: false,
      optional: false,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateConfig(config: Partial<SetConfig<TValue, TOptional>> = {}): SetSchema<TValue, TOptional> {
    return new SetSchema<TValue, TOptional>(
      { ...this._config, ...config },
      this._validations,
    )
  }

  // UPDATER
  private updateValidation(validations: SetValidations<TValue>): SetSchema<TValue, TOptional> {
    return new SetSchema<TValue, TOptional>(
      this._config,
      { ...this._validations, ...validations },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Optional<Set<TValue>, TOptional> {

    if (input === undefined && this._config.optional) return input as Optional<Set<TValue>, TOptional>

    if (!(input instanceof Set)) {
      throw new ValidationError(input, 'The value must be a Set.')
    }

    const result = new Set<TValue>()
    const errors = ValidationError.prepare()

    for (const element of input) {
      try {
        const value = this._config.schema.validate(element)
        result.add(value)
      } catch (error) {
        if (error instanceof ValidationError) {
          if (this._config.prune) continue
          errors.add(element, error)
        } else throw error
      }
    }

    if (errors.size > 0) {
      errors.throw(input, 'At least one element does not match the given schema.')
    }

    runValidations(this._validations, input, result)

    return result as Optional<Set<TValue>, TOptional>

  }

  // --------------------------------------------------------------------------

  // METHOD
  public prune(): SetSchema<TValue, TOptional> {
    return this.updateConfig({ prune: true })
  }

  // CONFIG
  public optional(): SetSchema<TValue, true> {
    return new SetSchema({
      ...this._config,
      optional: true,
    }, this._validations)
  }

  // METHOD
  public size(length: number): SetSchema<TValue, TOptional> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      min: undefined,
      max: undefined,
      size: (current, initial) => {
        if (current.size === length) return
        throw new ValidationError(initial, `The value must be ${stringify(length)} elements long.`)
      },
    })
  }

  // METHOD
  public min(length: number): SetSchema<TValue, TOptional> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      min: (current, initial) => {
        if (current.size >= length) return
        throw new ValidationError(initial, `The value must be at least ${stringify(length)} elements long.`)
      },
    })
  }

  // METHOD
  public max(length: number): SetSchema<TValue, TOptional> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      max: (current, initial) => {
        if (current.size <= length) return
        throw new ValidationError(initial, `The value must be at most ${stringify(length)} elements long.`)
      },
    })
  }

  // METHOD
  public some(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue, TOptional> {
    return this.updateValidation({
      some: (current, initial) => {
        for (const value of current) {
          if (callback(value, current)) return
        }
        throw new ValidationError(initial, 'No element satisfies the given validation function.')
      },
    })
  }

  // METHOD
  public every(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue, TOptional> {
    return this.updateValidation({
      every: (current, initial) => {
        for (const value of current) {
          if (!callback(value, current)) throw new ValidationError(initial, 'At least one element does not satisfy the given validation function.')
        }
      },
    })
  }

  // METHOD
  public none(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue, TOptional> {
    return this.updateValidation({
      none: (current, initial) => {
        for (const value of current) {
          if (callback(value, current)) throw new ValidationError(initial, 'At least one element satisfies the given validation function.')
        }
      },
    })
  }

}
