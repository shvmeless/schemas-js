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
export class ArraySchema<T> implements GenericSchema<Array<T>> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>
  private readonly _queue: Array<(original: Array<T>, output: Array<T>) => Array<T>>

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>, queue: Array<(original: Array<T>, output: Array<T>) => Array<T>>) {
    this._schema = schema
    this._queue = queue
  }

  // CONSTRUCTOR
  public static create<T>(schema: GenericSchema<T>): ArraySchema<T> {
    return new ArraySchema<T>(schema, [])
  }

  // CONSTRUCTOR
  private push(fn: (original: Array<T>, output: Array<T>) => Array<T>): ArraySchema<T> {
    return new ArraySchema<T>(this._schema, [...this._queue, fn])
  }

  // METHOD
  private checkType(input: unknown): Array<T> {

    if (!Array.isArray(input)) {
      throw new ValidationError(input, 'The value must be an array.')
    }

    const result: Array<T> = []
    const errors = ValidationError.prepare()

    input.forEach((element, index) => {
      try {
        result[index] = this._schema.validate(element)
      } catch (error) {
        if (error instanceof ValidationError) errors.add(index, error)
        else throw error
      }
    })

    if (errors.size > 0) {
      errors.throw(input, 'At least one element does not match the given schema.')
    }

    return result

  }

  // METHOD
  public validate(input: unknown): Array<T> {

    // if (!Array.isArray(input)) {
    //   throw new ValidationError(input, 'The value must be an array.')
    // }

    // const result: Array<T> = []
    // const errors = ValidationError.prepare()

    // input.forEach((element, index) => {
    //   try {
    //     result[index] = this._schema.validate(element)
    //   } catch (error) {
    //     if (error instanceof ValidationError) errors.add(index, error)
    //     else throw error
    //   }
    // })

    // if (errors.size > 0) {
    //   errors.throw(input, 'At least one element does not match the given schema.')
    // }

    let result = this.checkType(input)

    for (const fn of this._queue) {
      result = fn(input as Array<T>, result)
    }

    return result

  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public optional(): OptionalSchema<Array<T>, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<Array<T>, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<Array<T> | NT> {
    return UnionSchema.create(this as GenericSchema<Array<T>>, schema)
  }

  // METHOD
  public fallback(value: Array<T>): FallbackSchema<Array<T>> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: Array<T>) => V): TransformSchema<Array<T>, V> {
    return TransformSchema.create(this, fn)
  }

  // METHOD
  public length(length: number): ArraySchema<T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.length !== length) throw new ValidationError(original, `The value must be ${stringify(length)} elements long.`)
      return output
    })
  }

  // METHOD
  public min(length: number): ArraySchema<T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.length < length) throw new ValidationError(original, `The value must be at least ${stringify(length)} elements long.`)
      return output
    })
  }

}
