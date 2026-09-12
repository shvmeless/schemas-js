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

  it('initializes with empty string `literal`.', () => {
    const schema = EnumSchema.create('')
    expect(schema).toBeInstanceOf(EnumSchema)
    expectValidation(schema, '').toReturn('')
  })

  it('initializes with single character `literal`.', () => {
    const schema = EnumSchema.create('A', 'B', 'C')
    expect(schema).toBeInstanceOf(EnumSchema)
    expectValidation(schema, 'A').toReturn('A')
    expectValidation(schema, 'B').toReturn('B')
    expectValidation(schema, 'C').toReturn('C')
  })

  it('initializes with long string `literal`.', () => {
    const schema = EnumSchema.create('I write these words in steel', 'Anything not set in metal cannot be trusted.')
    expect(schema).toBeInstanceOf(EnumSchema)
    expectValidation(schema, 'I write these words in steel').toReturn('I write these words in steel')
    expectValidation(schema, 'Anything not set in metal cannot be trusted.').toReturn('Anything not set in metal cannot be trusted.')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = EnumSchema.create('ALLOWED', 'LITERAL', 'EXAMPLE')

  it('throws when `input` is not a string.', () => {
    DataTypeGenerator.skip('strings').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be match one of the allowed literal values.')
    })
  })

  it('returns when `input` matches one of the `literals`.', () => {
    expectValidation(schema, 'ALLOWED').toReturn('ALLOWED')
    expectValidation(schema, 'LITERAL').toReturn('LITERAL')
    expectValidation(schema, 'EXAMPLE').toReturn('EXAMPLE')
  })

  it('throws when `input` does not match any of the `literals`.', () => {
    expectValidation(schema, 'WRONG').toThrow('The value must be match one of the allowed literal values.')
    expectValidation(schema, 'TEXT').toThrow('The value must be match one of the allowed literal values.')
    expectValidation(schema, 'STRING').toThrow('The value must be match one of the allowed literal values.')
  })

  it('throws when `input` does not match any of the `literals` (case-sensitive).', () => {
    expectValidation(schema, 'Allowed').toThrow('The value must be match one of the allowed literal values.')
    expectValidation(schema, 'literal').toThrow('The value must be match one of the allowed literal values.')
    expectValidation(schema, 'ExAmPlE').toThrow('The value must be match one of the allowed literal values.')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.optional()', () => {

  const base = EnumSchema.create('ALLOWED', 'LITERAL', 'EXAMPLE')
  const schema = base.optional()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(EnumSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` matches one of the `literals`.', () => {
    expectValidation(schema, 'ALLOWED').toReturn('ALLOWED')
    expectValidation(schema, 'LITERAL').toReturn('LITERAL')
    expectValidation(schema, 'EXAMPLE').toReturn('EXAMPLE')
  })

  it('returns when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(undefined)
  })

  it('throws when `input` does not match any of the `literals`.', () => {
    DataTypeGenerator.skip('strings', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be match one of the allowed literal values.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.nullable()', () => {

  const base = EnumSchema.create('ALLOWED', 'LITERAL', 'EXAMPLE')
  const schema = base.nullable()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(EnumSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` matches one of the `literals`.', () => {
    expectValidation(schema, 'ALLOWED').toReturn('ALLOWED')
    expectValidation(schema, 'LITERAL').toReturn('LITERAL')
    expectValidation(schema, 'EXAMPLE').toReturn('EXAMPLE')
  })

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })

  it('throws when `input` does not match any of the `literals`.', () => {
    DataTypeGenerator.skip('strings', 'null').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be match one of the allowed literal values.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.default(value)', () => {

  const base = EnumSchema.create('ALLOWED', 'LITERAL', 'EXAMPLE').optional()
  const schema = base.default('LITERAL')

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(EnumSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` matches one of the `literals`.', () => {
    expectValidation(schema, 'ALLOWED').toReturn('ALLOWED')
    expectValidation(schema, 'LITERAL').toReturn('LITERAL')
    expectValidation(schema, 'EXAMPLE').toReturn('EXAMPLE')
  })

  it('returns the `default` value when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn('LITERAL')
  })

  it('returns the `default` value when `input` is `null` and the schema is nullable.', () => {
    expectValidation(schema.nullable(), null).toReturn('LITERAL')
  })

  it('throws when `input` does not match any of the `literals`.', () => {
    DataTypeGenerator.skip('strings', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be match one of the allowed literal values.')
    })
  })
})
