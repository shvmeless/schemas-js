// IMPORTS
import { describe, expect, it } from 'vitest'
import { UnknownSchema } from '@/schemas/UnknownSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'

// METHOD
describe('.create()', () => {

  const schema = UnknownSchema.create()

  it('validate any `input` value as `unknown`.', () => {
    DataTypeGenerator.forEach((value) => {
      const result = schema.validate(value)
      expect(result).toBe(value)
    })
  })

})
