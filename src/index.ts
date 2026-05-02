/* eslint-disable @typescript-eslint/unbound-method */

// IMPORTS
import {
  AnySchema,
  ArraySchema,
  BooleanSchema,
  EnumSchema,
  InstanceOfSchema,
  LiteralSchema,
  MapSchema,
  NullSchema,
  NumberSchema,
  ObjectSchema,
  RecordSchema,
  SetSchema,
  StringSchema,
  TupleSchema,
  UndefinedSchema,
  UnknownSchema,
} from '@/classes'

// ERRORS
export { type ValidationErrorIndex, ValidationError } from '@/errors/ValidationError'

// SCHEMAS
export const schemas = {
  unknown: UnknownSchema.create,
  any: AnySchema.create,
  string: StringSchema.create,
  number: NumberSchema.create,
  boolean: BooleanSchema.create,
  literal: LiteralSchema.create,
  enum: EnumSchema.create,
  null: NullSchema.create,
  undefined: UndefinedSchema.create,
  instanceOf: InstanceOfSchema.create,
  array: ArraySchema.create,
  record: RecordSchema.create,
  tuple: TupleSchema.create,
  object: ObjectSchema.create,
  set: SetSchema.create,
  map: MapSchema.create,
}
