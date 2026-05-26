// IMPORTS
import { describe, expect, it } from 'vitest'
import { UnknownSchema } from '@/schemas/UnknownSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = UnknownSchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(UnknownSchema)
  })
})

// METHOD
describe('.validate(input)', () => {

  const schema = UnknownSchema.create()

  it('returns any `input` as `unknown`.', () => {
    DataTypeGenerator.forEach((value) => {
      expectSchema(schema, value).toReturn(value)
    })
  })
})
