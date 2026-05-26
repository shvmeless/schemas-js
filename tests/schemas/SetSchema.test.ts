// IMPORTS
import { describe, it } from 'vitest'
import { SetSchema } from '@/schemas/SetSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(shape)', () => {

  const schema = SetSchema.create(StringSchema.create())

  it('returns when `input` is a `Set` instance.', () => {
    expectSchema(schema, new Set()).toReturn(new Set())
  })

  it('throws when `input` is not a `Set` instance.', () => {
    DataTypeGenerator.skip('sets').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a Set.')
    })
  })

  it('returns when all `input` elements match the `shape` schema.', () => {
    const input = new Set(['a', 'b', 'c'])
    const expected = new Set(['a', 'b', 'c'])
    expectSchema(schema, input).toReturn(expected)
  })

  it('throws when at least one `input` element does not match the `shape` schema.', () => {
    const input = new Set([true, 'b', 255])
    expectSchema(schema, input).toThrow('At least one element does not match the given schema.', [
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
    const expected = new Set(['a', 'b', 'c'])
    expectSchema(schema, input).toReturn(expected)
    expectSchema(schema, input).notToReturn(input)
  })
})
