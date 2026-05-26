// IMPORTS
import { describe, expect, it } from 'vitest'
import { MapSchema } from '@/schemas/MapSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'
import { NumberSchema } from '@/schemas/NumberSchema'

// METHOD
describe('.create(key, value)', () => {

  const schema = MapSchema.create(StringSchema.create(), NumberSchema.create())

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(MapSchema)
  })
})

// METHOD
describe('.validate(input)', () => {

  const schema = MapSchema.create(StringSchema.create(), NumberSchema.create())

  it('returns when `input` is a `Map` instance.', () => {
    expectSchema(schema, new Map()).toReturn(new Map())
  })

  it('throws when `input` is not a `Map` instance.', () => {
    DataTypeGenerator.skip('maps').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a Map.')
    })
  })

  it('returns when all `input` entries match the `key` and `value` schemas.', () => {
    const input = new Map([['a', 1], ['b', 2], ['c', 3]])
    const expected = new Map([['a', 1], ['b', 2], ['c', 3]])
    expectSchema(schema, input).toReturn(expected)
  })

  it('throws when at least one `input` key does not match the `key` schema.', () => {
    const input = new Map<unknown, number>([[true, 1], ['b', 2], [false, 3]])
    expectSchema(schema, input).toThrow('At least one entry does not match the given schema.', [
      [true, {
        value: true,
        message: 'The value must be a string.',
      }],
      [false, {
        value: false,
        message: 'The value must be a string.',
      }],
    ])
  })

  it('throws when at least one `input` value does not match the `value` schema.', () => {
    const input = new Map<string, unknown>([['a', true], ['b', 2], ['c', false]])
    expectSchema(schema, input).toThrow('At least one entry does not match the given schema.', [
      ['a', {
        value: true,
        message: 'The value must be a number.',
      }],
      ['c', {
        value: false,
        message: 'The value must be a number.',
      }],
    ])
  })

  it('returns a new `Map` instance.', () => {
    const input = new Map([['a', 1], ['b', 2], ['c', 3]])
    const expected = new Map([['a', 1], ['b', 2], ['c', 3]])
    expectSchema(schema, input).toReturn(expected)
    expectSchema(schema, input).notToReturn(input)
  })
})
