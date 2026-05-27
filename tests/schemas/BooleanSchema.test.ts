// IMPORTS
import { describe, it, expect } from 'vitest'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create()', () => {

  const schema = BooleanSchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(BooleanSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = BooleanSchema.create()

  it('returns when `input` is a boolean.', () => {
    expectValidation(schema, true).toReturn(true)
    expectValidation(schema, false).toReturn(false)
  })

  it('throws when `input` is not a boolean.', () => {
    DataTypeGenerator.skip('booleans').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a boolean.')
    })
  })
})
