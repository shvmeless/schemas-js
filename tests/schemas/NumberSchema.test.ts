// IMPORTS
import { describe, expect, it } from 'vitest'
import { NumberSchema } from '@/schemas/NumberSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = NumberSchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NumberSchema)
  })
})

// METHOD
describe('.validate(input)', () => {

  const schema = NumberSchema.create()

  it('returns when `input` is an integer number.', () => {
    expectValidation(schema, -255).toReturn(-255)
    expectValidation(schema, 255).toReturn(255)
  })

  it('returns when `input` is a float number.', () => {
    expectValidation(schema, -3.14).toReturn(-3.14)
    expectValidation(schema, 3.14).toReturn(3.14)
  })

  it('returns when `input` is an unsafe number.', () => {
    expectValidation(schema, Number.MIN_SAFE_INTEGER - 1).toReturn(Number.MIN_SAFE_INTEGER - 1)
    expectValidation(schema, Number.MAX_SAFE_INTEGER + 1).toReturn(Number.MAX_SAFE_INTEGER + 1)
  })

  it('returns when `input` is an infinite number.', () => {
    expectValidation(schema, -Infinity).toReturn(-Infinity)
    expectValidation(schema, Infinity).toReturn(Infinity)
  })

  it('returns when `input` is `NaN`.', () => {
    expectValidation(schema, NaN).toReturn(NaN)
  })

  it('throws when `input` is not a number.', () => {
    DataTypeGenerator.skip('numbers').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a number.')
    })
  })
})
