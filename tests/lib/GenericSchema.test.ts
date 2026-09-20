// IMPORTS
import { describe, it, expect } from 'vitest'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'
import { ValidationError } from '@/errors/ValidationError'

// NOTE -----------------------------------------------------------------------

// `GenericSchema` is abstract, so `StringSchema` is used as a concrete
// implementation to test the behaviour inherited by every schema:
// `.optional()`, `.nullable()`, `.default(value)`, `.fallback(value)` and
// `.test(id, test)`.
// These methods are not tested again in each concrete schema.

// METHOD ---------------------------------------------------------------------
describe('.optional()', () => {

  const base = StringSchema.create()
  const schema = base.optional()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is valid.', () => {
    expectValidation(schema, 'string').toReturn('string')
  })

  it('returns when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(undefined)
  })

  it('throws when `input` is invalid.', () => {
    DataTypeGenerator.skip('strings', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a string.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.nullable()', () => {

  const base = StringSchema.create()
  const schema = base.nullable()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is valid.', () => {
    expectValidation(schema, 'string').toReturn('string')
  })

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })

  it('throws when `input` is invalid.', () => {
    DataTypeGenerator.skip('strings', 'null').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a string.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.default(value)', () => {

  const base = StringSchema.create().optional()
  const schema = base.default('default-string')

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is valid.', () => {
    expectValidation(schema, 'string').toReturn('string')
  })

  it('returns the `default` value when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn('default-string')
  })

  it('returns the `default` value when `input` is `null` and the schema is nullable.', () => {
    expectValidation(schema.nullable(), null).toReturn('default-string')
  })

  it('returns the `default` value when `input` is `undefined` and the schema is nullable.', () => {
    expectValidation(StringSchema.create().optional().nullable().default('default-string'), undefined).toReturn('default-string')
  })

  it('throws when `input` is invalid.', () => {
    DataTypeGenerator.skip('strings', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a string.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.fallback(value)', () => {

  const base = StringSchema.create()
  const schema = base.fallback('fallback')

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is valid.', () => {
    expectValidation(schema, 'string').toReturn('string')
  })

  it('returns the `fallback` value when `input` is invalid.', () => {
    DataTypeGenerator.skip('strings').forEach((value) => {
      expectValidation(schema, value).toReturn('fallback')
    })
  })

  it('returns the `fallback` value when `input` does not satisfy the validations.', () => {
    const constrained = StringSchema.create().min(8).fallback('fallback')
    expectValidation(constrained, 'short').toReturn('fallback')
  })

  it('returns when `input` is `undefined` and the schema is optional.', () => {
    expectValidation(schema.optional(), undefined).toReturn(undefined)
  })

  it('returns when `input` is `null` and the schema is nullable.', () => {
    expectValidation(schema.nullable(), null).toReturn(null)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.parse(callback)', () => {

  const base = StringSchema.create()
  const schema = base.parse((input) => {
    if (typeof input === 'string') return input
    if (typeof input === 'number') return input.toString()
    throw new ValidationError(input, 'The value must be a string or a number.')
  })

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `parse` returns a value that satisfies the schema.', () => {
    expectValidation(schema, 'string').toReturn('string')
    expectValidation(schema, 100).toReturn('100')
  })

  it('throws when `parse` returns a value that does not satisfy the schema.', () => {
    const constrained = StringSchema.create().min(8)
    expectValidation(constrained, 'short').toThrow('The value must be at least 8 characters long.')
  })

  it('throws when `parse` throws a `ValidationError`.', () => {
    DataTypeGenerator.skip('strings', 'numbers').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a string or a number.')
    })
  })

  it('returns when `parse` throws but `fallback` is provided.', () => {
    DataTypeGenerator.skip('strings', 'numbers').forEach((value) => {
      expectValidation(schema.fallback('fallback'), value).toReturn('fallback')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.prepare(callback)', () => {

  const base = StringSchema.create()
  const schema = base.prepare((value) => {
    if (value === '') throw new ValidationError(value, 'The value must not be empty.')
    return value.toUpperCase()
  })

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `prepare` returns a value that satisfies the schema.', () => {
    expectValidation(schema, 'string').toReturn('STRING')
  })

  it('throws when `prepare` returns a value that does not satisfy the schema.', () => {
    const constrained = StringSchema.create().min(8)
    expectValidation(constrained, 'short').toThrow('The value must be at least 8 characters long.')
  })

  it('throws when `prepare` throws a `ValidationError`.', () => {
    expectValidation(schema, '').toThrow('The value must not be empty.')
  })

  it('returns when `prepare` throws but `fallback` is provided.', () => {
    expectValidation(schema.fallback('fallback'), '').toReturn('fallback')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.refine(callback)', () => {

  const base = StringSchema.create()
  const schema = base.refine((value) => {
    if (value === '') throw new ValidationError(value, 'The value must not be empty.')
    return value.toUpperCase()
  })

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `refine` returns a value.', () => {
    const constrained = schema.lowercase()
    expectValidation(constrained, 'string').toReturn('STRING')
  })

  it('throws when `refine` throws a `ValidationError`.', () => {
    expectValidation(schema, '').toThrow('The value must not be empty.')
  })

  it('returns when `refine` throws but `fallback` is provided.', () => {
    expectValidation(schema.fallback('fallback'), '').toReturn('fallback')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.test(id, test)', () => {

  const base = StringSchema.create()
  const schema = base.test('allowed', (current) => {
    if (current !== 'allowed') return 'The value must be "allowed".'
    return null
  })

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(StringSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when the test is satisfied.', () => {
    expectValidation(schema, 'allowed').toReturn('allowed')
  })

  it('throws when the test is not satisfied.', () => {
    expectValidation(schema, 'string').toThrow('The value must be "allowed".')
  })

  it('returns when the test is not satisfied but `fallback` is provided.', () => {
    expectValidation(schema.fallback('fallback'), 'string').toReturn('fallback')
  })
})
