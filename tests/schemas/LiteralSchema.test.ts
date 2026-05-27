// IMPORTS
import { describe, it, expect } from 'vitest'
import { LiteralSchema } from '@/schemas/LiteralSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(literal)', () => {
  describe('when `literal` is a string', () => {

    const schema = LiteralSchema.create('LITERAL')

    it('returns an instance of the schema.', () => {
      expect(schema).toBeInstanceOf(LiteralSchema)
    })
  })

  describe('when `literal` is a number', () => {

    const schema = LiteralSchema.create(255)

    it('returns an instance of the schema.', () => {
      expect(schema).toBeInstanceOf(LiteralSchema)
    })
  })

  describe('when `literal` is a boolean', () => {

    const schema = LiteralSchema.create(true)

    it('returns an instance of the schema.', () => {
      expect(schema).toBeInstanceOf(LiteralSchema)
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {
  describe('when `literal` is a string', () => {

    const schema = LiteralSchema.create('LITERAL')

    it('throws when `input` is not a string.', () => {
      DataTypeGenerator.skip('strings').forEach((value) => {
        expectValidation(schema, value).toThrow('The value must be the literal "LITERAL".')
      })
    })

    it('returns when `input` matches the `literal`.', () => {
      expectValidation(schema, 'LITERAL').toReturn('LITERAL')
    })

    it('throws when `input` does not match the `literal` (case-sensitive).', () => {
      expectValidation(schema, 'literal').toThrow('The value must be the literal "LITERAL".')
    })

    it('throws when `input` does not match the `literal`.', () => {
      expectValidation(schema, 'WRONG').toThrow('The value must be the literal "LITERAL".')
      expectValidation(schema, 'TEXT').toThrow('The value must be the literal "LITERAL".')
      expectValidation(schema, 'STRING').toThrow('The value must be the literal "LITERAL".')
    })
  })

  describe('when `literal` is a number', () => {

    const schema = LiteralSchema.create(255)

    it('throws when `input` is not a number.', () => {
      DataTypeGenerator.skip('numbers').forEach((value) => {
        expectValidation(schema, value).toThrow('The value must be the literal 255.')
      })
    })

    it('returns when `input` matches the `literal`.', () => {
      expectValidation(schema, 255).toReturn(255)
    })

    it('throws when `input` does not match the `literal`.', () => {
      expectValidation(schema, -500).toThrow('The value must be the literal 255.')
      expectValidation(schema, 0).toThrow('The value must be the literal 255.')
      expectValidation(schema, 500).toThrow('The value must be the literal 255.')
    })
  })

  describe('when `literal` is a boolean', () => {

    const schema = LiteralSchema.create(true)

    it('throws when `input` is not a boolean.', () => {
      DataTypeGenerator.skip('booleans').forEach((value) => {
        expectValidation(schema, value).toThrow('The value must be the literal true.')
      })
    })

    it('returns when `input` matches the `literal`.', () => {
      expectValidation(schema, true).toReturn(true)
    })

    it('throws when `input` does not match the `literal`.', () => {
      expectValidation(schema, false).toThrow('The value must be the literal true.')
    })
  })
})
