// IMPORTS
import { describe, it } from 'vitest'
import { UnknownSchema } from '@/schemas/UnknownSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = UnknownSchema.create()

  it('validate any `input` value as `unknown`.', () => {
    DataTypeGenerator.forEach((value) => {
      expectSchema(schema, value).toReturn(value)
    })
  })
})
