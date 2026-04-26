// IMPORTS
import { GenericSchema } from '@/common'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { TransformSchema } from '@/schemas/TransformSchema'
import { UnionSchema } from '@/schemas/UnionSchema'

// CLASS
export class OptionalSchema<T, D extends T | undefined> implements GenericSchema<T | D> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>
  private readonly _value: D

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>, value: D) {
    this._schema = schema
    this._value = value
  }

  // CONSTRUCTOR
  public static create<T>(schema: GenericSchema<T>): OptionalSchema<T, undefined> {
    return new OptionalSchema(schema, undefined)
  }

  // METHOD
  public validate(input: unknown): T | D {
    if (input === undefined) {
      if (this._value === undefined) return undefined as D
      input = this._value
    }
    return this._schema.validate(input)
  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public default(value: T): OptionalSchema<T, T> {
    return new OptionalSchema(this._schema, value)
  }

  // METHOD
  public nullable(): NullableSchema<T | D, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<T | D | NT> {
    return UnionSchema.create(this as GenericSchema<T | D>, schema)
  }

  // METHOD
  public fallback(value: T | D): FallbackSchema<T | D> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: T | D) => V): TransformSchema<T | D, V> {
    return TransformSchema.create(this, fn)
  }

}
