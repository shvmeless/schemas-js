// IMPORTS
import { describe, expect, it } from 'vitest'
import { SetSchema } from '@/schemas/SetSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(shape)', () => {

  const schema = SetSchema.create(StringSchema.create())

  it('returns when `input` is a `Set` instance.', () => {
    const result = schema.validate(new Set())
    expect(result).toEqual(new Set())
  })

  it('throws when `input` is not a `Set` instance.', () => {
    DataTypeGenerator.skip('sets').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a Set.')
    })
  })

  it('returns when all `input` elements match the `shape` schema.', () => {
    const result = schema.validate(new Set(['a', 'b', 'c']))
    expect(result).toEqual(new Set(['a', 'b', 'c']))
  })

  it('throws when at least one `input` element does not match the `shape` schema.', () => {
    expectSchema(schema, new Set([true, 'b', 255])).toThrow('At least one element does not match the given schema.', [
      [true, {
        value: true,
        message: 'The value must be a string.',
      }],
      [255, {
        value: 255,
        message: 'The value must be a string.',
      }],
    ])
  })

  it('returns a new `Set instance`.', () => {
    const input = new Set(['a', 'b', 'c'])
    const result = schema.validate(input)
    expect(result).not.toBe(input)
    expect(result).toEqual(input)
  })

})
