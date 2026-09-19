// IMPORTS
import { GenericSchema } from '@/lib/GenericSchema'
import { type Unset, UNSET } from '@/utils/unset'

// TYPE
export type Nullable<TType, TNullable extends boolean, TDefault extends boolean>
  = TNullable extends true ? TDefault extends true ? TType : TType | null : TType

// CLASS
export abstract class NullableSchema<TType, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<TType, Nullable<TType, TNullable, TDefault>> {

  // ABSTRACT PROPERTIES
  protected abstract readonly _nullable: boolean
  protected abstract readonly _default: TType | Unset

  // ABSTRACT METHODS
  public abstract nullable(): NullableSchema<TType, true, TDefault>
  public abstract default(value: TType): NullableSchema<TType, TNullable, true>

  // PROTECTED
  protected override _runSchema(fn: (current: unknown) => TType, input: unknown): Nullable<TType, TNullable, TDefault> {
    type Output = Nullable<TType, TNullable, TDefault>
    try {

      let resolved = input

      if (input === null && this._nullable) {
        if (this._default === UNSET) return null as Output
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
