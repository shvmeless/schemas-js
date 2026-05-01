// IMPORTS
import { describe, expect, it } from 'vitest'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = BooleanSchema.create()

  it('validates an input that is a boolean.', () => {
    const r1 = schema.validate(true)
    expect(r1).toBe(true)
    const r2 = schema.validate(false)
    expect(r2).toBe(false)
  })

  it('throws when the input is not a boolean.', () => {
    DataTypeGenerator.skip('booleans').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a boolean.')
    })
  })

})
