// IMPORTS
import { describe, expect, it } from 'vitest'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema, expectError } from '@tests/helpers/expect'

// METHOD
describe('create()', () => {

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

// METHOD
describe('min(length)', () => {

  it('returns a new instance of the schema.', () => {
    const base = StringSchema.create()
    const schema = base.min(8)
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  describe('for a `length` parameter equals to NaN', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        StringSchema.create().min(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('for a `length` parameter less than zero', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        StringSchema.create().min(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('for a `length` parameter equal to zero', () => {

    const schema = StringSchema.create().min(0)

    it('validates successfully when the input length is as expected.', () => {
      const result = schema.validate('')
      expect(result).toBe('')
    })

    it('validates successfully when the input length is greater than expected.', () => {
      const result = schema.validate('1')
      expect(result).toBe('1')
    })
  })

  describe('for a `length` parameter greater than zero', () => {

    const schema = StringSchema.create().min(8)

    it('throws when the input length is less than expected.', () => {
      expectSchema(schema, '1234567').toThrow('The value must be at least 8 characters long.')
    })

    it('validates successfully when the input length is as expected.', () => {
      const result = schema.validate('12345678')
      expect(result).toBe('12345678')
    })

    it('validates successfully when the input length is greater than expected.', () => {
      const result = schema.validate('123456789')
      expect(result).toBe('123456789')
    })
  })
})

// METHOD
describe('max(length)', () => {

  it('returns a new instance of the schema.', () => {
    const base = StringSchema.create()
    const schema = base.max(8)
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  describe('for a `length` parameter equals to NaN', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        StringSchema.create().max(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('for a `length` parameter less than zero', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        StringSchema.create().max(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('for a `length` parameter equal to zero', () => {

    const schema = StringSchema.create().max(0)

    it('validates successfully when the input length is as expected.', () => {
      const result = schema.validate('')
      expect(result).toBe('')
    })

    it('throws when the input length is greater than expected.', () => {
      expectSchema(schema, '1').toThrow('The value must be at most 0 characters long.')
    })
  })

  describe('for a `length` parameter greater than zero', () => {

    const schema = StringSchema.create().max(8)

    it('validates successfully when the input length is less than expected.', () => {
      const result = schema.validate('1234567')
      expect(result).toBe('1234567')
    })

    it('validates successfully when the input length is as expected.', () => {
      const result = schema.validate('12345678')
      expect(result).toBe('12345678')
    })

    it('throws when the input length is greater than expected.', () => {
      expectSchema(schema, '123456789').toThrow('The value must be at most 8 characters long.')
    })
  })
})

// METHOD
describe('lowercase({ fix })', () => {

  it('returns a new instance of the schema.', () => {
    const base = StringSchema.create()
    const schema = base.lowercase()
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  describe('for a parameter `fix` equal to `undefined`', () => {

    const schema = StringSchema.create().lowercase()

    it('throws when the input contains uppercase characters.', () => {
      expectSchema(schema, 'eXaMpLe').toThrow('The value must be lowercase.')
    })

    it('validates successfully when the input does not contain uppercase characters.', () => {
      const result = schema.validate('example')
      expect(result).toBe('example')
    })
  })

  describe('when the `fix` parameter is `false`', () => {

    const schema = StringSchema.create().lowercase({ fix: false })

    it('throws when the input contains uppercase characters.', () => {
      expectSchema(schema, 'eXaMpLe').toThrow('The value must be lowercase.')
    })

    it('validates successfully when the input does not contain uppercase characters.', () => {
      const result = schema.validate('example')
      expect(result).toBe('example')
    })
  })

  describe('when the `fix` parameter is `true`', () => {

    const schema = StringSchema.create().lowercase({ fix: true })

    it('fixes and validates successfully when the input contains uppercase characters.', () => {
      const result = schema.validate('eXaMpLe')
      expect(result).toBe('eXaMpLe'.toLowerCase())
    })

    it('validates successfully when the input does not contain uppercase characters.', () => {
      const result = schema.validate('example')
      expect(result).toBe('example')
    })
  })
})
