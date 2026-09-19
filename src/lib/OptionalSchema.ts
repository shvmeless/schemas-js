// IMPORTS
import { GenericSchema } from '@/lib/GenericSchema'
import { type Unset, UNSET } from '@/utils/unset'

// TYPE
export type Optional<TType, TOptional extends boolean, TDefault extends boolean>
  = TOptional extends true ? TDefault extends true ? TType : TType | undefined : TType

// CLASS
export abstract class OptionalSchema<TType, TOptional extends boolean, TDefault extends boolean>
  extends GenericSchema<TType, Optional<TType, TOptional, TDefault>> {

  // ABSTRACT PROPERTIES
  protected abstract readonly _optional: boolean
  protected abstract readonly _default: TType | Unset

  // ABSTRACT METHODS
  public abstract optional(): OptionalSchema<TType, true, TDefault>
  public abstract default(value: TType): OptionalSchema<TType, TOptional, true>

  // PROTECTED
  protected override _runSchema(fn: (current: unknown) => TType, input: unknown): Optional<TType, TOptional, TDefault> {
    type Output = Optional<TType, TOptional, TDefault>
    try {

      let resolved = input

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
