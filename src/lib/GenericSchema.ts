// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { type Unset, UNSET } from '@/utils/unset'

// TYPE
export type TestFunction<TType> = (current: TType) => (string | null)
export type TestObject<TType> = Record<string, TestFunction<TType> | undefined>

// INTERFACE
export interface GenericConfig<TOutput> {
  fallback: TOutput | Unset
}

// CLASS
export abstract class GenericSchema<TType, TOutput = TType> {

  // ABSTRACT PROPERTIES
  protected abstract readonly _config: GenericConfig<TOutput>
  protected abstract readonly _tests: TestObject<TType>

  // ABSTRACT METHODS
  public abstract validate(input: unknown): TOutput
  public abstract fallback(value: TType): GenericSchema<TType, TOutput>

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
  protected _runSchema(fn: (current: unknown) => TType, input: unknown): TOutput {
    try {

      const output = fn(input)

      this._runTests(input, output)

      return output as unknown as TOutput

    } catch (error) {
      if (this._config.fallback === UNSET) throw error
      return this._config.fallback as unknown as TOutput
    }
  }

}
