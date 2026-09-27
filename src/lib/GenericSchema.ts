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
export type ParseFunction = (initial: unknown) => unknown
export type PrepareFunction<TType> = (current: TType, initial: unknown) => TType
export type TestFunction<TType> = (current: TType, initial: unknown) => void
export type TestObject<TType> = Record<string, TestFunction<TType> | undefined>
export type RefineFunction<TType> = (current: TType, initial: unknown) => TType

// INTERFACE
export interface GenericConfig<TType> {
  optional: boolean
  nullable: boolean
  default: TType | Unset
  fallback: TType | Unset
}

// INTERFACE
export interface GenericPipeline<TType> {
  parse: ParseFunction | null
  prepare: Array<PrepareFunction<TType>>
  tests: TestObject<TType>
  refine: Array<RefineFunction<TType>>
}

// CLASS
export abstract class GenericSchema<TType, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean> {

  // ABSTRACT PROPERTIES
  protected abstract readonly _optional: boolean
  protected abstract readonly _nullable: boolean
  protected abstract readonly _default: TType | Unset
  protected abstract readonly _fallback: TType | Unset
  protected abstract readonly _parse: ParseFunction | null
  protected abstract readonly _prepare: Array<PrepareFunction<TType>>
  protected abstract readonly _tests: TestObject<TType>
  protected abstract readonly _refine: Array<RefineFunction<TType>>

  // ABSTRACT METHODS
  public abstract validate(input: unknown): Nullish<TType, TOptional, TNullable, TDefault>
  public abstract optional(): GenericSchema<TType, true, TNullable, TDefault>
  public abstract nullable(): GenericSchema<TType, TOptional, true, TDefault>
  public abstract default(value: TType): GenericSchema<TType, TOptional, TNullable, true>
  public abstract fallback(value: TType): GenericSchema<TType, TOptional, TNullable, TDefault>
  public abstract parse(fn: ParseFunction): GenericSchema<TType, TOptional, TNullable, TDefault>
  public abstract prepare(fn: PrepareFunction<TType>): GenericSchema<TType, TOptional, TNullable, TDefault>
  public abstract test(id: string, test: TestFunction<TType>): GenericSchema<TType, TOptional, TNullable, TDefault>
  public abstract refine(fn: RefineFunction<TType>): GenericSchema<TType, TOptional, TNullable, TDefault>

  // PROTECTED
  protected _runParse(initial: unknown): unknown {
    try {
      return this._parse?.(initial) ?? initial
    } catch (error) {
      if (error instanceof ValidationError) throw error
      throw new ValidationError(initial, 'An unexpected error occurred while parsing the input.')
    }
  }

  // PROTECTED
  protected _runPrepare(initial: unknown, current: TType): TType {
    try {
      return this._prepare.reduce((current, prepare) => prepare(current, initial), current)
    } catch (error) {
      if (error instanceof ValidationError) throw error
      throw new ValidationError(initial, 'An unexpected error occurred while preparing the input.')
    }
  }

  // PROTECTED
  protected _runTests(initial: unknown, current: TType): void {
    const tests = Object.values(this._tests)
    for (const test of tests) {
      if (test === undefined) continue
      try {
        test(current, initial)
      } catch (error) {
        if (error instanceof ValidationError) throw error
        throw new ValidationError(initial, 'An unexpected error occurred while running a validation.')
      }
    }
  }

  // PROTECTED
  protected _runRefine(initial: unknown, current: TType): TType {
    try {
      return this._refine.reduce((current, refine) => refine(current, initial), current)
    } catch (error) {
      if (error instanceof ValidationError) throw error
      throw new ValidationError(initial, 'An unexpected error occurred while refining the input.')
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
      } else if (input === undefined && this._optional) {
        if (this._default === UNSET) return undefined as Output
        resolved = this._default
      }

      resolved = this._runParse(resolved)
      let output = fn(resolved)
      output = this._runPrepare(input, output)
      this._runTests(input, output)
      output = this._runRefine(input, output)

      return output

    } catch (error) {
      if (this._fallback === UNSET) throw error
      return this._fallback as Output
    }
  }

}
