// IMPORTS
import { GenericSchema } from '@/lib/GenericSchema'
import type { Nullable } from '@/lib/NullableSchema'
import type { Optional } from '@/lib/OptionalSchema'
import { type Unset, UNSET } from '@/utils/unset'

// TYPE
export type Nullish<TType, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  = Optional<Nullable<TType, TNullable, TDefault>, TOptional, TDefault>

// CLASS
export abstract class NullishSchema<TType, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<TType, Nullish<TType, TOptional, TNullable, TDefault>> {

  // ABSTRACT PROPERTIES
  protected abstract readonly _optional: boolean
  protected abstract readonly _nullable: boolean
  protected abstract readonly _default: TType | Unset

  // ABSTRACT METHODS
  public abstract optional(): NullishSchema<TType, true, TNullable, TDefault>
  public abstract nullable(): NullishSchema<TType, TOptional, true, TDefault>
  public abstract default(value: TType): NullishSchema<TType, TOptional, TNullable, true>

  // PROTECTED
  protected override _runSchema(fn: (current: unknown) => TType, input: unknown): Nullish<TType, TOptional, TNullable, TDefault> {
    type Output = Nullish<TType, TOptional, TNullable, TDefault>
    try {

      let resolved = input

      if (input === null && this._nullable) {
        if (this._default === UNSET) return null as Output
        resolved = this._default
      }

      if (input === undefined && this._optional) {
        if (this._default === UNSET) return undefined as Output
        resolved = this._default
      }

      const output = fn(resolved)

      this._runTests(input, output)

      return output

    } catch (error) {
      if (this._fallback === UNSET) throw error
      return this._fallback as Output
    }
  }

}
