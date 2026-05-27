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
export class SetSchema<T> implements GenericSchema<Set<T>> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>
  private readonly _queue: Array<(original: Set<T>, output: Set<T>) => Set<T>>
  private readonly _prune: boolean

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>, queue: Array<(original: Set<T>, output: Set<T>) => Set<T>>, prune: boolean) {
    this._schema = schema
    this._queue = queue
    this._prune = prune
  }

  // CONSTRUCTOR
  public static create<T>(schema: GenericSchema<T>): SetSchema<T> {
    return new SetSchema<T>(schema, [], false)
  }

  // CONSTRUCTOR
  private push(fn: (original: Set<T>, output: Set<T>) => Set<T>): SetSchema<T> {
    return new SetSchema<T>(this._schema, [...this._queue, fn], false)
  }

  // CONSTRUCTOR
  private clone(params: {
    schema?: GenericSchema<T>
    queue?: Array<(original: Set<T>, output: Set<T>) => Set<T>>
    prune?: boolean
  } = {}): SetSchema<T> {
    return new SetSchema<T>(
      params.schema ?? this._schema,
      params.queue ?? this._queue,
      params.prune ?? this._prune,
    )
  }

  // METHOD
  public validate(input: unknown): Set<T> {

    if (!(input instanceof Set)) {
      throw new ValidationError(input, 'The value must be a Set.')
    }

    let result = new Set<T>()
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

    for (const fn of this._queue) {
      result = fn(input as Set<T>, result)
    }

    return result

  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public optional(): OptionalSchema<Set<T>, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<Set<T>, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<Set<T> | NT> {
    return UnionSchema.create(this as GenericSchema<Set<T>>, schema)
  }

  // METHOD
  public fallback(value: Set<T>): FallbackSchema<Set<T>> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: Set<T>) => V): TransformSchema<Set<T>, V> {
    return TransformSchema.create(this, fn)
  }

  // METHOD
  public prune(): SetSchema<T> {
    return this.clone({ prune: true })
  }

  // METHOD
  public size(length: number): SetSchema<T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.size !== length) throw new ValidationError(original, `The value must be ${stringify(length)} elements long.`)
      return output
    })
  }

  // METHOD
  public min(length: number): SetSchema<T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.size < length) throw new ValidationError(original, `The value must be at least ${stringify(length)} elements long.`)
      return output
    })
  }

  // METHOD
  public max(length: number): SetSchema<T> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.size > length) throw new ValidationError(original, `The value must be at most ${stringify(length)} elements long.`)
      return output
    })
  }

}
