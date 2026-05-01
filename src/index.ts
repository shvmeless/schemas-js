/* eslint-disable @typescript-eslint/unbound-method */

// IMPORTS
import { UnknownSchema } from '@/schemas/UnknownSchema'
import { AnySchema } from '@/schemas/AnySchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { LiteralSchema } from '@/schemas/LiteralSchema'
import { EnumSchema } from '@/schemas/EnumSchema'
import { NullSchema } from '@/schemas/NullSchema'
import { UndefinedSchema } from '@/schemas/UndefinedSchema'
import { ArraySchema } from '@/schemas/ArraySchema'
import { RecordSchema } from '@/schemas/RecordSchema'
import { TupleSchema } from '@/schemas/TupleSchema'
import { ObjectSchema } from '@/schemas/ObjectSchema'
import { SetSchema } from '@/schemas/SetSchema'
import { MapSchema } from '@/schemas/MapSchema'

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
  array: ArraySchema.create,
  record: RecordSchema.create,
  tuple: TupleSchema.create,
  object: ObjectSchema.create,
  set: SetSchema.create,
  map: MapSchema.create,
}
