// IMPORTS
import { describe, expect, it } from 'vitest'
import { RecordSchema } from '@/schemas/RecordSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(shape)', () => {

  const schema = RecordSchema.create(NumberSchema.create())

  it('returns when `input` is an object.', () => {
    const result = schema.validate({})
    expect(result).toEqual({})
  })

  it('throws when `input` is not an object.', () => {
    DataTypeGenerator.skip('objects').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be an object.')
    })
  })

  it('returns when all `input` entries match the `shape` schema.', () => {
    const result = schema.validate({ a: 1, b: 2, c: 3 })
    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('throws when at least one `input` entry does not match the `shape` schema.', () => {
    expectSchema(schema, { a: true, b: 2, c: '3' }).toThrow('At least one entry does not match the given schema.', [
      ['a', {
        value: true,
        message: 'The value must be a number.',
      }],
      ['c', {
        value: '3',
        message: 'The value must be a number.',
      }],
    ])
  })

  it('returns a new record.', () => {
    const input = { a: 1, b: 2, c: 3 }
    const result = schema.validate(input)
    expect(result).not.toBe(input)
    expect(result).toEqual(input)
  })

})
