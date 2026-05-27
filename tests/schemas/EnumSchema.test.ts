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

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {
  describe('when `literals` are string values', () => {

    const schema = EnumSchema.create('A', 'B', 'C')

    it('throws when `input` is not a string.', () => {
      DataTypeGenerator.skip('strings').forEach((value) => {
        expectValidation(schema, value).toThrow('The value must be one of "A", "B", "C".')
      })
    })

    it('returns when `input` matches one of the `literals`.', () => {
      expectValidation(schema, 'A').toReturn('A')
      expectValidation(schema, 'B').toReturn('B')
      expectValidation(schema, 'C').toReturn('C')
    })

    it('throws when `input` does not match any of the `literals` (case-sensitive).', () => {
      expectValidation(schema, 'a').toThrow('The value must be one of "A", "B", "C".')
      expectValidation(schema, 'b').toThrow('The value must be one of "A", "B", "C".')
      expectValidation(schema, 'c').toThrow('The value must be one of "A", "B", "C".')
    })

    it('throws when `input` does not match any of the `literals`.', () => {
      expectValidation(schema, 'X').toThrow('The value must be one of "A", "B", "C".')
      expectValidation(schema, 'Y').toThrow('The value must be one of "A", "B", "C".')
      expectValidation(schema, 'Z').toThrow('The value must be one of "A", "B", "C".')
    })
  })

  describe('when `literals` are number values', () => {

    const schema = EnumSchema.create(-100, 0, 100)

    it('throws when `input` is not a number.', () => {
      DataTypeGenerator.skip('numbers').forEach((value) => {
        expectValidation(schema, value).toThrow('The value must be one of -100, 0, 100.')
      })
    })

    it('returns when `input` matches one of the `literals`.', () => {
      expectValidation(schema, -100).toReturn(-100)
      expectValidation(schema, 0).toReturn(0)
      expectValidation(schema, 100).toReturn(100)
    })

    it('throws when `input` does not match any of the `literals`.', () => {
      expectValidation(schema, -500).toThrow('The value must be one of -100, 0, 100.')
      expectValidation(schema, 500).toThrow('The value must be one of -100, 0, 100.')
    })

  })
})
