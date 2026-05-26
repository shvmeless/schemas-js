// IMPORTS
import { describe, it } from 'vitest'
import { TransformSchema } from '@/schemas/TransformSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(inner, transform)', () => {

  const schema = TransformSchema.create(StringSchema.create(), (value) => (value.length))

  it('transforms when `input` matches the `inner` schema.', () => {
    expectSchema(schema, 'STRING').toReturn(6)
    expectSchema(schema, 'TEXT').toReturn(4)
    expectSchema(schema, 'EXAMPLE').toReturn(7)
  })

  it('throws when `input` does not match the `inner` schema.', () => {
    DataTypeGenerator.skip('strings').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a string.')
    })
  })

})
