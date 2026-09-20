/* eslint-disable @typescript-eslint/unbound-method */

// IMPORTS
import {
  UnknownSchema,
  AnySchema,
  StringSchema,
  NumberSchema,
  BooleanSchema,
  UndefinedSchema,
  NullSchema,
  LiteralSchema,
  EnumSchema,
  ArraySchema,
  RecordSchema,
  TupleSchema,
  ObjectSchema,
  SetSchema,
  MapSchema,
  InstanceOfSchema,
  UnionSchema,
} from '@/classes'

// ERRORS
export { type ValidationErrorLocation as ValidationErrorIndex, ValidationError } from '@/errors/ValidationError'

// SCHEMAS
export const schemas = {

  // BASIC
  unknown: UnknownSchema.create,
  any: AnySchema.create,
  string: StringSchema.create,
  number: NumberSchema.create,
  boolean: BooleanSchema.create,

  // NULLISH
  undefined: UndefinedSchema.create,
  null: NullSchema.create,

  // LITERALS
  literal: {
    string: <TValue extends string>(literal: TValue): LiteralSchema<TValue, false, false, false> => LiteralSchema.create(literal),
    number: <TValue extends number>(literal: TValue): LiteralSchema<TValue, false, false, false> => LiteralSchema.create(literal),
    boolean: <TValue extends boolean>(literal: TValue): LiteralSchema<TValue, false, false, false> => LiteralSchema.create(literal),
  },
  enum: {
    string: <TValues extends string>(...values: ReadonlyArray<TValues>): EnumSchema<TValues, false, false, false> => EnumSchema.create(...values),
    number: <TValues extends number>(...values: ReadonlyArray<TValues>): EnumSchema<TValues, false, false, false> => EnumSchema.create(...values),
  },

  // STRUCTURED
  array: ArraySchema.create,
  record: RecordSchema.create,
  tuple: TupleSchema.create,
  object: ObjectSchema.create,
  set: SetSchema.create,
  map: MapSchema.create,

  // SPECIAL
  instanceOf: InstanceOfSchema.create,
  union: UnionSchema.create,
}
