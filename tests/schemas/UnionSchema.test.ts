// IMPORTS
import { describe, it, expect } from 'vitest'
import { UnionSchema } from '@/schemas/UnionSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation, expectError } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(...inner)', () => {

  it('throws when no `inner` schemas are provided.', () => {
    expectError(() => {
      UnionSchema.create()
    }).toHaveMessage('Must provide at least two schemas.')
  })

  it('throws when only one `inner` schema is provided.', () => {
    expectError(() => {
      UnionSchema.create(StringSchema.create())
    }).toHaveMessage('Must provide at least two schemas.')
  })

  const schema = UnionSchema.create(
    StringSchema.create(),
    NumberSchema.create(),
    BooleanSchema.create(),
  )

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(UnionSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = UnionSchema.create(
    StringSchema.create(),
    NumberSchema.create(),
    BooleanSchema.create(),
  )

  it('returns when `input` matches any of the `inner` schemas.', () => {
    expectValidation(schema, 'STRING').toReturn('STRING')
    expectValidation(schema, 'TEXT').toReturn('TEXT')
    expectValidation(schema, -250).toReturn(-250)
    expectValidation(schema, 250).toReturn(250)
    expectValidation(schema, true).toReturn(true)
    expectValidation(schema, false).toReturn(false)
  })

  it('throws when `input` does not match any of the `inner` schemas.', () => {
    DataTypeGenerator.skip('strings', 'numbers', 'booleans').forEach((value) => {
      expectValidation(schema, value).toThrow('The value does not match any of the given schemas.')
    })
  })
})
