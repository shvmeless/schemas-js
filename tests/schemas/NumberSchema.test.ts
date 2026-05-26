// IMPORTS
import { describe, it } from 'vitest'
import { NumberSchema } from '@/schemas/NumberSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = NumberSchema.create()

  it('returns when `input` is an integer number.', () => {
    expectSchema(schema, -255).toReturn(-255)
    expectSchema(schema, 255).toReturn(255)
  })

  it('returns when `input` is a float number.', () => {
    expectSchema(schema, -3.14).toReturn(-3.14)
    expectSchema(schema, 3.14).toReturn(3.14)
  })

  it('returns when `input` is an unsafe number.', () => {
    expectSchema(schema, Number.MIN_SAFE_INTEGER - 1).toReturn(Number.MIN_SAFE_INTEGER - 1)
    expectSchema(schema, Number.MAX_SAFE_INTEGER + 1).toReturn(Number.MAX_SAFE_INTEGER + 1)
  })

  it('returns when `input` is an infinite number.', () => {
    expectSchema(schema, -Infinity).toReturn(-Infinity)
    expectSchema(schema, Infinity).toReturn(Infinity)
  })

  it('returns when `input` is `NaN`.', () => {
    expectSchema(schema, NaN).toReturn(NaN)
  })

  it('throws when `input` is not a number.', () => {
    DataTypeGenerator.skip('numbers').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a number.')
    })
  })

})
