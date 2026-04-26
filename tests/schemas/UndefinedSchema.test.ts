// IMPORTS
import { describe, expect, it } from 'vitest'
import { UndefinedSchema } from '@/schemas/UndefinedSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = UndefinedSchema.create()

  it('validates an input that is undefined.', () => {
    const result = schema.validate(undefined)
    expect(result).toBe(undefined)
  })

  it('throws when the input is not undefined.', () => {
    DataTypeGenerator.skip('undefined').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be undefined.')
    })
  })

})
