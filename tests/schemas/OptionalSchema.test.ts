// IMPORTS
import { describe, expect, it } from 'vitest'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = OptionalSchema.create(StringSchema.create())

  it('validates an input that matches the given schema.', () => {
    const result = schema.validate('STRING')
    expect(result).toBe('STRING')
  })

  it('validates an undefined input.', () => {
    const result = schema.validate(undefined)
    expect(result).toBeUndefined()
  })

  it('throws when the value does not match the given schema.', () => {
    DataTypeGenerator.skip('strings', 'undefined').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a string.')
    })
  })

})
