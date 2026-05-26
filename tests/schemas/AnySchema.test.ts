/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// IMPORTS
import { describe, expect, it } from 'vitest'
import { AnySchema } from '@/schemas/AnySchema'
import { DataTypeGenerator } from '@tests/helpers/generator'

// METHOD
describe('.create()', () => {

  const schema = AnySchema.create()

  it('returns any `input` as `any`.', () => {
    DataTypeGenerator.forEach((value) => {
      const result = schema.validate(value)
      expect(result).toBe(value)
    })
  })

})
