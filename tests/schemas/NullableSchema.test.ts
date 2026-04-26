// IMPORTS
import { describe, expect, it } from 'vitest'
import { NullableSchema } from '@/schemas/NullableSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = NullableSchema.create(StringSchema.create())

  it('validates an input that matches the given schema.', () => {
    const result = schema.validate('STRING')
    expect(result).toBe('STRING')
  })

  it('validates a null input.', () => {
    const result = schema.validate(null)
    expect(result).toBeNull()
  })

  it('throws when the value does not match the given schema.', () => {
    DataTypeGenerator.skip('strings', 'null').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a string.')
    })
  })

})
