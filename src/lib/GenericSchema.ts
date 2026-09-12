// INTERFACE
export interface GenericSchema<T> {

  // METHOD
  validate(input: unknown): T

}

// TYPE
export type Optional<TType, TOptional extends boolean, TDefault extends TType | null | undefined>
  = TOptional extends true
    ? TDefault extends TType
      ? TType
      : TType | undefined
    : TType

// TYPE
export type Nullable<TType, TNullable extends boolean, TDefault extends TType | null | undefined>
  = TNullable extends true
    ? TDefault extends TType
      ? TType
      : TType | null
    : TType

// TYPE
export type Maybe<TType, TOptional extends boolean, TNullable extends boolean, TDefault extends TType | null | undefined>
  = Optional<Nullable<TType, TNullable, TDefault>, TOptional, TDefault>
