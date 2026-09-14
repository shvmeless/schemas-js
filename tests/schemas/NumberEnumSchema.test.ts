// IMPORTS
import { describe, it, expect } from 'vitest'
import { EnumSchema } from '@/schemas/EnumSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation, expectError } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(...literals)', () => {

  it('throws when no `literals` are provided.', () => {
    expectError(() => {
      EnumSchema.create()
    }).toHaveMessage('Must provide at least one literal value.')
  })

  it('initializes with `Infinity` values', () => {
    const schema = EnumSchema.create(-Infinity, Infinity)
    expect(schema).toBeInstanceOf(EnumSchema)
    expectValidation(schema, -Infinity).toReturn(-Infinity)
    expectValidation(schema, Infinity).toReturn(Infinity)
  })

  it('initializes with `0` values', () => {
    const schema = EnumSchema.create(-0, 0)
    expect(schema).toBeInstanceOf(EnumSchema)
    expectValidation(schema, -0).toReturn(-0)
    expectValidation(schema, 0).toReturn(0)
  })

  it('initializes with decimal number values', () => {
    const schema = EnumSchema.create(-0.1, 0.1)
    expect(schema).toBeInstanceOf(EnumSchema)
    expectValidation(schema, -0.1).toReturn(-0.1)
    expectValidation(schema, 0.1).toReturn(0.1)
  })

  it('initializes with integer number values', () => {
    const schema = EnumSchema.create(-100, 100)
    expect(schema).toBeInstanceOf(EnumSchema)
    expectValidation(schema, -100).toReturn(-100)
    expectValidation(schema, 100).toReturn(100)
  })
})

// METHOD ---------------------------------------------------------------------

describe('.validate(input)', () => {

  const schema = EnumSchema.create(-1000, 0, 1000)

  it('throws when `input` is not a number.', () => {
    DataTypeGenerator.skip('numbers').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be match one of the allowed literal values.')
    })
  })

  it('returns when `input` matches one of the `literals`.', () => {
    expectValidation(schema, -1000).toReturn(-1000)
    expectValidation(schema, 0).toReturn(0)
    expectValidation(schema, 1000).toReturn(1000)
  })

  it('throws when `input` does not match any of the `literals`.', () => {
    expectValidation(schema, NaN).toThrow('The value must be match one of the allowed literal values.')
    expectValidation(schema, -Infinity).toThrow('The value must be match one of the allowed literal values.')
    expectValidation(schema, -100).toThrow('The value must be match one of the allowed literal values.')
    expectValidation(schema, -0.1).toThrow('The value must be match one of the allowed literal values.')
    expectValidation(schema, 0.1).toThrow('The value must be match one of the allowed literal values.')
    expectValidation(schema, 100).toThrow('The value must be match one of the allowed literal values.')
    expectValidation(schema, Infinity).toThrow('The value must be match one of the allowed literal values.')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.optional()', () => {

  const base = EnumSchema.create(-1000, 0, 1000)
  const schema = base.optional()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(EnumSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` matches one of the `literals`.', () => {
    expectValidation(schema, -1000).toReturn(-1000)
    expectValidation(schema, 0).toReturn(0)
    expectValidation(schema, 1000).toReturn(1000)
  })

  it('returns when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(undefined)
  })

  it('throws when `input` does not match any of the `literals`.', () => {
    DataTypeGenerator.skip('numbers', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be match one of the allowed literal values.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.nullable()', () => {

  const base = EnumSchema.create(-1000, 0, 1000)
  const schema = base.nullable()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(EnumSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` matches one of the `literals`.', () => {
    expectValidation(schema, -1000).toReturn(-1000)
    expectValidation(schema, 0).toReturn(0)
    expectValidation(schema, 1000).toReturn(1000)
  })

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })

  it('throws when `input` does not match any of the `literals`.', () => {
    DataTypeGenerator.skip('numbers', 'null').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be match one of the allowed literal values.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.default(value)', () => {

  const base = EnumSchema.create(-1000, 0, 1000).optional()
  const schema = base.default(0)

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(EnumSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` matches one of the `literals`.', () => {
    expectValidation(schema, -1000).toReturn(-1000)
    expectValidation(schema, 0).toReturn(0)
    expectValidation(schema, 1000).toReturn(1000)
  })

  it('returns the `default` value when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(0)
  })

  it('returns the `default` value when `input` is `null` and the schema is nullable.', () => {
    expectValidation(schema.nullable(), null).toReturn(0)
  })

  it('throws when `input` does not match any of the `literals`.', () => {
    DataTypeGenerator.skip('numbers', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be match one of the allowed literal values.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.fallback(value)', () => {

  const base = EnumSchema.create(-1000, 0, 1000)
  const schema = base.fallback(0)

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(EnumSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` matches one of the `literals`.', () => {
    expectValidation(schema, -1000).toReturn(-1000)
    expectValidation(schema, 0).toReturn(0)
    expectValidation(schema, 1000).toReturn(1000)
  })

  it('returns the `fallback` value when `input` does not match any of the `literals`.', () => {
    DataTypeGenerator.skip('numbers').forEach((value) => {
      expectValidation(schema, value).toReturn(0)
    })
    expectValidation(schema, 100).toReturn(0)
  })

  it('returns when `input` is `undefined` and the schema is optional.', () => {
    expectValidation(schema.optional(), undefined).toReturn(undefined)
  })

  it('returns when `input` is `null` and the schema is nullable.', () => {
    expectValidation(schema.nullable(), null).toReturn(null)
  })
})
