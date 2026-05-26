// IMPORTS
import { describe, it } from 'vitest'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(inner, fallback)', () => {

  const schema = FallbackSchema.create(StringSchema.create(), 'DEFAULT')

  it('returns `fallback` value when `input` does not match the `inner` schema.', () => {
    DataTypeGenerator.skip('strings').forEach((value) => {
      expectSchema(schema, value).toReturn('DEFAULT')
    })
  })

  it('returns when `input` matches the `inner` schema.', () => {
    expectSchema(schema, 'string').toReturn('string')
    expectSchema(schema, 'text').toReturn('text')
    expectSchema(schema, 'example').toReturn('example')
  })
})
