// IMPORTS
import { describe, it } from 'vitest'
import { UnionSchema } from '@/schemas/UnionSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(...inner)', () => {

  const schema = UnionSchema.create(
    StringSchema.create(),
    NumberSchema.create(),
    BooleanSchema.create(),
  )

  it('returns when `input` matches any of the `inner` schemas.', () => {
    expectSchema(schema, 'STRING').toReturn('STRING')
    expectSchema(schema, 'TEXT').toReturn('TEXT')
    expectSchema(schema, -250).toReturn(-250)
    expectSchema(schema, 250).toReturn(250)
    expectSchema(schema, true).toReturn(true)
    expectSchema(schema, false).toReturn(false)
  })

  it('throws when `input` does not match any of the `inner` schemas.', () => {
    DataTypeGenerator.skip('strings', 'numbers', 'booleans').forEach((value) => {
      expectSchema(schema, value).toThrow('The value does not match any of the given schemas.')
    })
  })
})
