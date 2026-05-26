// IMPORTS
import { describe, expect, it } from 'vitest'
import { NullSchema } from '@/schemas/NullSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = NullSchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NullSchema)
  })
})

// METHOD
describe('.validate(input)', () => {

  const schema = NullSchema.create()

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })

  it('throws when `input` is not `null`.', () => {
    DataTypeGenerator.skip('null').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be null.')
    })
  })
})
