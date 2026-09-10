// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'
import { stringify } from '@/utils/stringify'

// CLASS
export class MapSchema<TKey, TValue> implements GenericSchema<Map<TKey, TValue>> {

  // PROPERTIES
  private readonly _keySchema: GenericSchema<TKey>
  private readonly _valueSchema: GenericSchema<TValue>
  private readonly _validations: Array<(initial: Map<TKey, TValue>, current: Map<TKey, TValue>) => undefined>
  private readonly _prune: boolean

  // CONSTRUCTOR
  private constructor(keySchema: GenericSchema<TKey>, valueSchema: GenericSchema<TValue>, validations: Array<(initial: Map<TKey, TValue>, current: Map<TKey, TValue>) => undefined>, prune: boolean) {
    this._keySchema = keySchema
    this._valueSchema = valueSchema
    this._validations = validations
    this._prune = prune
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TKeey, TValue>(keySchema: GenericSchema<TKeey>, valueSchema: GenericSchema<TValue>): MapSchema<TKeey, TValue> {
    return new MapSchema(keySchema, valueSchema, [], false)
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private clone(params: {
    keySchema?: GenericSchema<TKey>
    valueSchema?: GenericSchema<TValue>
    validations?: Array<(initial: Map<TKey, TValue>, current: Map<TKey, TValue>) => undefined>
    prune?: boolean
  } = {}): MapSchema<TKey, TValue> {
    return new MapSchema(
      params.keySchema ?? this._keySchema,
      params.valueSchema ?? this._valueSchema,
      params.validations ?? this._validations,
      params.prune ?? this._prune,
    )
  }

  // UPDATER
  private push(fn: (initial: Map<TKey, TValue>, current: Map<TKey, TValue>) => undefined): MapSchema<TKey, TValue> {
    return new MapSchema(this._keySchema, this._valueSchema, [...this._validations, fn], false)
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Map<TKey, TValue> {

    if (!(input instanceof Map)) {
      throw new ValidationError(input, 'The value must be a Map.')
    }

    const result = new Map<TKey, TValue>()
    const errors = ValidationError.prepare()

    input.forEach((value: unknown, key: unknown) => {
      try {
        const validatedKey = this._keySchema.validate(key)
        const validatedValue = this._valueSchema.validate(value)
        result.set(validatedKey, validatedValue)
      } catch (error) {
        if (error instanceof ValidationError) {
          if (this._prune) return
          errors.add(key, error)
        } else throw error
      }
    })

    if (errors.size > 0) {
      errors.throw(input, 'At least one entry does not match the given schema.')
    }

    for (const fn of this._validations) {
      fn(input as Map<TKey, TValue>, result)
    }

    return result

  }

  // --------------------------------------------------------------------------

  // METHOD
  public prune(): MapSchema<TKey, TValue> {
    return this.clone({ prune: true })
  }

  // METHOD
  public size(length: number): MapSchema<TKey, TValue> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (current.size !== length) throw new ValidationError(initial, `The value must be ${stringify(length)} entries long.`)
    })
  }

  // METHOD
  public min(length: number): MapSchema<TKey, TValue> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (current.size < length) throw new ValidationError(initial, `The value must be at least ${stringify(length)} entries long.`)
    })
  }

  // METHOD
  public max(length: number): MapSchema<TKey, TValue> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (current.size > length) throw new ValidationError(initial, `The value must be at most ${stringify(length)} entries long.`)
    })
  }

  // METHOD
  public some(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue> {
    return this.push((initial, current) => {
      for (const [key, value] of current) {
        if (callback(value, key, current)) return
      }
      throw new ValidationError(initial, 'No entry satisfies the given validation function.')
    })
  }

  // METHOD
  public every(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue> {
    return this.push((initial, current) => {
      for (const [key, value] of current) {
        if (!callback(value, key, current)) throw new ValidationError(initial, 'At least one entry does not satisfy the given validation function.')
      }
    })
  }

  // METHOD
  public none(callback: (value: TValue, key: TKey, map: Map<TKey, TValue>) => boolean): MapSchema<TKey, TValue> {
    return this.push((initial, current) => {
      for (const [key, value] of current) {
        if (callback(value, key, current)) throw new ValidationError(initial, 'At least one entry satisfies the given validation function.')
      }
    })
  }

}
