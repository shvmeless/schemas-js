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

// TYPE
export type Nullable<TType, TNullable extends boolean>
  = TNullable extends true
    ? null
    : TType

// TYPE
export type Maybe<TType, TOptional extends boolean, TNullable extends boolean>
  = Optional<Nullable<TType, TNullable>, TOptional>
