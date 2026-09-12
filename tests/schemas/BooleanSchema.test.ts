// IMPORTS
import { describe, it, expect } from 'vitest'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create()', () => {

  const schema = BooleanSchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(BooleanSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = BooleanSchema.create()

  it('returns when `input` is a boolean.', () => {
    expectValidation(schema, true).toReturn(true)
    expectValidation(schema, false).toReturn(false)
  })

  it('throws when `input` is not a boolean.', () => {
    DataTypeGenerator.skip('booleans').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a boolean.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.optional()', () => {

  const base = BooleanSchema.create()
  const schema = base.optional()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(BooleanSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is a boolean.', () => {
    expectValidation(schema, true).toReturn(true)
    expectValidation(schema, false).toReturn(false)
  })

  it('returns when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(undefined)
  })

  it('throws when `input` is not a boolean.', () => {
    DataTypeGenerator.skip('booleans', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a boolean.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.nullable()', () => {

  const base = BooleanSchema.create()
  const schema = base.nullable()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(BooleanSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is a boolean.', () => {
    expectValidation(schema, true).toReturn(true)
    expectValidation(schema, false).toReturn(false)
  })

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })

  it('throws when `input` is not a boolean.', () => {
    DataTypeGenerator.skip('booleans', 'null').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a boolean.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.default(value)', () => {

  const base = BooleanSchema.create().optional()
  const schema = base.default(true)

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(BooleanSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is a boolean.', () => {
    expectValidation(schema, true).toReturn(true)
    expectValidation(schema, false).toReturn(false)
  })

  it('returns the `default` value when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(true)
  })

  it('returns the `default` value when `input` is `null` and the schema is nullable.', () => {
    expectValidation(schema.nullable(), null).toReturn(true)
  })

  it('throws when `input` is not a boolean.', () => {
    DataTypeGenerator.skip('booleans', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a boolean.')
    })
  })
})
