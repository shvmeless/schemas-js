// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/schemas/GenericSchema'

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

}
