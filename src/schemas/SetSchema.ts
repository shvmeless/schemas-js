// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'
import { stringify } from '@/utils/stringify'

// CLASS
export class SetSchema<TValue> implements GenericSchema<Set<TValue>> {

  // PROPERTIES
  private readonly _schema: GenericSchema<TValue>
  private readonly _validations: Array<(initial: Set<TValue>, current: Set<TValue>) => undefined>
  private readonly _prune: boolean

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<TValue>, validations: Array<(initial: Set<TValue>, current: Set<TValue>) => undefined>, prune: boolean) {
    this._schema = schema
    this._validations = validations
    this._prune = prune
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue>(schema: GenericSchema<TValue>): SetSchema<TValue> {
    return new SetSchema<TValue>(schema, [], false)
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private clone(params: {
    schema?: GenericSchema<TValue>
    validations?: Array<(initial: Set<TValue>, current: Set<TValue>) => undefined>
    prune?: boolean
  } = {}): SetSchema<TValue> {
    return new SetSchema<TValue>(
      params.schema ?? this._schema,
      params.validations ?? this._validations,
      params.prune ?? this._prune,
    )
  }

  // UPDATER
  private push(fn: (initial: Set<TValue>, current: Set<TValue>) => undefined): SetSchema<TValue> {
    return new SetSchema<TValue>(this._schema, [...this._validations, fn], false)
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
        const value = this._schema.validate(element)
        result.add(value)
      } catch (error) {
        if (error instanceof ValidationError) {
          if (this._prune) continue
          errors.add(element, error)
        } else throw error
      }
    }

    if (errors.size > 0) {
      errors.throw(input, 'At least one element does not match the given schema.')
    }

    for (const fn of this._validations) {
      fn(input as Set<TValue>, result)
    }

    return result

  }

  // --------------------------------------------------------------------------

  // METHOD
  public prune(): SetSchema<TValue> {
    return this.clone({ prune: true })
  }

  // METHOD
  public size(length: number): SetSchema<TValue> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (current.size !== length) throw new ValidationError(initial, `The value must be ${stringify(length)} elements long.`)
    })
  }

  // METHOD
  public min(length: number): SetSchema<TValue> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (current.size < length) throw new ValidationError(initial, `The value must be at least ${stringify(length)} elements long.`)
    })
  }

  // METHOD
  public max(length: number): SetSchema<TValue> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (current.size > length) throw new ValidationError(initial, `The value must be at most ${stringify(length)} elements long.`)
    })
  }

  // METHOD
  public some(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue> {
    return this.push((initial, current) => {
      for (const value of current) {
        if (callback(value, current)) return
      }
      throw new ValidationError(initial, 'No element satisfies the given validation function.')
    })
  }

  // METHOD
  public every(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue> {
    return this.push((initial, current) => {
      for (const value of current) {
        if (!callback(value, current)) throw new ValidationError(initial, 'At least one element does not satisfy the given validation function.')
      }
    })
  }

  // METHOD
  public none(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue> {
    return this.push((initial, current) => {
      for (const value of current) {
        if (callback(value, current)) throw new ValidationError(initial, 'At least one element satisfies the given validation function.')
      }
    })
  }

}
