// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { TransformSchema } from '@/schemas/TransformSchema'
import { stringify } from '@/utils/stringify'

// CLASS
export class NumberSchema implements GenericSchema<number> {

  // PROPERTIES
  public readonly _queue: Array<(original: number, output: number) => number>

  // CONSTRUCTOR
  private constructor(queue: Array<(original: number, output: number) => number>) {
    this._queue = queue
  }

  // CONSTRUCTOR
  private push(fn: (original: number, output: number) => number): NumberSchema {
    return new NumberSchema([...this._queue, fn])
  }

  // CONSTRUCTOR
  public static create(): NumberSchema {
    return new NumberSchema([])
  }

  // METHOD
  public validate(input: unknown): number {

    if (typeof input !== 'number') {
      throw new ValidationError(input, 'The value must be a number.')
    }
    let output = input
    for (const fn of this._queue) {
      output = fn(input, output)
    }

    return output

  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public optional(): OptionalSchema<number, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<number, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<number | NT> {
    return UnionSchema.create(this as GenericSchema<number>, schema)
  }

  // METHOD
  public fallback(value: number): FallbackSchema<number> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: number) => V): TransformSchema<number, V> {
    return TransformSchema.create(this, fn)
  }

  // METHOD
  public lessThan(target: number, options: { clamp?: boolean } = {}): NumberSchema {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.push((original, output) => {
      if (output < target) return output
      if (options.clamp === true) return target - 1
      throw new ValidationError(original, `The value must be less than ${stringify(target)}.`)
    })
  }

  // METHOD
  public lessThanOrEqual(target: number, options: { clamp?: boolean } = {}): NumberSchema {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.push((original, output) => {
      if (output <= target) return output
      if (options.clamp === true) return target
      throw new ValidationError(original, `The value must be less than or equal to ${stringify(target)}.`)
    })
  }

  // METHOD
  public greaterThan(target: number, options: { clamp?: boolean } = {}): NumberSchema {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.push((original, output) => {
      if (output > target) return output
      if (options.clamp === true) return target + 1
      throw new ValidationError(original, `The value must be greater than ${stringify(target)}.`)
    })
  }

  // METHOD
  public greaterThanOrEqual(target: number, options: { clamp?: boolean } = {}): NumberSchema {
    if (Number.isNaN(target)) throw new Error('The `target` parameter cannot be NaN.')
    return this.push((original, output) => {
      if (output >= target) return output
      if (options.clamp === true) return target
      throw new ValidationError(original, `The value must be greater than or equal to ${stringify(target)}.`)
    })
  }

  // METHOD
  public negative(): NumberSchema {
    return this.push((original, output) => {
      if (output < 0) return output
      throw new ValidationError(original, 'The value must be a negative number.')
    })
  }

  // METHOD
  public positive(): NumberSchema {
    return this.push((original, output) => {
      if (output > 0) return output
      throw new ValidationError(original, 'The value must be a positive number.')
    })
  }

  // METHOD
  public integer(): NumberSchema {
    return this.push((original, output) => {
      if (Number.isInteger(output)) return output
      throw new ValidationError(original, 'The value must be an integer.')
    })
  }

}
