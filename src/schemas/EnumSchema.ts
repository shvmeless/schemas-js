// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { TransformSchema } from '@/schemas/TransformSchema'

// CLASS
export class EnumSchema<T extends string | number> implements GenericSchema<T> {

  // PROPERTIES
  private readonly _values: ReadonlyArray<T>

  // CONSTRUCTOR
  private constructor(...values: ReadonlyArray<T>) {
    this._values = values
    if (this._values.length === 0) {
      throw new Error('Must provide at least one value.')
    }
  }

  // CONSTRUCTOR
  public static create<T extends string | number>(...values: ReadonlyArray<T>): EnumSchema<T> {
    return new EnumSchema(...values)
  }

  // METHOD
  public validate(input: unknown): T {

    if (!this._values.includes(input as T)) {
      const valuesStr = this._values.map((v) => JSON.stringify(v)).join(', ')
      throw new ValidationError(input, `The value must be one of ${valuesStr}.`)
    }

    return input as T

  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public optional(): OptionalSchema<T, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<T, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<T | NT> {
    return UnionSchema.create(this as GenericSchema<T>, schema)
  }

  // METHOD
  public fallback(value: T): FallbackSchema<T> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: T) => V): TransformSchema<T, V> {
    return TransformSchema.create(this, fn)
  }

}
