import { describe, expect, it } from 'vitest'
import { EnumSchema } from '@/schemas/EnumSchema'
import { expectSchema } from '@tests/helpers/expect'
import { DataTypeGenerator } from '@tests/helpers/generator'

// METHOD
describe('.create()', () => {
  describe('with string values', () => {

    const schema = EnumSchema.create('A', 'B', 'C')

    it('validates an input that matches one of the defined string values.', () => {
      const inputs = ['A', 'B', 'C']
      inputs.forEach((input) => {
        const result = schema.validate(input)
        expect(result).toBe(input)
      })
    })

    it('throws when the input does not match any of the defined string values.', () => {
      expectSchema(schema, 'D').toThrow('The value must be one of "A", "B", "C".')
    })

    it('throws when the input is not a valid string.', () => {
      DataTypeGenerator.skip('strings').forEach((value) => {
        expectSchema(schema, value).toThrow('The value must be one of "A", "B", "C".')
      })
    })

  })

  describe('with number values', () => {

    const schema = EnumSchema.create(-100, 0, 100)

    it('validates an input that matches one of the defined number values.', () => {
      const inputs = [-100, 0, 100]
      inputs.forEach((input) => {
        const result = schema.validate(input)
        expect(result).toBe(input)
      })
    })

    it('throws when the input does not match any of the defined number values.', () => {
      expectSchema(schema, 255).toThrow('The value must be one of -100, 0, 100.')
    })

    it('throws when the input is not a valid number.', () => {
      DataTypeGenerator.skip('numbers').forEach((value) => {
        expectSchema(schema, value).toThrow('The value must be one of -100, 0, 100.')
      })
    })

  })
})
