// IMPORTS
import { describe, expect, it } from 'vitest'
import { ArraySchema } from '@/schemas/ArraySchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD
describe('.create(shape)', () => {

  const schema = ArraySchema.create(StringSchema.create())

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(ArraySchema)
  })
})

// METHOD
describe('.validate(input)', () => {

  const schema = ArraySchema.create(StringSchema.create())

  it('returns when `input` is an array.', () => {
    expectValidation(schema, []).toReturn([])
  })

  it('throws when `input` is not an array.', () => {
    DataTypeGenerator.skip('arrays').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an array.')
    })
  })

  it('returns when all `input` elements match the `shape` schema.', () => {
    expectValidation(schema, ['a', 'b', 'c']).toReturn(['a', 'b', 'c'])
  })

  it('throws when at least one `input` element does not match the `shape` schema.', () => {
    expectValidation(schema, [true, 'b', 255]).toThrow('At least one element does not match the given schema.', [
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
    expectValidation(schema, input).toReturn(['a', 'b', 'c'])
    expectValidation(schema, input).notToReturn(input)
  })
})
