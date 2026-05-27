// IMPORTS
import { describe, it, expect } from 'vitest'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation, expectError } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create()', () => {

  const schema = StringSchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = StringSchema.create()

  it('return when `input` is a string.', () => {
    expectValidation(schema, 'string').toReturn('string')
    expectValidation(schema, 'text').toReturn('text')
    expectValidation(schema, 'example').toReturn('example')
  })

  it('returns when `input` is an empty string.', () => {
    expectValidation(schema, '').toReturn('')
  })

  it('throws when `input` is not a string.', () => {
    DataTypeGenerator.skip('strings').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a string.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.length(length)', () => {
  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        StringSchema.create().length(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        StringSchema.create().length(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const base = StringSchema.create()
    const schema = base.length(0)

    it('returns when `input` length is as expected.', () => {
      expectValidation(schema, '').toReturn('')
    })

    it('throws when `input` length is greater than expected.', () => {
      expectValidation(schema, '1').toThrow('The value must be 0 characters long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const base = StringSchema.create()
    const schema = base.length(8)

    it('throws when `input` length is less than expected.', () => {
      expectValidation(schema, '1234567').toThrow('The value must be 8 characters long.')
    })

    it('returns when `input` length is as expected.', () => {
      expectValidation(schema, '12345678').toReturn('12345678')
    })

    it('throws when `input` length is greater than expected.', () => {
      expectValidation(schema, '123456789').toThrow('The value must be 8 characters long.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.min(length)', () => {
  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        StringSchema.create().min(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        StringSchema.create().min(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const base = StringSchema.create()
    const schema = base.min(0)

    it('returns when `input` length is as expected.', () => {
      expectValidation(schema, '').toReturn('')
    })

    it('returns when `input` length is greater than expected.', () => {
      expectValidation(schema, '1').toReturn('1')
    })
  })

  describe('when `length` is a positive number', () => {

    const base = StringSchema.create()
    const schema = base.min(8)

    it('throws when `input` length is less than expected.', () => {
      expectValidation(schema, '1234567').toThrow('The value must be at least 8 characters long.')
    })

    it('returns when `input` length is as expected.', () => {
      expectValidation(schema, '12345678').toReturn('12345678')
    })

    it('returns when `input` length is greater than expected.', () => {
      expectValidation(schema, '123456789').toReturn('123456789')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.max(length)', () => {
  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        StringSchema.create().max(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        StringSchema.create().max(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const base = StringSchema.create()
    const schema = base.max(0)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` length is as expected.', () => {
      expectValidation(schema, '').toReturn('')
    })

    it('throws when `input` length is greater than expected.', () => {
      expectValidation(schema, '1').toThrow('The value must be at most 0 characters long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const base = StringSchema.create()
    const schema = base.max(8)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` length is less than expected.', () => {
      expectValidation(schema, '1234567').toReturn('1234567')
    })

    it('returns when `input` length is as expected.', () => {
      expectValidation(schema, '12345678').toReturn('12345678')
    })

    it('throws when `input` length is greater than expected.', () => {
      expectValidation(schema, '123456789').toThrow('The value must be at most 8 characters long.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.lowercase({ fix })', () => {
  describe('when `fix` is `undefined`', () => {

    const base = StringSchema.create()
    const schema = base.lowercase()

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` contains uppercase characters.', () => {
      expectValidation(schema, 'eXaMpLe').toThrow('The value must be lowercase.')
    })

    it('returns when `input` does not contain uppercase characters.', () => {
      expectValidation(schema, 'example').toReturn('example')
    })
  })

  describe('when `fix` is `false`', () => {

    const base = StringSchema.create()
    const schema = base.lowercase({ fix: false })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` contains uppercase characters.', () => {
      expectValidation(schema, 'eXaMpLe').toThrow('The value must be lowercase.')
    })

    it('returns when `input` does not contain uppercase characters.', () => {
      expectValidation(schema, 'example').toReturn('example')
    })
  })

  describe('when `fix` is `true`', () => {

    const base = StringSchema.create()
    const schema = base.lowercase({ fix: true })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('fixes when `input` contains uppercase characters.', () => {
      expectValidation(schema, 'eXaMpLe').toReturn('example')
    })

    it('returns when `input` does not contain uppercase characters.', () => {
      expectValidation(schema, 'example').toReturn('example')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.uppercase({ fix })', () => {
  describe('when `fix` is `undefined`', () => {

    const base = StringSchema.create()
    const schema = base.uppercase()

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` contains lowercase characters.', () => {
      expectValidation(schema, 'eXaMpLe').toThrow('The value must be uppercase.')
    })

    it('returns when `input` does not contain lowercase characters.', () => {
      expectValidation(schema, 'EXAMPLE').toReturn('EXAMPLE')
    })
  })

  describe('when `fix` is `false`', () => {

    const base = StringSchema.create()
    const schema = base.uppercase({ fix: false })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` contains lowercase characters.', () => {
      expectValidation(schema, 'eXaMpLe').toThrow('The value must be uppercase.')
    })

    it('returns when `input` does not contain lowercase characters.', () => {
      expectValidation(schema, 'EXAMPLE').toReturn('EXAMPLE')
    })
  })

  describe('when `fix` is `true`', () => {

    const base = StringSchema.create()
    const schema = base.uppercase({ fix: true })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('fixes when `input` contains lowercase characters.', () => {
      expectValidation(schema, 'eXaMpLe').toReturn('EXAMPLE')
    })

    it('returns when `input` does not contain lowercase characters.', () => {
      expectValidation(schema, 'EXAMPLE').toReturn('EXAMPLE')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.trim({ fix })', () => {
  describe('when `fix` is `undefined`', () => {

    const base = StringSchema.create()
    const schema = base.trim()

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` contains whitespaces at the beginning.', () => {
      expectValidation(schema, '   EXAMPLE').toThrow('The value must be trimmed.')
    })

    it('throws when `input` contains whitespaces at the end.', () => {
      expectValidation(schema, 'EXAMPLE   ').toThrow('The value must be trimmed.')
    })

    it('throws when `input` is surrounded by whitespaces.', () => {
      expectValidation(schema, '   EXAMPLE   ').toThrow('The value must be trimmed.')
    })

    it('returns when `input` is not surrounded by whitespaces.', () => {
      expectValidation(schema, 'EXAMPLE').toReturn('EXAMPLE')
    })
  })

  describe('when `fix` is `false`', () => {

    const base = StringSchema.create()
    const schema = base.trim({ fix: false })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` contains whitespaces at the beginning.', () => {
      expectValidation(schema, '   EXAMPLE').toThrow('The value must be trimmed.')
    })

    it('throws when `input` contains whitespaces at the end.', () => {
      expectValidation(schema, 'EXAMPLE   ').toThrow('The value must be trimmed.')
    })

    it('throws when `input` is surrounded by whitespaces.', () => {
      expectValidation(schema, '   EXAMPLE   ').toThrow('The value must be trimmed.')
    })

    it('returns when `input` is not surrounded by whitespaces.', () => {
      expectValidation(schema, 'EXAMPLE').toReturn('EXAMPLE')
    })
  })

  describe('when `fix` is `true`', () => {

    const base = StringSchema.create()
    const schema = base.trim({ fix: true })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` contains whitespaces at the beginning.', () => {
      expectValidation(schema, '   EXAMPLE').toReturn('EXAMPLE')
    })

    it('returns when `input` contains whitespaces at the end.', () => {
      expectValidation(schema, 'EXAMPLE   ').toReturn('EXAMPLE')
    })

    it('returns when `input` is surrounded by whitespaces.', () => {
      expectValidation(schema, '   EXAMPLE   ').toReturn('EXAMPLE')
    })

    it('returns when `input` is not surrounded by whitespaces.', () => {
      expectValidation(schema, 'EXAMPLE').toReturn('EXAMPLE')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.startsWith(prefix, { fix })', () => {

  describe('when `fix` is `undefined`', () => {

    const base = StringSchema.create()
    const schema = base.startsWith('prefix-')

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` does not start with the expected `prefix`.', () => {
      expectValidation(schema, 'string').toThrow('The value must start with "prefix-".')
    })

    it('throws when `input` starts with the expected `prefix` (case-sensitive).', () => {
      expectValidation(schema, 'PREFIX-string').toThrow('The value must start with "prefix-".')
    })

    it('returns when `input` starts with the expected `prefix`.', () => {
      expectValidation(schema, 'prefix-string').toReturn('prefix-string')
    })
  })

  describe('when `fix` is `false`', () => {

    const base = StringSchema.create()
    const schema = base.startsWith('prefix-', { fix: false })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` does not start with the expected `prefix`.', () => {
      expectValidation(schema, 'string').toThrow('The value must start with "prefix-".')
    })

    it('throws when `input` starts with the expected `prefix` (case-sensitive).', () => {
      expectValidation(schema, 'PREFIX-string').toThrow('The value must start with "prefix-".')
    })

    it('returns when `input` starts with the expected `prefix`.', () => {
      expectValidation(schema, 'prefix-string').toReturn('prefix-string')
    })
  })

  describe('when `fix` is `true`', () => {

    const base = StringSchema.create()
    const schema = base.startsWith('prefix-', { fix: true })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('fixes when `input` does not start with the expected `prefix`.', () => {
      expectValidation(schema, 'string').toReturn('prefix-string')
    })

    it('fixes when `input` starts with the expected `prefix` (case-sensitive).', () => {
      expectValidation(schema, 'PREFIX-string').toReturn('prefix-PREFIX-string')
    })

    it('returns when `input` starts with the expected `prefix`.', () => {
      expectValidation(schema, 'prefix-string').toReturn('prefix-string')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.endsWith(suffix, { fix })', () => {
  describe('when `fix` is `undefined`', () => {

    const base = StringSchema.create()
    const schema = base.endsWith('-suffix')

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` does not end with the expected `suffix`.', () => {
      expectValidation(schema, 'string').toThrow('The value must end with "-suffix".')
    })

    it('throws when `input` ends with the expected `suffix` (case-sensitive).', () => {
      expectValidation(schema, 'string-SUFFIX').toThrow('The value must end with "-suffix".')
    })

    it('returns when `input` ends with the expected `suffix`.', () => {
      expectValidation(schema, 'string-suffix').toReturn('string-suffix')
    })
  })

  describe('when `fix` is `false`', () => {

    const base = StringSchema.create()
    const schema = base.endsWith('-suffix', { fix: false })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` does not end with the expected `suffix`.', () => {
      expectValidation(schema, 'string').toThrow('The value must end with "-suffix".')
    })

    it('throws when `input` ends with the expected `suffix` (case-sensitive).', () => {
      expectValidation(schema, 'string-SUFFIX').toThrow('The value must end with "-suffix".')
    })

    it('returns when `input` ends with the expected `suffix`.', () => {
      expectValidation(schema, 'string-suffix').toReturn('string-suffix')
    })
  })

  describe('when `fix` is `true`', () => {

    const base = StringSchema.create()
    const schema = base.endsWith('-suffix', { fix: true })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(StringSchema)
      expect(schema).not.toBe(base)
    })

    it('fixes when `input` does not end with the expected `suffix`.', () => {
      expectValidation(schema, 'string').toReturn('string-suffix')
    })

    it('fixes when `input` ends with the expected `suffix` (case-sensitive).', () => {
      expectValidation(schema, 'string-SUFFIX').toReturn('string-SUFFIX-suffix')
    })

    it('returns when `input` ends with the expected `suffix`.', () => {
      expectValidation(schema, 'string-suffix').toReturn('string-suffix')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.includes(search)', () => {

  const base = StringSchema.create()
  const schema = base.includes('str')

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('throws when `input` does not include the expected `search`.', () => {
    expectValidation(schema, 'wrong').toThrow('The value must include "str".')
  })

  it('returns when `input` includes the expected `search`.', () => {
    expectValidation(schema, 'string').toReturn('string')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.excludes(search)', () => {

  const base = StringSchema.create()
  const schema = base.excludes('str')

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('throws when `input` includes the expected `search`.', () => {
    expectValidation(schema, 'string').toThrow('The value must not include "str".')
  })

  it('returns when `input` does not include the expected `search`.', () => {
    expectValidation(schema, 'text').toReturn('text')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.match(pattern)', () => {

  const base = StringSchema.create()
  const schema = base.match(/^[a-z]+$/)

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('throws when `input` does not match the `pattern`.', () => {
    expectValidation(schema, '12345').toThrow('The value must match the pattern /^[a-z]+$/.')
  })

  it('returns when `input` matches the `pattern`.', () => {
    expectValidation(schema, 'abcde').toReturn('abcde')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.default(default)', () => {

  const base = StringSchema.create()
  const schema = base.default('DEFAULT')

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('returns `default` value when `input` is an empty string.', () => {
    expectValidation(schema, '').toReturn('DEFAULT')
  })

  it('returns when `input` is not an empty string.', () => {
    expectValidation(schema, 'string').toReturn('string')
  })
})
