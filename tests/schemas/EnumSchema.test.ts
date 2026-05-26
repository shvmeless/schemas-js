// IMPORTS
import { describe, expect, it } from 'vitest'
import { EnumSchema } from '@/schemas/EnumSchema'
import { expectSchema } from '@tests/helpers/expect'
import { DataTypeGenerator } from '@tests/helpers/generator'

// METHOD
describe('.create(literals)', () => {
  describe('when `literals` are string values', () => {

    const schema = EnumSchema.create('A', 'B', 'C')

    it('throws when `input` is not a string.', () => {
      DataTypeGenerator.skip('strings').forEach((value) => {
        expectSchema(schema, value).toThrow('The value must be one of "A", "B", "C".')
      })
    })

    it('returns when `input` matches one of the `literals`.', () => {
      const inputs = ['A', 'B', 'C']
      inputs.forEach((input) => {
        const result = schema.validate(input)
        expect(result).toBe(input)
      })
    })

    it('throws when `input` does not match any of the `literals`.', () => {
      expectSchema(schema, 'D').toThrow('The value must be one of "A", "B", "C".')
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
      const inputs = [-100, 0, 100]
      inputs.forEach((input) => {
        const result = schema.validate(input)
        expect(result).toBe(input)
      })
    })

    it('throws when `input` does not match any of the `literals`.', () => {
      expectSchema(schema, 255).toThrow('The value must be one of -100, 0, 100.')
    })

  })
})
