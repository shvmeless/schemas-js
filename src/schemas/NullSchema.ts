// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/schemas/GenericSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { TransformSchema } from '@/schemas/TransformSchema'

// CLASS
export class NullSchema implements GenericSchema<null> {

  // CONSTRUCTOR
  private constructor() {}

  // CONSTRUCTOR
  public static create(): NullSchema {
    return new NullSchema()
  }

  // METHOD
  public validate(input: unknown): null {

    if (input !== null) {
      throw new ValidationError(input, 'The value must be null.')
    }

    return input
  }

  // METHOD
  public fallback(value: null): FallbackSchema<null> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: null) => V): TransformSchema<null, V> {
    return TransformSchema.create(this, fn)
  }

}
