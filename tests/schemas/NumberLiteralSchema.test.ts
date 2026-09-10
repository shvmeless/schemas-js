// IMPORTS
import { describe, it, expect } from 'vitest'
import { LiteralSchema } from '@/schemas/LiteralSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(literal)', () => {

  it('initialize with `Infinity` values', () => {
    const negative = LiteralSchema.create(-Infinity)
    expect(negative).toBeInstanceOf(LiteralSchema)
    expectValidation(negative, -Infinity).toReturn(-Infinity)

    const positive = LiteralSchema.create(Infinity)
    expect(positive).toBeInstanceOf(LiteralSchema)
    expectValidation(positive, Infinity).toReturn(Infinity)
  })

  it('initialize with `0` values', () => {
    const negative = LiteralSchema.create(-0)
    expect(negative).toBeInstanceOf(LiteralSchema)
    expectValidation(negative, -0).toReturn(-0)

    const positive = LiteralSchema.create(0)
    expect(positive).toBeInstanceOf(LiteralSchema)
    expectValidation(positive, 0).toReturn(0)
  })

  it('initialize with decimal number values', () => {
    const negative = LiteralSchema.create(-0.1)
    expect(negative).toBeInstanceOf(LiteralSchema)
    expectValidation(negative, -0.1).toReturn(-0.1)

    const positive = LiteralSchema.create(0.1)
    expect(positive).toBeInstanceOf(LiteralSchema)
    expectValidation(positive, 0.1).toReturn(0.1)
  })

  it('initialize with integer number values', () => {
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
