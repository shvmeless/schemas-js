// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'

// TYPE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor<T = unknown> = abstract new (...args: Array<any>) => T

// CLASS
export class InstanceOfSchema<TConstructor extends AnyConstructor> implements GenericSchema<InstanceType<TConstructor>> {

  // PROPERTIES
  private readonly _constructor: TConstructor

  // CONSTRUCTOR
  private constructor(constructor: TConstructor) {
    this._constructor = constructor
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TConstructor extends AnyConstructor>(constructor: TConstructor): InstanceOfSchema<TConstructor> {
    return new InstanceOfSchema(constructor)
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): InstanceType<TConstructor> {

    if (!(input instanceof this._constructor)) {
      throw new ValidationError(input, `Expected instance of ${this._constructor.name}.`)
    }

    return input as InstanceType<TConstructor>

  }

}
