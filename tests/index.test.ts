// IMPORTS
import { describe, it, expect } from 'vitest'
import { UnknownSchema } from '@/schemas/UnknownSchema'
import { AnySchema } from '@/schemas/AnySchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { UndefinedSchema } from '@/schemas/UndefinedSchema'
import { NullSchema } from '@/schemas/NullSchema'
import { LiteralSchema } from '@/schemas/LiteralSchema'
import { EnumSchema } from '@/schemas/EnumSchema'
import { ArraySchema } from '@/schemas/ArraySchema'
import { RecordSchema } from '@/schemas/RecordSchema'
import { TupleSchema } from '@/schemas/TupleSchema'
import { ObjectSchema } from '@/schemas/ObjectSchema'
import { SetSchema } from '@/schemas/SetSchema'
import { MapSchema } from '@/schemas/MapSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { InstanceOfSchema } from '@/schemas/InstanceOfSchema'
import { schemas } from '@/index'

// TEST
describe('schemas', () => {

  it('.unknown()', () => {
    const schema = schemas.unknown()
    expect(schema).toBeInstanceOf(UnknownSchema)
  })

  it('.any()', () => {
    const schema = schemas.any()
    expect(schema).toBeInstanceOf(AnySchema)
  })

  it('.string()', () => {
    const schema = schemas.string()
    expect(schema).toBeInstanceOf(StringSchema)
  })

  it('.number()', () => {
    const schema = schemas.number()
    expect(schema).toBeInstanceOf(NumberSchema)
  })

  it('.boolean()', () => {
    const schema = schemas.boolean()
    expect(schema).toBeInstanceOf(BooleanSchema)
  })

  it('.null()', () => {
    const schema = schemas.null()
    expect(schema).toBeInstanceOf(NullSchema)
  })

  it('.undefined()', () => {
    const schema = schemas.undefined()
    expect(schema).toBeInstanceOf(UndefinedSchema)
  })

  it('.literal()', () => {
    const schema = schemas.literal.string('string')
    expect(schema).toBeInstanceOf(LiteralSchema)
  })

  it('.enum()', () => {
    const schema = schemas.enum.string('A', 'B', 'C')
    expect(schema).toBeInstanceOf(EnumSchema)
  })

  it('.array()', () => {
    const schema = schemas.array(StringSchema.create())
    expect(schema).toBeInstanceOf(ArraySchema)
  })

  it('.record()', () => {
    const schema = schemas.record(StringSchema.create())
    expect(schema).toBeInstanceOf(RecordSchema)
  })

  it('.tuple()', () => {
    const schema = schemas.tuple([StringSchema.create(), NumberSchema.create(), BooleanSchema.create()])
    expect(schema).toBeInstanceOf(TupleSchema)
  })

  it('.object()', () => {
    const schema = schemas.object({ a: StringSchema.create(), b: NumberSchema.create(), c: BooleanSchema.create() })
    expect(schema).toBeInstanceOf(ObjectSchema)
  })

  it('.set()', () => {
    const schema = schemas.set(StringSchema.create())
    expect(schema).toBeInstanceOf(SetSchema)
  })

  it('.map()', () => {
    const schema = schemas.map(StringSchema.create(), NumberSchema.create())
    expect(schema).toBeInstanceOf(MapSchema)
  })

  it('.instanceOf()', () => {
    const schema = schemas.instanceOf(String)
    expect(schema).toBeInstanceOf(InstanceOfSchema)
  })

  it('.union()', () => {
    const schema = schemas.union(StringSchema.create(), NumberSchema.create(), BooleanSchema.create())
    expect(schema).toBeInstanceOf(UnionSchema)
  })
})
