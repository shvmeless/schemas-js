// IMPORTS
import { describe, expect, it } from 'vitest'
import { AnySchema } from '@/schemas/AnySchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = AnySchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(AnySchema)
  })
})

// METHOD
describe('.validate(input)', () => {

  const schema = AnySchema.create()

  it('returns any `input` as `any`.', () => {
    DataTypeGenerator.forEach((value) => {
      expectValidation(schema, value).toReturn(value)
    })
  })
})
