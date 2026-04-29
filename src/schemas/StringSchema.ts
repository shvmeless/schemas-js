// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { TransformSchema } from '@/schemas/TransformSchema'

// CLASS
export class StringSchema implements GenericSchema<string> {

  // CONSTRUCTOR
  private constructor() {}

  // CONSTRUCTOR
  public static create(): StringSchema {
    return new StringSchema()
  }

  // METHOD
  public validate(input: unknown): string {

    if (typeof input !== 'string') {
      throw new ValidationError(input, 'The value must be a string.')
    }

    return input
  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public optional(): OptionalSchema<string, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<string, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<string | NT> {
    return UnionSchema.create(this as GenericSchema<string>, schema)
  }

  // METHOD
  public fallback(value: string): FallbackSchema<string> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: string) => V): TransformSchema<string, V> {
    return TransformSchema.create(this, fn)
  }

}
