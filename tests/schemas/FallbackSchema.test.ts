// IMPORTS
import { describe, expect, it } from 'vitest'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'

// METHOD
describe('.create()', () => {

  const schema = FallbackSchema.create(StringSchema.create(), 'DEFAULT')

  it('validates an input that matches the given schema.', () => {
    const result = schema.validate('STRING')
    expect(result).toBe('STRING')
  })

  it('returns the fallback value when the input does not match the given schema.', () => {
    DataTypeGenerator.skip('strings').forEach((value) => {
      const result = schema.validate(value)
      expect(result).toBe('DEFAULT')
    })
  })

})
