// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/schemas/GenericSchema'
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
  public transform<V>(fn: (value: boolean) => V): TransformSchema<boolean, V> {
    return TransformSchema.create(this, fn)
  }

}
