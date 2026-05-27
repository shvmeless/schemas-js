// IMPORTS
import { describe, expect, it } from 'vitest'
import { MapSchema } from '@/schemas/MapSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectError, expectValidation } from '@tests/helpers/expect'
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
    expectValidation(schema, new Map()).toReturn(new Map())
  })

  it('throws when `input` is not a `Map` instance.', () => {
    DataTypeGenerator.skip('maps').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a Map.')
    })
  })

  it('returns when all `input` entries match the `key` and `value` schemas.', () => {
    const input = new Map([['a', 1], ['b', 2], ['c', 3]])
    const expected = new Map([['a', 1], ['b', 2], ['c', 3]])
    expectValidation(schema, input).toReturn(expected)
  })

  it('throws when at least one `input` key does not match the `key` schema.', () => {
    const input = new Map<unknown, number>([[true, 1], ['b', 2], [false, 3]])
    expectValidation(schema, input).toThrow('At least one entry does not match the given schema.', [
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
    expectValidation(schema, input).toThrow('At least one entry does not match the given schema.', [
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
    expectValidation(schema, input).toReturn(expected)
    expectValidation(schema, input).notToReturn(input)
  })
})

// METHOD
describe('.size(length)', () => {

  it('returns a new instance of the schema.', () => {
    const base = MapSchema.create(StringSchema.create(), NumberSchema.create())
    const schema = base.size(5)
    expect(schema).toBeInstanceOf(MapSchema)
    expect(schema).not.toBe(base)
  })

  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        MapSchema.create(StringSchema.create(), NumberSchema.create()).size(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        MapSchema.create(StringSchema.create(), NumberSchema.create()).size(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const schema = MapSchema.create(StringSchema.create(), NumberSchema.create()).size(0)

    it('returns when `input` size is as expected.', () => {
      expectValidation(schema, new Map()).toReturn(new Map())
    })

    it('throws when `input` size is greater than expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3]])
      expectValidation(schema, input).toThrow('The value must be 0 elements long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const schema = MapSchema.create(StringSchema.create(), NumberSchema.create()).size(5)

    it('throws when `input` size is less than expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3]])
      expectValidation(schema, input).toThrow('The value must be 5 elements long.')
    })

    it('returns when `input` size is as expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5]])
      const expected = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5]])
      expectValidation(schema, input).toReturn(expected)
    })

    it('throws when `input` size is greater than expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5], ['F', 6], ['G', 7]])
      expectValidation(schema, input).toThrow('The value must be 5 elements long.')
    })
  })
})
