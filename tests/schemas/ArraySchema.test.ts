// IMPORTS
import { describe, expect, it } from 'vitest'
import { ArraySchema } from '@/schemas/ArraySchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = ArraySchema.create(StringSchema.create())

  it('validates that all elements match the given schema.', () => {
    const result = schema.validate(['a', 'b', 'c'])
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('validates an empty array.', () => {
    const result = schema.validate([])
    expect(result).toEqual([])
  })

  it('throws when input is not an array.', () => {
    DataTypeGenerator.skip('arrays').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be an array.')
    })
  })

  it('throws when an element does not match the inner schema.', () => {
    expectSchema(schema, [true, 'b', 255]).toThrow('At least one element does not match the given schema.', {
      0: 'The value must be a string.',
      2: 'The value must be a string.',
    })
  })

  it('returns a new array.', () => {
    const input = ['a', 'b', 'c']
    const result = schema.validate(input)
    expect(result).not.toBe(input)
    expect(result).toEqual(input)
  })

})
