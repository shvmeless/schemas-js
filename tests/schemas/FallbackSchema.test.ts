// IMPORTS
import { describe, expect, it } from 'vitest'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD
describe('.create(inner, fallback)', () => {

  const schema = FallbackSchema.create(StringSchema.create(), 'DEFAULT')

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(FallbackSchema)
  })
})

// METHOD
describe('.validate(input)', () => {

  const schema = FallbackSchema.create(StringSchema.create(), 'DEFAULT')

  it('returns `fallback` value when `input` does not match the `inner` schema.', () => {
    DataTypeGenerator.skip('strings').forEach((value) => {
      expectValidation(schema, value).toReturn('DEFAULT')
    })
  })

  it('returns when `input` matches the `inner` schema.', () => {
    expectValidation(schema, 'string').toReturn('string')
    expectValidation(schema, 'text').toReturn('text')
    expectValidation(schema, 'example').toReturn('example')
  })
})
