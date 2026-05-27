// IMPORTS
import { describe, expect, it } from 'vitest'
import { RecordSchema } from '@/schemas/RecordSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectError, expectValidation } from '@tests/helpers/expect'

// METHOD
describe('.create(shape)', () => {

  const schema = RecordSchema.create(NumberSchema.create())

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(RecordSchema)
  })
})

// METHOD
describe('.validate(input)', () => {

  const schema = RecordSchema.create(NumberSchema.create())

  it('returns when `input` is an object.', () => {
    expectValidation(schema, {}).toReturn({})
  })

  it('throws when `input` is not an object.', () => {
    DataTypeGenerator.skip('objects').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an object.')
    })
  })

  it('returns when all `input` entries match the `shape` schema.', () => {
    const input = { a: 1, b: 2, c: 3 }
    const expected = { a: 1, b: 2, c: 3 }
    expectValidation(schema, input).toReturn(expected)
  })

  it('throws when at least one `input` entry does not match the `shape` schema.', () => {
    const input = { a: true, b: 2, c: '3' }
    expectValidation(schema, input).toThrow('At least one entry does not match the given schema.', [
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
    const expected = { a: 1, b: 2, c: 3 }
    expectValidation(schema, input).toReturn(expected)
    expectValidation(schema, input).notToReturn(input)
  })
})

// METHOD
describe('.length(length)', () => {

  it('returns a new instance of the schema.', () => {
    const base = RecordSchema.create(NumberSchema.create())
    const schema = base.length(5)
    expect(schema).toBeInstanceOf(RecordSchema)
    expect(schema).not.toBe(base)
  })

  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        RecordSchema.create(NumberSchema.create()).length(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        RecordSchema.create(NumberSchema.create()).length(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const schema = RecordSchema.create(NumberSchema.create()).length(0)

    it('returns when `input` length is as expected.', () => {
      expectValidation(schema, {}).toReturn({})
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = { a: 1, b: 2, c: 3 }
      expectValidation(schema, input).toThrow('The value must be 0 elements long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const schema = RecordSchema.create(NumberSchema.create()).length(5)

    it('throws when `input` length is less than expected.', () => {
      const input = { a: 1, b: 2, c: 3 }
      expectValidation(schema, input).toThrow('The value must be 5 elements long.')
    })

    it('returns when `input` length is as expected.', () => {
      const input = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      const expected = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      expectValidation(schema, input).toReturn(expected)
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }
      expectValidation(schema, input).toThrow('The value must be 5 elements long.')
    })
  })
})

// METHOD
describe('.min(length)', () => {

  it('returns a new instance of the schema.', () => {
    const base = RecordSchema.create(NumberSchema.create())
    const schema = base.min(5)
    expect(schema).toBeInstanceOf(RecordSchema)
    expect(schema).not.toBe(base)
  })

  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        RecordSchema.create(NumberSchema.create()).min(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        RecordSchema.create(NumberSchema.create()).min(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const schema = RecordSchema.create(NumberSchema.create()).min(0)

    it('returns when `input` is empty.', () => {
      expectValidation(schema, {}).toReturn({})
    })

    it('returns when `input` length is greater than expected.', () => {
      const input = { a: 1, b: 2, c: 3 }
      const expected = { a: 1, b: 2, c: 3 }
      expectValidation(schema, input).toReturn(expected)
    })
  })

  describe('when `length` is a positive number', () => {

    const schema = RecordSchema.create(NumberSchema.create()).min(5)

    it('throws when `input` length is less than expected.', () => {
      const input = { a: 1, b: 2, c: 3 }
      expectValidation(schema, input).toThrow('The value must be at least 5 elements long.')
    })

    it('returns when `input` length is as expected.', () => {
      const input = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      const expected = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      expectValidation(schema, input).toReturn(expected)
    })

    it('returns when `input` length is greater than expected.', () => {
      const input = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }
      const expected = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }
      expectValidation(schema, input).toReturn(expected)
    })
  })
})
