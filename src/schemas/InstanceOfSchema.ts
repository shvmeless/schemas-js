// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { TransformSchema } from '@/schemas/TransformSchema'

// TYPE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor<T = unknown> = abstract new (...args: Array<any>) => T

// CLASS
export class InstanceOfSchema<T extends AnyConstructor> implements GenericSchema<InstanceType<T>> {

  // PROPERTIES
  private readonly _constructor: T

  // CONSTRUCTOR
  private constructor(constructor: T) {
    this._constructor = constructor
  }

  // CONSTRUCTOR
  public static create<T extends AnyConstructor>(constructor: T): InstanceOfSchema<T> {
    return new InstanceOfSchema(constructor)
  }

  // METHOD
  public validate(input: unknown): InstanceType<T> {

    if (!(input instanceof this._constructor)) {
      throw new ValidationError(input, `Expected instance of ${this._constructor.name}.`)
    }

    return input as InstanceType<T>

  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public optional(): OptionalSchema<InstanceType<T>, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<InstanceType<T>, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<T | NT> {
    return UnionSchema.create(this as GenericSchema<T>, schema)
  }

  // METHOD
  public fallback(value: InstanceType<T>): FallbackSchema<InstanceType<T>> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: InstanceType<T>) => V): TransformSchema<InstanceType<T>, V> {
    return TransformSchema.create(this, fn)
  }

}
