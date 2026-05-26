// IMPORTS
import { describe, expect, it } from 'vitest'
import { NullableSchema } from '@/schemas/NullableSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(inner)', () => {

  const schema = NullableSchema.create(StringSchema.create())

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NullableSchema)
  })
})

// METHOD
describe('.validate(input)', () => {

  const schema = NullableSchema.create(StringSchema.create())

  it('returns when `input` matches the `inner` schema.', () => {
    expectSchema(schema, 'STRING').toReturn('STRING')
  })

  it('returns when `input` is `null`.', () => {
    expectSchema(schema, null).toReturn(null)
  })

  it('throws when `input` does not match the `inner` schema.', () => {
    DataTypeGenerator.skip('strings', 'null').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a string.')
    })
  })

})

// METHOD
describe('.default(default)', () => {

  const schema = NullableSchema.create(StringSchema.create()).default('DEFAULT')

  it('returns when the `input` matches the `inner` schema.', () => {
    expectSchema(schema, 'STRING').toReturn('STRING')
  })

  it('returns `default` value when `input` is `null`.', () => {
    expectSchema(schema, null).toReturn('DEFAULT')
  })

  it('throws when `input` does not match the `inner` schema.', () => {
    DataTypeGenerator.skip('strings', 'null').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be a string.')
    })
  })

})
