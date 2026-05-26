// IMPORTS
import { describe, it } from 'vitest'
import { LiteralSchema } from '@/schemas/LiteralSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(literal)', () => {
  describe('when `literal` is a string', () => {

    const schema = LiteralSchema.create('LITERAL')

    it('throws when `input` is not a string.', () => {
      DataTypeGenerator.skip('strings').forEach((value) => {
        expectSchema(schema, value).toThrow('The value must be the literal "LITERAL".')
      })
    })

    it('returns when `input` matches the `literal`.', () => {
      expectSchema(schema, 'LITERAL').toReturn('LITERAL')
    })

    it('throws when `input` does not match the `literal` (case-sensitive).', () => {
      expectSchema(schema, 'literal').toThrow('The value must be the literal "LITERAL".')
    })

    it('throws when `input` does not match the `literal`.', () => {
      expectSchema(schema, 'WRONG').toThrow('The value must be the literal "LITERAL".')
      expectSchema(schema, 'TEXT').toThrow('The value must be the literal "LITERAL".')
      expectSchema(schema, 'STRING').toThrow('The value must be the literal "LITERAL".')
    })
  })

  describe('when `literal` is a number', () => {

    const schema = LiteralSchema.create(255)

    it('throws when `input` is not a number.', () => {
      DataTypeGenerator.skip('numbers').forEach((value) => {
        expectSchema(schema, value).toThrow('The value must be the literal 255.')
      })
    })

    it('returns when `input` matches the `literal`.', () => {
      expectSchema(schema, 255).toReturn(255)
    })

    it('throws when `input` does not match the `literal`.', () => {
      expectSchema(schema, -500).toThrow('The value must be the literal 255.')
      expectSchema(schema, 0).toThrow('The value must be the literal 255.')
      expectSchema(schema, 500).toThrow('The value must be the literal 255.')
    })
  })

  describe('when `literal` is a boolean', () => {

    const schema = LiteralSchema.create(true)

    it('throws when `input` is not a boolean.', () => {
      DataTypeGenerator.skip('booleans').forEach((value) => {
        expectSchema(schema, value).toThrow('The value must be the literal true.')
      })
    })

    it('returns when `input` matches the `literal`.', () => {
      expectSchema(schema, true).toReturn(true)
    })

    it('throws when `input` does not match the `literal`.', () => {
      expectSchema(schema, false).toThrow('The value must be the literal true.')
    })
  })
})
