// IMPORTS
import { describe, expect, it } from 'vitest'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = StringSchema.create()

  it('validates an input that is a string.', () => {
    const result = schema.validate('string')
    expect(result).toBe('string')
  })

  it('validates an input that is an empty string.', () => {
    const result = schema.validate('')
    expect(result).toBe('')
  })

  it('throws when the input is not a string.', () => {
    DataTypeGenerator.skip('strings').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a string.')
    })
  })

})
