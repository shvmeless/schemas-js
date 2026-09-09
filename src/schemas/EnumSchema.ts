// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/schemas/GenericSchema'
import { TransformSchema } from '@/schemas/TransformSchema'

// CLASS
export class EnumSchema<T extends string | number = never> implements GenericSchema<T> {

  // PROPERTIES
  private readonly _values: ReadonlyArray<T>

  // CONSTRUCTOR
  private constructor(...values: ReadonlyArray<T>) {
    this._values = values
    if (this._values.length === 0) {
      throw new Error('Must provide at least one literal value.')
    }
  }

  // CONSTRUCTOR
  public static create<T extends string | number = never>(...values: ReadonlyArray<T>): EnumSchema<T> {
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
  public transform<V>(fn: (value: T) => V): TransformSchema<T, V> {
    return TransformSchema.create(this, fn)
  }

}
