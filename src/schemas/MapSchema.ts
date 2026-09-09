// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'
import { stringify } from '@/utils/stringify'

// CLASS
export class MapSchema<K, T> implements GenericSchema<Map<K, T>> {

  // PROPERTIES
  private readonly _keySchema: GenericSchema<K>
  private readonly _valueSchema: GenericSchema<T>
  private readonly _queue: Array<(original: Map<K, T>, output: Map<K, T>) => Map<K, T>>
  private readonly _prune: boolean

  // CONSTRUCTOR
  private constructor(keySchema: GenericSchema<K>, valueSchema: GenericSchema<T>, queue: Array<(original: Map<K, T>, output: Map<K, T>) => Map<K, T>>, prune: boolean) {
    this._keySchema = keySchema
    this._valueSchema = valueSchema
    this._queue = queue
    this._prune = prune
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<K, T>(keySchema: GenericSchema<K>, valueSchema: GenericSchema<T>): MapSchema<K, T> {
    return new MapSchema(keySchema, valueSchema, [], false)
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private clone(params: {
    keySchema?: GenericSchema<K>
    valueSchema?: GenericSchema<T>
    queue?: Array<(original: Map<K, T>, output: Map<K, T>) => Map<K, T>>
    prune?: boolean
  } = {}): MapSchema<K, T> {
    return new MapSchema(
      params.keySchema ?? this._keySchema,
      params.valueSchema ?? this._valueSchema,
      params.queue ?? this._queue,
      params.prune ?? this._prune,
    )
  }

  // UPDATER
  private push(fn: (original: Map<K, T>, output: Map<K, T>) => Map<K, T>): MapSchema<K, T> {
    return new MapSchema(this._keySchema, this._valueSchema, [...this._queue, fn], false)
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Map<K, T> {

    if (!(input instanceof Map)) {
      throw new ValidationError(input, 'The value must be a Map.')
    }

    let result = new Map<K, T>()
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

    for (const fn of this._queue) {
      result = fn(input as Map<K, T>, result)
    }

    return result

  }

  // --------------------------------------------------------------------------

  // METHOD
  public prune(): MapSchema<K, T> {
    return this.clone({ prune: true })
  }

  // METHOD
  public size(length: number): MapSchema<K, T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.size !== length) throw new ValidationError(original, `The value must be ${stringify(length)} entries long.`)
      return output
    })
  }

  // METHOD
  public min(length: number): MapSchema<K, T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.size < length) throw new ValidationError(original, `The value must be at least ${stringify(length)} entries long.`)
      return output
    })
  }

  // METHOD
  public max(length: number): MapSchema<K, T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.size > length) throw new ValidationError(original, `The value must be at most ${stringify(length)} entries long.`)
      return output
    })
  }

  // METHOD
  public filter(callback: (value: T, key: K, map: Map<K, T>) => boolean): MapSchema<K, T> {
    return this.push((_, output) => {
      const entries = Array.from(output).filter(([key, value]) => callback(value, key, output))
      return new Map(entries)
    })
  }

  // METHOD
  public some(callback: (value: T, key: K, map: Map<K, T>) => boolean): MapSchema<K, T> {
    return this.push((original, output) => {
      for (const [key, value] of output) {
        if (callback(value, key, output)) return output
      }
      throw new ValidationError(original, 'No entry satisfies the given validation function.')
    })
  }

  // METHOD
  public every(callback: (value: T, key: K, map: Map<K, T>) => boolean): MapSchema<K, T> {
    return this.push((original, output) => {
      for (const [key, value] of output) {
        if (!callback(value, key, output)) throw new ValidationError(original, 'At least one entry does not satisfy the given validation function.')
      }
      return output
    })
  }

  // METHOD
  public none(callback: (value: T, key: K, map: Map<K, T>) => boolean): MapSchema<K, T> {
    return this.push((original, output) => {
      for (const [key, value] of output) {
        if (callback(value, key, output)) throw new ValidationError(original, 'At least one entry satisfies the given validation function.')
      }
      return output
    })
  }

}
