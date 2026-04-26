// IMPORTS
import { GenericSchema } from '@/interfaces'
import { ValidationError } from '@/errors/ValidationError'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'

// CLASS
export class LiteralSchema<T extends string | number | boolean> implements GenericSchema<T> {

  // PROPERTIES
  private readonly _literal: T

  // CONSTRUCTOR
  private constructor(literal: T) {
    this._literal = literal
  }

  // CONSTRUCTOR
  public static create<T extends string | number | boolean>(literal: T): LiteralSchema<T> {
    return new LiteralSchema(literal)
  }

  // METHOD
  public validate(input: unknown): T {

    if (input !== this._literal) {
      throw new ValidationError(input, `The value must be the literal ${JSON.stringify(this._literal)}.`)
    }

    return this._literal

  }

  // METHOD
  public optional(): OptionalSchema<T, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<T, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<T | NT> {
    return UnionSchema.create(this, schema)
  }

}
