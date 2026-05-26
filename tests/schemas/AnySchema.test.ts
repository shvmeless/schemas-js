// IMPORTS
import { describe, it } from 'vitest'
import { AnySchema } from '@/schemas/AnySchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = AnySchema.create()

  it('returns any `input` as `any`.', () => {
    DataTypeGenerator.forEach((value) => {
      expectSchema(schema, value).toReturn(value)
    })
  })

})
