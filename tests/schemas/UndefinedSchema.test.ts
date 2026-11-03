// IMPORTS
import { describe, it, expect } from 'vitest'
import { UndefinedSchema } from '@/schemas/UndefinedSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create()', () => {

  const schema = UndefinedSchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(UndefinedSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = UndefinedSchema.create()

  it('returns when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(undefined)
  })

  it('throws when `input` is not `undefined`.', () => {
    DataTypeGenerator.skip('undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be undefined.')
    })
  })
})
