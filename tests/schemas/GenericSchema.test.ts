// IMPORTS
import { describe, expect, it } from 'vitest'
import { GenericSchema } from '@/schemas/GenericSchema'
import { ObjectSchema } from '@/schemas/ObjectSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'

// METHOD
describe('.isValid()', () => {

  const schema = ObjectSchema.create({
    string: StringSchema.create(),
    number: NumberSchema.create(),
    boolean: BooleanSchema.create(),
  })

  it('returns `false` when `input` does not match the schema.', () => {
    DataTypeGenerator.skip('objects').forEach((value) => {
      const result = GenericSchema.isValid(schema, value)
      expect(result).toBe(false)
    })
  })

  it('returns `true` when `input` matches the schema.', () => {
    const result = GenericSchema.isValid(schema, {
      string: 'STRING',
      number: 123,
      boolean: true,
    })
    expect(result).toBe(true)
  })

})
