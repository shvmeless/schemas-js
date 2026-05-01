// IMPORTS
import { describe, expect, it } from 'vitest'
import { InstanceOfSchema } from '@/schemas/InstanceOfSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = InstanceOfSchema.create(Date)

  it('validates an input that is an instance of the provided constructor.', () => {
    const result = schema.validate(new Date())
    expect(result).toBeInstanceOf(Date)
  })

  it('throws when the input is not an instance.', () => {
    DataTypeGenerator.skip('classes').forEach((value) => {
      expectSchema(schema, value).toThrow('Expected instance of Date.')
    })
  })

  it('throws when the input is not an instance of the provided constructor.', () => {
    expectSchema(schema, new Map()).toThrow('Expected instance of Date.')
  })

})
