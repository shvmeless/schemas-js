// IMPORTS
import { describe, expect, it } from 'vitest'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = BooleanSchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(BooleanSchema)
  })
})

// METHOD
describe('.validate(input)', () => {

  const schema = BooleanSchema.create()

  it('returns when `input` is a boolean.', () => {
    expectSchema(schema, true).toReturn(true)
    expectSchema(schema, false).toReturn(false)
  })

  it('throws when `input` is not a boolean.', () => {
    DataTypeGenerator.skip('booleans').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a boolean.')
    })
  })

})
