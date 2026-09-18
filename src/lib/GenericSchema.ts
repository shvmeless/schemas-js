// TYPE
export type GenericValidations<TKeys extends string, TType> = Partial<Record<TKeys, (current: TType, initial: unknown) => undefined>>

// INTERFACE
export interface GenericConfig<TOutput> {
  fallback: TOutput | null | undefined
}

// CLASS
export abstract class GenericSchema<TType, TOutput = TType> {

  // ABSTRACT PROPERTIES
  protected abstract readonly _config: GenericConfig<TOutput>
  protected abstract readonly _validations: GenericValidations<string, TType>

  // ABSTRACT METHODS
  public abstract validate(input: unknown): TOutput
  public abstract fallback(value: TType): GenericSchema<TType, TOutput>

  // PROTECTED
  protected runValidations(initial: unknown, current: TType): void {
    const values = Object.values(this._validations) as Array<((current: TType, initial: unknown) => undefined) | undefined>
    for (const validation of values) {
      if (typeof validation === 'function') validation(current, initial)
    }
  }

  // PROTECTED
  protected validateSchema(fn: (current: unknown) => TType, input: unknown): TOutput {
    try {

      const output = fn(input)

      this.runValidations(input, output)

      return output as unknown as TOutput

    } catch (error) {
      if (this._config.fallback !== null && this._config.fallback !== undefined) return this._config.fallback
      throw error
    }
  }

}
