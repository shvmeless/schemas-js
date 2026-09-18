// IMPORTS
import type { TestObject } from '@/lib/GenericSchema'
import { GenericSchema } from '@/lib/GenericSchema'

// TYPE
export type Optional<TType, TOptional extends boolean, TDefault extends boolean>
  = TOptional extends true ? TDefault extends true ? TType : TType | undefined : TType

// INTERFACE
export interface OptionalConfig<TType> {
  optional: boolean
  default: TType | undefined
  fallback: TType | undefined
}

// CLASS
export abstract class OptionalSchema<TType, TOptional extends boolean, TDefault extends boolean>
  extends GenericSchema<TType, Optional<TType, TOptional, TDefault>> {

  // ABSTRACT PROPERTIES
  protected abstract override readonly _config: OptionalConfig<TType>
  protected abstract override readonly _tests: TestObject<TType>

  // ABSTRACT METHODS
  public abstract optional(): OptionalSchema<TType, true, TDefault>
  public abstract default(value: TType): OptionalSchema<TType, TOptional, true>

  // PROTECTED
  protected override _runSchema(fn: (current: unknown) => TType, input: unknown): Optional<TType, TOptional, TDefault> {
    type Output = Optional<TType, TOptional, TDefault>
    try {

      let resolved = input

      if (input === undefined && this._config.optional) {
        if (this._config.default === undefined) return undefined as Output
        resolved = this._config.default
      }

      const output = fn(resolved)

      this._runTests(input, output)

      return output

    } catch (error) {
      if (this._config.fallback === undefined) throw error
      return this._config.fallback as Output
    }
  }

}
