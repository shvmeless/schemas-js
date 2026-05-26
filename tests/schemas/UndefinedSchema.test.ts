// IMPORTS
import { describe, it } from 'vitest'
import { UndefinedSchema } from '@/schemas/UndefinedSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = UndefinedSchema.create()

  it('returns when `input` is `undefined`.', () => {
    expectSchema(schema, undefined).toReturn(undefined)
  })

  it('throws when `input` is not `undefined`.', () => {
    DataTypeGenerator.skip('undefined').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be undefined.')
    })
  })

})
