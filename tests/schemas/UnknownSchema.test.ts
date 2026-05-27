// IMPORTS
import { describe, it, expect } from 'vitest'
import { UnknownSchema } from '@/schemas/UnknownSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create()', () => {

  const schema = UnknownSchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(UnknownSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = UnknownSchema.create()

  it('returns any `input` as `unknown`.', () => {
    DataTypeGenerator.forEach((value) => {
      expectValidation(schema, value).toReturn(value)
    })
  })
})
