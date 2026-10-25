// IMPORTS
import { describe, it, expect } from 'vitest'
import { LiteralSchema } from '@/schemas/LiteralSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(literal)', () => {

  it('initializes with empty string `literal`.', () => {
    const empty = LiteralSchema.create('')
    expect(empty).toBeInstanceOf(LiteralSchema)
    expectValidation(empty, '').toReturn('')
  })

  it('initializes with single character `literal`.', () => {
    const a = LiteralSchema.create('A')
    expect(a).toBeInstanceOf(LiteralSchema)
    expectValidation(a, 'A').toReturn('A')
  })

  it('initializes with long string `literal`.', () => {
    const schema = LiteralSchema.create('I write these words in steel, for anything not set in metal cannot be trusted.')
    expect(schema).toBeInstanceOf(LiteralSchema)
    expectValidation(schema, 'I write these words in steel, for anything not set in metal cannot be trusted.').toReturn('I write these words in steel, for anything not set in metal cannot be trusted.')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = LiteralSchema.create('LITERAL')

  it('throws when `input` is not a string.', () => {
    DataTypeGenerator.skip('strings').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must match the literal value.')
    })
  })

  it('returns when `input` matches the `literal`.', () => {
    expectValidation(schema, 'LITERAL').toReturn('LITERAL')
  })

  it('throws when `input` does not match the `literal`.', () => {
    expectValidation(schema, 'WRONG').toThrow('The value must match the literal value.')
    expectValidation(schema, 'TEXT').toThrow('The value must match the literal value.')
    expectValidation(schema, 'STRING').toThrow('The value must match the literal value.')
  })

  it('throws when `input` does not match the `literal` (case-sensitive).', () => {
    expectValidation(schema, 'Literal').toThrow('The value must match the literal value.')
    expectValidation(schema, 'literaL').toThrow('The value must match the literal value.')
    expectValidation(schema, 'LiTeRaL').toThrow('The value must match the literal value.')
  })
})

