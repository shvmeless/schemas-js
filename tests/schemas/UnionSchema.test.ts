// IMPORTS
import { describe, expect, it } from 'vitest'
import { UnionSchema } from '@/schemas/UnionSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(...inner)', () => {

  const schema = UnionSchema.create(
    StringSchema.create(),
    NumberSchema.create(),
    BooleanSchema.create(),
  )

  it('returns when `input` matches any of the `inner` schemas.', () => {
    const inputs = ['STRING', 25, true]
    inputs.forEach((input) => {
      const result = schema.validate(input)
      expect(result).toBe(input)
    })
  })

  it('throws when `input` does not match any of the `inner` schemas.', () => {
    DataTypeGenerator.skip('strings', 'numbers', 'booleans').forEach((value) => {
      expectSchema(schema, value).toThrow('The value does not match any of the given schemas.')
    })
  })

})
