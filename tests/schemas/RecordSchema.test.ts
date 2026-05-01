// IMPORTS
import { describe, expect, it } from 'vitest'
import { RecordSchema } from '@/schemas/RecordSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = RecordSchema.create(NumberSchema.create())

  it('validates that all elements match the given schema.', () => {
    const result = schema.validate({ a: 1, b: 2, c: 3 })
    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('validates an empty object.', () => {
    const result = schema.validate({})
    expect(result).toEqual({})
  })

  it('throws when input is not an object.', () => {
    DataTypeGenerator.skip('objects').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be an object.')
    })
  })

  it('throws when an element does not match the inner schema.', () => {
    expectSchema(schema, { a: true, b: 2, c: '3' }).toThrow('At least one entry does not match the given schema.', {
      a: 'The value must be a number.',
      c: 'The value must be a number.',
    })
  })

  it('returns a new object.', () => {
    const input = { a: 1, b: 2, c: 3 }
    const result = schema.validate(input)
    expect(result).not.toBe(input)
    expect(result).toEqual(input)
  })

})
