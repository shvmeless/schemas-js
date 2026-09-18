// IMPORTS
import type { GenericValidations } from '@/lib/GenericSchema'
import { GenericSchema } from '@/lib/GenericSchema'

// TYPE
export type Nullable<TType, TNullable extends boolean, TDefault extends boolean>
  = TNullable extends true ? TDefault extends true ? TType : TType | null : TType

// INTERFACE
export interface NullableConfig<TType> {
  nullable: boolean
  default: TType | null
  fallback: TType | null
}

// CLASS
export abstract class NullableSchema<TType, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<TType, Nullable<TType, TNullable, TDefault>> {

  // ABSTRACT PROPERTIES
  protected abstract override readonly _config: NullableConfig<TType>
  protected abstract override readonly _validations: GenericValidations<string, TType>

  // ABSTRACT METHODS
  public abstract nullable(): NullableSchema<TType, true, TDefault>
  public abstract default(value: TType): NullableSchema<TType, TNullable, true>

  // PROTECTED
  protected override validateSchema(fn: (current: unknown) => TType, input: unknown): Nullable<TType, TNullable, TDefault> {
    type Output = Nullable<TType, TNullable, TDefault>
    try {

      let resolved = input

      if (input === null && this._config.nullable) {
        if (this._config.default === null) return null as Output
        resolved = this._config.default
      }

      const output = fn(resolved)

      this.runValidations(input, output)

      return output

    } catch (error) {
      if (this._config.fallback === null) throw error
      return this._config.fallback as Output
    }
  }

}
