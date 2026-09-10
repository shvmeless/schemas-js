// TYPE
export type GenericValidations<TKeys extends string, TType> = Partial<Record<TKeys, (current: TType, initial: unknown) => undefined>>

// FUNCTION
export function runValidations<TKeys extends string, TType>(validations: GenericValidations<TKeys, TType>, initial: unknown, current: TType): void {
  const values = Object.values(validations) as Array<((current: TType, initial: unknown) => undefined) | undefined>
  for (const validation of values) {
    if (typeof validation === 'function') validation(current, initial)
  }
}
