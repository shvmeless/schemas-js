// IMPORTS
import type { GenericValidations } from '@/lib/GenericSchema'
import { GenericSchema } from '@/lib/GenericSchema'
import type { Nullable } from '@/lib/NullableSchema'
import type { Optional } from '@/lib/OptionalSchema'

// TYPE
export type Nullish<TType, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  = Optional<Nullable<TType, TNullable, TDefault>, TOptional, TDefault>

// INTERFACE
export interface NullishConfig<TType> {
  optional: boolean
  nullable: boolean
  default: TType | undefined
  fallback: TType | undefined
}

// CLASS
export abstract class NullishSchema<TType, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<TType, Nullish<TType, TOptional, TNullable, TDefault>> {

  // ABSTRACT PROPERTIES
  protected abstract override readonly _config: NullishConfig<TType>
  protected abstract override readonly _validations: GenericValidations<string, TType>

  // ABSTRACT METHODS
  public abstract optional(): NullishSchema<TType, true, TNullable, TDefault>
  public abstract nullable(): NullishSchema<TType, TOptional, true, TDefault>
  public abstract default(value: TType): NullishSchema<TType, TOptional, TNullable, true>

  // PROTECTED
  protected override validateSchema(fn: (current: unknown) => TType, input: unknown): Nullish<TType, TOptional, TNullable, TDefault> {
    type Output = Nullish<TType, TOptional, TNullable, TDefault>
    try {

      let resolved = input

      if (input === null && this._config.nullable) {
        if (this._config.default === undefined) return null as Output
        resolved = this._config.default
      }

      if (input === undefined && this._config.optional) {
        if (this._config.default === undefined) return undefined as Output
        resolved = this._config.default
      }

      const output = fn(resolved)

      this.runValidations(input, output)

      return output

    } catch (error) {
      if (this._config.fallback === undefined) throw error
      return this._config.fallback as Output
    }
  }

}
