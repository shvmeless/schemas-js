// IMPORTS
import { describe, expect, it } from 'vitest'
import { LiteralSchema } from '@/schemas/LiteralSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {
  describe('with a string type', () => {

    const schema = LiteralSchema.create('LITERAL')

    it('validates an input that matches the literal.', () => {
      const result = schema.validate('LITERAL')
      expect(result).toBe('LITERAL')
    })

    it('throws when input does not match the literal.', () => {
      expectSchema(schema, 'WRONG').toThrow('The value must be the literal "LITERAL".')
    })

    it('throws when input does not match the type.', () => {
      DataTypeGenerator.skip('strings').forEach((value) => {
        expectSchema(schema, value).toThrow('The value must be the literal "LITERAL".')
      })
    })

  })

  describe('with a number type', () => {

    const schema = LiteralSchema.create(255)

    it('validates an input that matches the literal.', () => {
      const result = schema.validate(255)
      expect(result).toBe(255)
    })

    it('throws when input does not match the literal.', () => {
      expectSchema(schema, 0).toThrow('The value must be the literal 255.')
    })

    it('throws when input does not match the type.', () => {
      DataTypeGenerator.skip('numbers').forEach((value) => {
        expectSchema(schema, value).toThrow('The value must be the literal 255.')
      })
    })

  })

  describe('with a boolean type', () => {

    const schema = LiteralSchema.create(true)

    it('validates an input that matches the literal.', () => {
      const result = schema.validate(true)
      expect(result).toBe(true)
    })

    it('throws when input does not match the literal.', () => {
      expectSchema(schema, false).toThrow('The value must be the literal true.')
    })

    it('throws when input does not match the type.', () => {
      DataTypeGenerator.skip('booleans').forEach((value) => {
        expectSchema(schema, value).toThrow('The value must be the literal true.')
      })
    })

  })
})
