// IMPORTS
import { describe, it, expect } from 'vitest'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// NOTE -----------------------------------------------------------------------

// `GenericSchema` is abstract, so `StringSchema` is used as a concrete
// implementation to test the behaviour inherited by every schema:
// `.optional()`, `.nullable()`, `.default(value)` and `.fallback(value)`.
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
