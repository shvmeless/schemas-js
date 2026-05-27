// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { TransformSchema } from '@/schemas/TransformSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { stringify } from '@/utils/stringify'

// CLASS
export class MapSchema<K, T> implements GenericSchema<Map<K, T>> {

  // PROPERTIES
  private readonly _keySchema: GenericSchema<K>
  private readonly _valueSchema: GenericSchema<T>
  private readonly _queue: Array<(original: Map<K, T>, output: Map<K, T>) => Map<K, T>>

  // CONSTRUCTOR
  private constructor(keySchema: GenericSchema<K>, valueSchema: GenericSchema<T>, queue: Array<(original: Map<K, T>, output: Map<K, T>) => Map<K, T>>) {
    this._keySchema = keySchema
    this._valueSchema = valueSchema
    this._queue = queue
  }

  // CONSTRUCTOR
  public static create<K, T>(keySchema: GenericSchema<K>, valueSchema: GenericSchema<T>): MapSchema<K, T> {
    return new MapSchema(keySchema, valueSchema, [])
  }

  // CONSTRUCTOR
  private push(fn: (original: Map<K, T>, output: Map<K, T>) => Map<K, T>): MapSchema<K, T> {
    return new MapSchema(this._keySchema, this._valueSchema, [...this._queue, fn])
  }

  // METHOD
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
        if (error instanceof ValidationError) errors.add(key, error)
        else throw error
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

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public optional(): OptionalSchema<Map<K, T>, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<Map<K, T>, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<Map<K, T> | NT> {
    return UnionSchema.create(this as GenericSchema<Map<K, T>>, schema)
  }

  // METHOD
  public fallback(value: Map<K, T>): FallbackSchema<Map<K, T>> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: Map<K, T>) => V): TransformSchema<Map<K, T>, V> {
    return TransformSchema.create(this, fn)
  }

  // METHOD
  public size(length: number): MapSchema<K, T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.size !== length) throw new ValidationError(original, `The value must be ${stringify(length)} elements long.`)
      return output
    })
  }

  // METHOD
  public min(length: number): MapSchema<K, T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.size < length) throw new ValidationError(original, `The value must be at least ${stringify(length)} elements long.`)
      return output
    })
  }
}
