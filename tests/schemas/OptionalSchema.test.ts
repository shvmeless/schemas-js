// IMPORTS
import { describe, expect, it } from 'vitest'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(inner)', () => {

  const schema = OptionalSchema.create(StringSchema.create())

  it('returns when `input` matches the `inner` schema.', () => {
    const result = schema.validate('STRING')
    expect(result).toBe('STRING')
  })

  it('returns when `input` is `undefined`.', () => {
    const result = schema.validate(undefined)
    expect(result).toBeUndefined()
  })

  it('throws when `input` does not match the `inner` schema.', () => {
    DataTypeGenerator.skip('strings', 'undefined').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a string.')
    })
  })

})

// METHOD
describe('.default(default)', () => {

  const schema = OptionalSchema.create(StringSchema.create()).default('DEFAULT')

  it('returns when the `input` matches the `inner` schema.', () => {
    const result = schema.validate('STRING')
    expect(result).toBe('STRING')
  })

  it('returns `default` value when `input` is `undefined`.', () => {
    const result = schema.validate(undefined)
    expect(result).toBe('DEFAULT')
  })

  it('throws when `input` does not match the `inner` schema.', () => {
    DataTypeGenerator.skip('strings', 'undefined').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a string.')
    })
  })

})
