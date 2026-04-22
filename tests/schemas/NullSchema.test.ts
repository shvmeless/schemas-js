// IMPORTS
import { describe, expect, it } from 'vitest'
import { NullSchema } from '@/schemas/NullSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = NullSchema.create()

  it('validates an input that is null.', () => {
    const result = schema.validate(null)
    expect(result).toBe(null)
  })

  it('throws when the input is not null.', () => {
    DataTypeGenerator.skip('null').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be null.')
    })
  })

})
