// IMPORTS
import { describe, it, expect } from 'vitest'
import { InstanceOfSchema } from '@/schemas/InstanceOfSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(constructor)', () => {

  const schema = InstanceOfSchema.create(Date)

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(InstanceOfSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = InstanceOfSchema.create(Date)

  it('throws when `input` is not a class instance.', () => {
    DataTypeGenerator.skip('classes').forEach((value) => {
      expectValidation(schema, value).toThrow('Expected instance of Date.')
    })
  })

  it('returns when `input` is a instance of the `constructor`.', () => {
    expectValidation(schema, new Date()).toReturnInstanceOf(Date)
    expectValidation(schema, new Date('1993-06-26')).toReturnInstanceOf(Date)
    expectValidation(schema, new Date(741052800000)).toReturnInstanceOf(Date)
  })

  it('throws when `input` is not an instance of the `constructor`.', () => {
    expectValidation(schema, new Map()).toThrow('Expected instance of Date.')
    expectValidation(schema, new Set()).toThrow('Expected instance of Date.')
    expectValidation(schema, new ArrayBuffer()).toThrow('Expected instance of Date.')
  })

  it('returns the same `input` instance.', () => {
    const input = new Date()
    expectValidation(schema, input).toReturnSame(input)
  })
})
