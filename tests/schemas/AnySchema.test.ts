// IMPORTS
import { describe, it, expect } from 'vitest'
import { AnySchema } from '@/schemas/AnySchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create()', () => {

  const schema = AnySchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(AnySchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = AnySchema.create()

  it('returns any `input` as `any`.', () => {
    DataTypeGenerator.forEach((value) => {
      expectValidation(schema, value).toReturn(value)
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.optional()', () => {

  const base = AnySchema.create()
  const schema = base.optional()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(AnySchema)
    expect(schema).not.toBe(base)
  })

  it('returns any `input` as `any`.', () => {
    DataTypeGenerator.skip('undefined').forEach((value) => {
      expectValidation(schema, value).toReturn(value)
    })
  })

  it('returns when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(undefined)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.nullable()', () => {

  const base = AnySchema.create()
  const schema = base.nullable()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(AnySchema)
    expect(schema).not.toBe(base)
  })

  it('returns any `input` as `any`.', () => {
    DataTypeGenerator.skip('null').forEach((value) => {
      expectValidation(schema, value).toReturn(value)
    })
  })

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })
})
