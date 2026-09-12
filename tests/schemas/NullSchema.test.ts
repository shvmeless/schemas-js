// IMPORTS
import { describe, it, expect } from 'vitest'
import { NullSchema } from '@/schemas/NullSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create()', () => {

  const schema = NullSchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NullSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = NullSchema.create()

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })

  it('throws when `input` is not `null`.', () => {
    DataTypeGenerator.skip('null').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be null.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.optional()', () => {

  const base = NullSchema.create()
  const schema = base.optional()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NullSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })

  it('returns when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(undefined)
  })

  it('throws when `input` is not `null`.', () => {
    DataTypeGenerator.skip('null', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be null.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.default(value)', () => {

  const base = NullSchema.create().optional()
  const schema = base.default(null)

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NullSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })

  it('returns the `default` value when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(null)
  })

  it('throws when `input` is not `null`.', () => {
    DataTypeGenerator.skip('null', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be null.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.fallback(value)', () => {

  const base = NullSchema.create()
  const schema = base.fallback(null)

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NullSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })

  it('returns the `fallback` value when `input` is not `null`.', () => {
    DataTypeGenerator.skip('null').forEach((value) => {
      expectValidation(schema, value).toReturn(null)
    })
  })

  it('returns when `input` is `undefined` and the schema is optional.', () => {
    expectValidation(schema.optional(), undefined).toReturn(undefined)
  })
})
