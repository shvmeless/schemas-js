// IMPORTS
import { describe, it } from 'vitest'
import { InstanceOfSchema } from '@/schemas/InstanceOfSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(constructor)', () => {

  const schema = InstanceOfSchema.create(Date)

  it('throws when `input` is not a class instance.', () => {
    DataTypeGenerator.skip('classes').forEach((value) => {
      expectSchema(schema, value).toThrow('Expected instance of Date.')
    })
  })

  it('returns when `input` is a instance of the `constructor`.', () => {
    expectSchema(schema, new Date()).toReturnInstanceOf(Date)
    expectSchema(schema, new Date('1993-06-26')).toReturnInstanceOf(Date)
    expectSchema(schema, new Date(741052800000)).toReturnInstanceOf(Date)
  })

  it('throws when `input` is not an instance of the `constructor`.', () => {
    expectSchema(schema, new Map()).toThrow('Expected instance of Date.')
    expectSchema(schema, new Set()).toThrow('Expected instance of Date.')
    expectSchema(schema, new ArrayBuffer()).toThrow('Expected instance of Date.')
  })
})
