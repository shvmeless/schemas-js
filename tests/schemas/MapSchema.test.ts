// IMPORTS
import { describe, expect, it } from 'vitest'
import { MapSchema } from '@/schemas/MapSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'
import { NumberSchema } from '@/schemas/NumberSchema'

// METHOD
describe('.create()', () => {

  const schema = MapSchema.create(StringSchema.create(), NumberSchema.create())

  it('validates that all elements match the given schema.', () => {
    const result = schema.validate(new Map([['a', 1], ['b', 2], ['c', 3]]))
    expect(result).toEqual(new Map([['a', 1], ['b', 2], ['c', 3]]))
  })

  it('validates an empty Map.', () => {
    const result = schema.validate(new Map())
    expect(result).toEqual(new Map())
  })

  it('throws when input is not a Map.', () => {
    DataTypeGenerator.skip('maps').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a Map.')
    })
  })

  it('throws when a key does not match the given schema.', () => {
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

  it('throws when a value does not match the given schema.', () => {
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

  it('returns a new Map.', () => {
    const input = new Map([['a', 1], ['b', 2], ['c', 3]])
    const result = schema.validate(input)
    expect(result).not.toBe(input)
    expect(result).toEqual(input)
  })

})
