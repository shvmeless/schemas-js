// IMPORTS
import { describe, expect, it } from 'vitest'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'

// METHOD
describe('.create(inner, fallback)', () => {

  const schema = FallbackSchema.create(StringSchema.create(), 'DEFAULT')

  it('returns `fallback` value when `input` does not match the `inner` schema.', () => {
    DataTypeGenerator.skip('strings').forEach((value) => {
      const result = schema.validate(value)
      expect(result).toBe('DEFAULT')
    })
  })

  it('returns when `input` matches the `inner` schema.', () => {
    const result = schema.validate('STRING')
    expect(result).toBe('STRING')
  })

})
