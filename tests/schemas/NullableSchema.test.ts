// IMPORTS
import { describe, expect, it } from 'vitest'
import { NullableSchema } from '@/schemas/NullableSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(inner)', () => {

  const schema = NullableSchema.create(StringSchema.create())

  it('returns when `input` matches the `inner` schema.', () => {
    const result = schema.validate('STRING')
    expect(result).toBe('STRING')
  })

  it('returns when `input` is `null`.', () => {
    const result = schema.validate(null)
    expect(result).toBeNull()
  })

  it('throws when `input` does not match the `inner` schema.', () => {
    DataTypeGenerator.skip('strings', 'null').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a string.')
    })
  })

})

// METHOD
describe('.default(default)', () => {

  const schema = NullableSchema.create(StringSchema.create()).default('DEFAULT')

  it('returns when the `input` matches the `inner` schema.', () => {
    const result = schema.validate('STRING')
    expect(result).toBe('STRING')
  })

  it('returns `default` value when `input` is `null`.', () => {
    const result = schema.validate(null)
    expect(result).toBe('DEFAULT')
  })

  it('throws when `input` does not match the `inner` schema.', () => {
    DataTypeGenerator.skip('strings', 'null').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a string.')
    })
  })

})
