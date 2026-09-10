// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'

// CLASS
export class LiteralSchema<TValue extends string | number | boolean> implements GenericSchema<TValue> {

  // PROPERTIES
  private readonly _literal: TValue

  // CONSTRUCTOR
  private constructor(literal: TValue) {
    this._literal = literal
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue extends string | number | boolean>(literal: TValue): LiteralSchema<TValue> {
    return new LiteralSchema(literal)
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): TValue {

    if (input !== this._literal) {
      throw new ValidationError(input, 'The value must match the literal value.')
    }

    return this._literal

  }

}
