// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type SetValidations<TValue> = GenericValidations<'size' | 'min' | 'max' | 'some' | 'every' | 'none', Set<TValue>>

// INTERFACE
interface SetConfig<TValue> {
  schema: GenericSchema<TValue>
  prune: boolean
}

// CLASS
export class SetSchema<TValue> implements GenericSchema<Set<TValue>> {

  // PROPERTIES
  private readonly _config: SetConfig<TValue>
  private readonly _validations: SetValidations<TValue>

  // CONSTRUCTOR
  private constructor(config: SetConfig<TValue>, validations: SetValidations<TValue>) {
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue>(schema: GenericSchema<TValue>): SetSchema<TValue> {
    return new SetSchema<TValue>({
      schema: schema,
      prune: false,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateConfig(config: Partial<SetConfig<TValue>> = {}): SetSchema<TValue> {
    return new SetSchema<TValue>(
      { ...this._config, ...config },
      this._validations,
    )
  }

  // UPDATER
  private updateValidation(validations: SetValidations<TValue>): SetSchema<TValue> {
    return new SetSchema<TValue>(
      this._config,
      { ...this._validations, ...validations },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Set<TValue> {

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

    return result

  }

  // --------------------------------------------------------------------------

  // METHOD
  public prune(): SetSchema<TValue> {
    return this.updateConfig({ prune: true })
  }

  // METHOD
  public size(length: number): SetSchema<TValue> {
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
  public min(length: number): SetSchema<TValue> {
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
  public max(length: number): SetSchema<TValue> {
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
  public some(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue> {
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
  public every(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue> {
    return this.updateValidation({
      every: (current, initial) => {
        for (const value of current) {
          if (!callback(value, current)) throw new ValidationError(initial, 'At least one element does not satisfy the given validation function.')
        }
      },
    })
  }

  // METHOD
  public none(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue> {
    return this.updateValidation({
      none: (current, initial) => {
        for (const value of current) {
          if (callback(value, current)) throw new ValidationError(initial, 'At least one element satisfies the given validation function.')
        }
      },
    })
  }

}
