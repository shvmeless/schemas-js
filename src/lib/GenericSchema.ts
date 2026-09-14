// ----------------------------------------------------------------------------

// TYPE
export type Optional<TType, TOptional extends boolean, TDefault extends boolean>
  = TOptional extends true
    ? TDefault extends true
      ? TType
      : TType | undefined
    : TType

// TYPE
export type Nullable<TType, TNullable extends boolean, TDefault extends boolean>
  = TNullable extends true
    ? TDefault extends true
      ? TType
      : TType | null
    : TType

// TYPE
export type Nullish<TType, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  = Optional<Nullable<TType, TNullable, TDefault>, TOptional, TDefault>

// ----------------------------------------------------------------------------

// INTERFACE
export interface GenericSchema<T> {
  validate(input: unknown): T
}

// INTERFACE
export interface OptionalSchema<TType, TOptional extends boolean, TDefault extends boolean>
  extends GenericSchema<Optional<TType, TOptional, TDefault>> {
  optional(): OptionalSchema<TType, true, TDefault>
}

// INTERFACE
export interface NullableSchema<TType, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<Nullable<TType, TNullable, TDefault>> {
  nullable(): NullableSchema<TType, true, TDefault>
}

// INTERFACE
export interface NullishSchema<TType, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends GenericSchema<Nullish<TType, TOptional, TNullable, TDefault>> {
  optional(): NullishSchema<TType, true, TNullable, TDefault>
  nullable(): NullishSchema<TType, TOptional, true, TDefault>
}
