// IMPORTS
import { type Unset, UNSET } from '@/utils/unset'
import { ValidationError } from '@/errors/ValidationError'

// TYPE
export type Optional<TType, TOptional extends boolean, TDefault extends boolean>
  = TOptional extends true ? TDefault extends true ? TType : TType | undefined : TType

// TYPE
export type Nullable<TType, TNullable extends boolean, TDefault extends boolean>
  = TNullable extends true ? TDefault extends true ? TType : TType | null : TType

// TYPE
export type Nullish<TType, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  = Optional<Nullable<TType, TNullable, TDefault>, TOptional, TDefault>

// TYPE
export type TestFunction<TType> = (current: TType) => (string | null)
export type TestObject<TType> = Record<string, TestFunction<TType> | undefined>

// CLASS
export abstract class GenericSchema<TType, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean> {

  // ABSTRACT PROPERTIES
  protected abstract readonly _optional: boolean
  protected abstract readonly _nullable: boolean
  protected abstract readonly _default: TType | Unset
  protected abstract readonly _fallback: TType | Unset
  protected abstract readonly _tests: TestObject<TType>

  // ABSTRACT METHODS
  public abstract validate(input: unknown): Nullish<TType, TOptional, TNullable, TDefault>
  public abstract optional(): GenericSchema<TType, true, TNullable, TDefault>
  public abstract nullable(): GenericSchema<TType, TOptional, true, TDefault>
  public abstract default(value: TType): GenericSchema<TType, TOptional, TNullable, true>
  public abstract fallback(value: TType): GenericSchema<TType, TOptional, TNullable, TDefault>
  public abstract test(id: string, test: TestFunction<TType>): GenericSchema<TType, TOptional, TNullable, TDefault>

  // PROTECTED
  protected _runTests(initial: unknown, current: TType): void {
    const tests = Object.values(this._tests)
    for (const test of tests) {
      if (test === undefined) continue
      const result = test(current)
      if (typeof result === 'string') throw new ValidationError(initial, result)
    }
  }

  // PROTECTED
  protected _runSchema(fn: (current: unknown) => TType, input: unknown): Nullish<TType, TOptional, TNullable, TDefault> {
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
