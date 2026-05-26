// IMPORTS
import { describe, expect, it } from 'vitest'
import { ArraySchema } from '@/schemas/ArraySchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(shape)', () => {

  const schema = ArraySchema.create(StringSchema.create())

  it('returns when `input` is an array.', () => {
    const result = schema.validate([])
    expect(result).toEqual([])
  })

  it('throws when `input` is not an array.', () => {
    DataTypeGenerator.skip('arrays').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be an array.')
    })
  })

  it('returns when all `input` elements match the `shape` schema.', () => {
    const result = schema.validate(['a', 'b', 'c'])
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('throws when at least one `input` element does not match the `shape` schema.', () => {
    expectSchema(schema, [true, 'b', 255]).toThrow('At least one element does not match the given schema.', [
      [0, {
        value: true,
        message: 'The value must be a string.',
      }],
      [2, {
        value: 255,
        message: 'The value must be a string.',
      }],
    ])
  })

  it('returns a new array.', () => {
    const input = ['a', 'b', 'c']
    const result = schema.validate(input)
    expect(result).not.toBe(input)
    expect(result).toEqual(input)
  })

})
