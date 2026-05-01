// IMPORTS
import { describe, expect, it } from 'vitest'
import { SetSchema } from '@/schemas/SetSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = SetSchema.create(StringSchema.create())

  it('validates that all elements match the given schema.', () => {
    const result = schema.validate(new Set(['a', 'b', 'c']))
    expect(result).toEqual(new Set(['a', 'b', 'c']))
  })

  it('validates an empty Set.', () => {
    const result = schema.validate(new Set())
    expect(result).toEqual(new Set())
  })

  it('throws when input is not a Set.', () => {
    DataTypeGenerator.skip('sets').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a Set.')
    })
  })

  it('throws when an element does not match the inner schema.', () => {
    expectSchema(schema, new Set([true, 'b', 255])).toThrow('At least one element does not match the given schema.', [
      [true, 'The value must be a string.'],
      [255, 'The value must be a string.'],
    ])
  })

  it('returns a new Set.', () => {
    const input = new Set(['a', 'b', 'c'])
    const result = schema.validate(input)
    expect(result).not.toBe(input)
    expect(result).toEqual(input)
  })

})
