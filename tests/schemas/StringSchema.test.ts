// IMPORTS
import { describe, expect, it } from 'vitest'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema, expectError } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = StringSchema.create()

  it('validates an input that is a string.', () => {
    const result = schema.validate('string')
    expect(result).toBe('string')
  })

  it('validates an input that is an empty string.', () => {
    const result = schema.validate('')
    expect(result).toBe('')
  })

  it('throws when the input is not a string.', () => {
    DataTypeGenerator.skip('strings').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a string.')
    })
  })

})

// METHOD
describe('length(length)', () => {

  it('returns a new instance of the schema.', () => {
    const base = StringSchema.create()
    const schema = base.length(8)
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  describe('for a `length` parameter equals to NaN', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        StringSchema.create().length(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('for a `length` parameter less than zero', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        StringSchema.create().length(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('for a `length` parameter equal to zero', () => {

    const schema = StringSchema.create().length(0)

    it('validates successfully when the input length is as expected.', () => {
      const result = schema.validate('')
      expect(result).toBe('')
    })

    it('throws when the input length is greater than expected.', () => {
      expectSchema(schema, '1').toThrow('The value must be 0 characters long.')
    })
  })

  describe('for a `length` parameter greater than zero', () => {

    const schema = StringSchema.create().length(8)

    it('throws when the input length is less than expected.', () => {
      expectSchema(schema, '1234567').toThrow('The value must be 8 characters long.')
    })

    it('validates successfully when the input length is as expected.', () => {
      const result = schema.validate('12345678')
      expect(result).toBe('12345678')
    })

    it('throws when the input length is greater than expected.', () => {
      expectSchema(schema, '123456789').toThrow('The value must be 8 characters long.')
    })
  })
})
