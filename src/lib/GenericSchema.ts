// INTERFACE
export interface GenericSchema<T> {

  // METHOD
  validate(input: unknown): T

}

// TYPE
export type Optional<TType, TOptional extends boolean>
  = TOptional extends true
    ? undefined
    : TType
