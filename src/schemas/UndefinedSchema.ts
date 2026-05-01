// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { TransformSchema } from '@/schemas/TransformSchema'

// CLASS
export class UndefinedSchema implements GenericSchema<undefined> {

  // CONSTRUCTOR
  private constructor() {}

  // CONSTRUCTOR
  public static create(): UndefinedSchema {
    return new UndefinedSchema()
  }

  // METHOD
  public validate(input: unknown): undefined {

    if (input !== undefined) {
      throw new ValidationError(input, 'The value must be undefined.')
    }

    return input
  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public nullable(): NullableSchema<undefined, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<undefined | NT> {
    return UnionSchema.create(this as GenericSchema<undefined>, schema)
  }

  // METHOD
  public fallback(value: undefined): FallbackSchema<undefined> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: undefined) => V): TransformSchema<undefined, V> {
    return TransformSchema.create(this, fn)
  }

}
