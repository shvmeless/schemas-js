// IMPORTS
import { describe, expect, it } from 'vitest'
import { NumberSchema } from '@/schemas/NumberSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = NumberSchema.create()

  it('validates an input that is an integer number.', () => {
    const r1 = schema.validate(-255)
    expect(r1).toBe(-255)
    const r2 = schema.validate(255)
    expect(r2).toBe(255)
  })

  it('validates an input that is a float number.', () => {
    const r1 = schema.validate(-3.14)
    expect(r1).toBe(-3.14)
    const r2 = schema.validate(3.14)
    expect(r2).toBe(3.14)
  })

  it('validates an input that is an unsafe number.', () => {
    const r1 = schema.validate(Number.MIN_SAFE_INTEGER)
    expect(r1).toBe(Number.MIN_SAFE_INTEGER)
    const r2 = schema.validate(Number.MAX_SAFE_INTEGER)
    expect(r2).toBe(Number.MAX_SAFE_INTEGER)
  })

  it('validates an input that is an infinite number.', () => {
    const r1 = schema.validate(-Infinity)
    expect(r1).toBe(-Infinity)
    const r2 = schema.validate(Infinity)
    expect(r2).toBe(Infinity)
  })

  it('validates an input that is NaN.', () => {
    const r = schema.validate(NaN)
    expect(r).toBeNaN()
  })

  it('throws when the input is not a number.', () => {
    DataTypeGenerator.skip('numbers').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a number.')
    })
  })

})
