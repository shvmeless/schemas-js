// IMPORTS
import { describe, it, expect } from 'vitest'
import { LiteralSchema } from '@/schemas/LiteralSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(literal)', () => {

  it('initializes with `Infinity` values', () => {
    const negative = LiteralSchema.create(-Infinity)
    expect(negative).toBeInstanceOf(LiteralSchema)
    expectValidation(negative, -Infinity).toReturn(-Infinity)

    const positive = LiteralSchema.create(Infinity)
    expect(positive).toBeInstanceOf(LiteralSchema)
    expectValidation(positive, Infinity).toReturn(Infinity)
  })

  it('initializes with `0` values', () => {
    const negative = LiteralSchema.create(-0)
    expect(negative).toBeInstanceOf(LiteralSchema)
    expectValidation(negative, -0).toReturn(-0)

    const positive = LiteralSchema.create(0)
    expect(positive).toBeInstanceOf(LiteralSchema)
    expectValidation(positive, 0).toReturn(0)
  })

  it('initializes with decimal number values', () => {
    const negative = LiteralSchema.create(-0.1)
    expect(negative).toBeInstanceOf(LiteralSchema)
    expectValidation(negative, -0.1).toReturn(-0.1)

    const positive = LiteralSchema.create(0.1)
    expect(positive).toBeInstanceOf(LiteralSchema)
    expectValidation(positive, 0.1).toReturn(0.1)
  })

  it('initializes with integer number values', () => {
    const negative = LiteralSchema.create(-100)
    expect(negative).toBeInstanceOf(LiteralSchema)
    expectValidation(negative, -100).toReturn(-100)

    const positive = LiteralSchema.create(100)
    expect(positive).toBeInstanceOf(LiteralSchema)
    expectValidation(positive, 100).toReturn(100)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = LiteralSchema.create(1000)

  it('throws when `input` is not a number.', () => {
    DataTypeGenerator.skip('numbers').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must match the literal value.')
    })
  })

  it('returns when `input` matches the `literal`.', () => {
    expectValidation(schema, 1000).toReturn(1000)
  })

  it('throws when `input` does not match the `literal`.', () => {
    expectValidation(schema, NaN).toThrow('The value must match the literal value.')
    expectValidation(schema, -Infinity).toThrow('The value must match the literal value.')
    expectValidation(schema, -100).toThrow('The value must match the literal value.')
    expectValidation(schema, -0.1).toThrow('The value must match the literal value.')
    expectValidation(schema, 0).toThrow('The value must match the literal value.')
    expectValidation(schema, 0.1).toThrow('The value must match the literal value.')
    expectValidation(schema, 100).toThrow('The value must match the literal value.')
    expectValidation(schema, Infinity).toThrow('The value must match the literal value.')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.optional()', () => {

  const base = LiteralSchema.create(1000)
  const schema = base.optional()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(LiteralSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` matches the `literal`.', () => {
    expectValidation(schema, 1000).toReturn(1000)
  })

  it('returns when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(undefined)
  })

  it('throws when `input` does not match the `literal`.', () => {
    DataTypeGenerator.skip('numbers', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must match the literal value.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.nullable()', () => {

  const base = LiteralSchema.create(1000)
  const schema = base.nullable()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(LiteralSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` matches the `literal`.', () => {
    expectValidation(schema, 1000).toReturn(1000)
  })

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })

  it('throws when `input` does not match the `literal`.', () => {
    DataTypeGenerator.skip('numbers', 'null').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must match the literal value.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.default(value)', () => {

  const base = LiteralSchema.create(1000).optional()
  const schema = base.default(1000)

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(LiteralSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` matches the `literal`.', () => {
    expectValidation(schema, 1000).toReturn(1000)
  })

  it('returns the `default` value when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(1000)
  })

  it('returns the `default` value when `input` is `null` and the schema is nullable.', () => {
    expectValidation(schema.nullable(), null).toReturn(1000)
  })

  it('throws when `input` does not match the `literal`.', () => {
    DataTypeGenerator.skip('numbers', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must match the literal value.')
    })
  })
})
