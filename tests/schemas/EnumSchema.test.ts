// IMPORTS
import { describe, expect, it } from 'vitest'
import { EnumSchema } from '@/schemas/EnumSchema'
import { expectSchema } from '@tests/helpers/expect'
import { DataTypeGenerator } from '@tests/helpers/generator'

// METHOD
describe('.create(literals)', () => {
  describe('when `literals` are string values', () => {

    const schema = EnumSchema.create('A', 'B', 'C')

    it('returns an instance of the schema.', () => {
      expect(schema).toBeInstanceOf(EnumSchema)
    })
  })

  describe('when `literals` are number values', () => {

    const schema = EnumSchema.create(-100, 0, 100)

    it('returns an instance of the schema.', () => {
      expect(schema).toBeInstanceOf(EnumSchema)
    })
  })
})

// METHOD
describe('.validate(input)', () => {
  describe('when `literals` are string values', () => {

    const schema = EnumSchema.create('A', 'B', 'C')

    it('throws when `input` is not a string.', () => {
      DataTypeGenerator.skip('strings').forEach((value) => {
        expectSchema(schema, value).toThrow('The value must be one of "A", "B", "C".')
      })
    })

    it('returns when `input` matches one of the `literals`.', () => {
      expectSchema(schema, 'A').toReturn('A')
      expectSchema(schema, 'B').toReturn('B')
      expectSchema(schema, 'C').toReturn('C')
    })

    it('throws when `input` does not match any of the `literals` (case-sensitive).', () => {
      expectSchema(schema, 'a').toThrow('The value must be one of "A", "B", "C".')
      expectSchema(schema, 'b').toThrow('The value must be one of "A", "B", "C".')
      expectSchema(schema, 'c').toThrow('The value must be one of "A", "B", "C".')
    })

    it('throws when `input` does not match any of the `literals`.', () => {
      expectSchema(schema, 'X').toThrow('The value must be one of "A", "B", "C".')
      expectSchema(schema, 'Y').toThrow('The value must be one of "A", "B", "C".')
      expectSchema(schema, 'Z').toThrow('The value must be one of "A", "B", "C".')
    })
  })

  describe('when `literals` are number values', () => {

    const schema = EnumSchema.create(-100, 0, 100)

    it('throws when `input` is not a number.', () => {
      DataTypeGenerator.skip('numbers').forEach((value) => {
        expectSchema(schema, value).toThrow('The value must be one of -100, 0, 100.')
      })
    })

    it('returns when `input` matches one of the `literals`.', () => {
      expectSchema(schema, -100).toReturn(-100)
      expectSchema(schema, 0).toReturn(0)
      expectSchema(schema, 100).toReturn(100)
    })

    it('throws when `input` does not match any of the `literals`.', () => {
      expectSchema(schema, -500).toThrow('The value must be one of -100, 0, 100.')
      expectSchema(schema, 500).toThrow('The value must be one of -100, 0, 100.')
    })

  })
})
