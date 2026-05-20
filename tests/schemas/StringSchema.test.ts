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
      expect(result).toBe('example')
    })

    it('validates successfully when the input does not contain uppercase characters.', () => {
      const result = schema.validate('example')
      expect(result).toBe('example')
    })
  })
})

// METHOD
describe('uppercase({ fix })', () => {

  it('returns a new instance of the schema.', () => {
    const base = StringSchema.create()
    const schema = base.uppercase()
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  describe('for a parameter `fix` equal to `undefined`', () => {

    const schema = StringSchema.create().uppercase()

    it('throws when the input contains lowercase characters.', () => {
      expectSchema(schema, 'eXaMpLe').toThrow('The value must be uppercase.')
    })

    it('validates successfully when the input does not contain lowercase characters.', () => {
      const result = schema.validate('EXAMPLE')
      expect(result).toBe('EXAMPLE')
    })
  })

  describe('when the `fix` parameter is `false`', () => {

    const schema = StringSchema.create().uppercase({ fix: false })

    it('throws when the input contains lowercase characters.', () => {
      expectSchema(schema, 'eXaMpLe').toThrow('The value must be uppercase.')
    })

    it('validates successfully when the input does not contain lowercase characters.', () => {
      const result = schema.validate('EXAMPLE')
      expect(result).toBe('EXAMPLE')
    })
  })

  describe('when the `fix` parameter is `true`', () => {

    const schema = StringSchema.create().uppercase({ fix: true })

    it('fixes and validates successfully when the input contains lowercase characters.', () => {
      const result = schema.validate('eXaMpLe')
      expect(result).toBe('EXAMPLE')
    })

    it('validates successfully when the input does not contain lowercase characters.', () => {
      const result = schema.validate('EXAMPLE')
      expect(result).toBe('EXAMPLE')
    })
  })
})

// METHOD
describe('trim({ fix })', () => {

  it('returns a new instance of the schema.', () => {
    const base = StringSchema.create()
    const schema = base.trim()
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  describe('for a parameter `fix` equal to `undefined`', () => {

    const schema = StringSchema.create().trim()

    it('throws when the input contains whitespaces at the beginning.', () => {
      expectSchema(schema, '   EXAMPLE').toThrow('The value must be trimmed.')
    })

    it('throws when the input contains whitespaces at the end.', () => {
      expectSchema(schema, 'EXAMPLE   ').toThrow('The value must be trimmed.')
    })

    it('throws when the input is surrounded by whitespaces.', () => {
      expectSchema(schema, '   EXAMPLE   ').toThrow('The value must be trimmed.')
    })

    it('validates successfully when the input is not surrounded by whitespaces.', () => {
      const result = schema.validate('EXAMPLE')
      expect(result).toBe('EXAMPLE')
    })
  })

  describe('when the `fix` parameter is `false`', () => {

    const schema = StringSchema.create().trim({ fix: false })

    it('throws when the input contains whitespaces at the beginning.', () => {
      expectSchema(schema, '   EXAMPLE').toThrow('The value must be trimmed.')
    })

    it('throws when the input contains whitespaces at the end.', () => {
      expectSchema(schema, 'EXAMPLE   ').toThrow('The value must be trimmed.')
    })

    it('throws when the input is surrounded by whitespaces.', () => {
      expectSchema(schema, '   EXAMPLE   ').toThrow('The value must be trimmed.')
    })

    it('validates successfully when the input is not surrounded by whitespaces.', () => {
      const result = schema.validate('EXAMPLE')
      expect(result).toBe('EXAMPLE')
    })
  })

  describe('when the `fix` parameter is `true`', () => {

    const schema = StringSchema.create().trim({ fix: true })

    it('validates successfully when the input contains whitespaces at the beginning.', () => {
      const result = schema.validate('   EXAMPLE')
      expect(result).toBe('EXAMPLE')
    })

    it('validates successfully when the input contains whitespaces at the end.', () => {
      const result = schema.validate('EXAMPLE   ')
      expect(result).toBe('EXAMPLE')
    })

    it('validates successfully when the input is surrounded by whitespaces.', () => {
      const result = schema.validate('   EXAMPLE   ')
      expect(result).toBe('EXAMPLE')
    })

    it('validates successfully when the input is not surrounded by whitespaces.', () => {
      const result = schema.validate('EXAMPLE')
      expect(result).toBe('EXAMPLE')
    })
  })
})

// METHOD
describe('startsWith(prefix, { fix })', () => {

  it('returns a new instance of the schema.', () => {
    const base = StringSchema.create()
    const schema = base.startsWith('prefix-')
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  describe('for a parameter `fix` equal to `undefined`', () => {

    const schema = StringSchema.create().startsWith('prefix-')

    it('throws when the input does not start with the expected prefix.', () => {
      expectSchema(schema, 'string').toThrow('The value must start with "prefix-".')
    })

    it('throws when the input starts with the expected prefix (case-sensitive).', () => {
      expectSchema(schema, 'PREFIX-string').toThrow('The value must start with "prefix-".')
    })

    it('validates successfully when the input starts with the expected prefix.', () => {
      const result = schema.validate('prefix-string')
      expect(result).toBe('prefix-string')
    })
  })

  describe('for a parameter `fix` equal to `false`', () => {

    const schema = StringSchema.create().startsWith('prefix-', { fix: false })

    it('throws when the input does not start with the expected prefix.', () => {
      expectSchema(schema, 'string').toThrow('The value must start with "prefix-".')
    })

    it('throws when the input starts with the expected prefix (case-sensitive).', () => {
      expectSchema(schema, 'PREFIX-string').toThrow('The value must start with "prefix-".')
    })

    it('validates successfully when the input starts with the expected prefix.', () => {
      const result = schema.validate('prefix-string')
      expect(result).toBe('prefix-string')
    })
  })

  describe('for a parameter `fix` equal to `true`', () => {

    const schema = StringSchema.create().startsWith('prefix-', { fix: true })

    it('fixes and validates successfully when the input does not start with the expected prefix.', () => {
      const result = schema.validate('string')
      expect(result).toBe('prefix-string')
    })

    it('fixes and validates successfully when the input starts with the expected prefix (case-sensitive).', () => {
      const result = schema.validate('PREFIX-string')
      expect(result).toBe('prefix-PREFIX-string')
    })

    it('validates successfully when the input starts with the expected prefix.', () => {
      const result = schema.validate('prefix-string')
      expect(result).toBe('prefix-string')
    })
  })
})

// METHOD
describe('endsWith(prefix, { fix })', () => {

  it('returns a new instance of the schema.', () => {
    const base = StringSchema.create()
    const schema = base.endsWith('-suffix')
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  describe('for a parameter `fix` equal to `undefined`', () => {

    const schema = StringSchema.create().endsWith('-suffix')

    it('throws when the input does not end with the expected suffix.', () => {
      expectSchema(schema, 'string').toThrow('The value must end with "-suffix".')
    })

    it('throws when the input ends with the expected suffix (case-sensitive).', () => {
      expectSchema(schema, 'string-SUFFIX').toThrow('The value must end with "-suffix".')
    })

    it('validates successfully when the input ends with the expected suffix.', () => {
      const result = schema.validate('string-suffix')
      expect(result).toBe('string-suffix')
    })
  })

  describe('for a parameter `fix` equal to `false`', () => {

    const schema = StringSchema.create().endsWith('-suffix', { fix: false })

    it('throws when the input does not end with the expected suffix.', () => {
      expectSchema(schema, 'string').toThrow('The value must end with "-suffix".')
    })

    it('throws when the input ends with the expected suffix (case-sensitive).', () => {
      expectSchema(schema, 'string-SUFFIX').toThrow('The value must end with "-suffix".')
    })

    it('validates successfully when the input ends with the expected suffix.', () => {
      const result = schema.validate('string-suffix')
      expect(result).toBe('string-suffix')
    })
  })

  describe('for a parameter `fix` equal to `true`', () => {

    const schema = StringSchema.create().endsWith('-suffix', { fix: true })

    it('fixes and validates successfully when the input does not end with the expected suffix.', () => {
      const result = schema.validate('string')
      expect(result).toBe('string-suffix')
    })

    it('fixes and validates successfully when the input ends with the expected suffix (case-sensitive).', () => {
      const result = schema.validate('string-SUFFIX')
      expect(result).toBe('string-SUFFIX-suffix')
    })

    it('validates successfully when the input ends with the expected prefix.', () => {
      const result = schema.validate('string-suffix')
      expect(result).toBe('string-suffix')
    })
  })
})

// METHOD
describe('includes(search)', () => {

  const base = StringSchema.create()
  const schema = base.includes('str')

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('throws when the input does not include the expected search.', () => {
    expectSchema(schema, 'wrong').toThrow('The value must include "str".')
  })

  it('validates successfully when the input includes the expected search.', () => {
    const result = schema.validate('string')
    expect(result).toBe('string')
  })
})

// METHOD
describe('excludes(search)', () => {

  const base = StringSchema.create()
  const schema = base.excludes('str')

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('throws when the input includes the expected search.', () => {
    expectSchema(schema, 'string').toThrow('The value must not include "str".')
  })

  it('validates successfully when the input does not include the expected search.', () => {
    const result = schema.validate('text')
    expect(result).toBe('text')
  })
})
