// IMPORTS
import { GenericSchema } from '@/common'
import { ValidationError } from '@/errors/ValidationError'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { TransformSchema } from '@/schemas/TransformSchema'

// CLASS
export class BooleanSchema implements GenericSchema<boolean> {

  // CONSTRUCTOR
  private constructor() {}

  // CONSTRUCTOR
  public static create(): BooleanSchema {
    return new BooleanSchema()
  }

  // METHOD
  public validate(input: unknown): boolean {

    if (typeof input !== 'boolean') {
      throw new ValidationError(input, 'The value must be a boolean.')
    }

    return input
  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public optional(): OptionalSchema<boolean, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<boolean, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<boolean | NT> {
    return UnionSchema.create(this as GenericSchema<boolean>, schema)
  }

  // METHOD
  public fallback(value: boolean): FallbackSchema<boolean> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: boolean) => V): TransformSchema<boolean, V> {
    return TransformSchema.create(this, fn)
  }

}
