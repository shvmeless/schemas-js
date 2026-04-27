// IMPORTS
import { describe, expect, it } from 'vitest'
import { ObjectSchema } from '@/schemas/ObjectSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = ObjectSchema.create({
    string: StringSchema.create(),
    number: NumberSchema.create(),
    boolean: BooleanSchema.create(),
  })

  it('validates that each property matches its corresponding schema.', () => {
    const result = schema.validate({ string: 'STRING', number: 74105280, boolean: true })
    expect(result).toEqual({ string: 'STRING', number: 74105280, boolean: true })
  })

  it('throws when the input is not an object.', () => {
    DataTypeGenerator.skip('objects').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be an object.')
    })
  })

  it('throws when the input contains fewer properties than expected.', () => {
    expectSchema(schema, { string: 'STRING' }).toThrow('The object is missing one or more required properties.', {
      number: 'The value must be a number.',
      boolean: 'The value must be a boolean.',
    })
  })

  it('throws when the input contains more properties than expected.', () => {
    expectSchema(schema, { string: 'STRING', number: 74105280, boolean: true, unexpected: 'UNEXPECTED' }).toThrow('The object contains one or more unexpected properties.', {
      unexpected: 'Unexpected property.',
    })
  })

})

// METHOD
describe('.skip()', () => {

  const schema = ObjectSchema.create({
    string: StringSchema.create(),
    number: NumberSchema.create(),
    boolean: BooleanSchema.create(),
  }).strip()

  it('validates that each property matches its corresponding schema.', () => {
    const result = schema.validate({ string: 'STRING', number: 74105280, boolean: true })
    expect(result).toEqual({ string: 'STRING', number: 74105280, boolean: true })
  })

  it('throws when the input is not an object.', () => {
    DataTypeGenerator.skip('objects').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be an object.')
    })
  })

  it('throws when the input contains fewer properties than expected.', () => {
    expectSchema(schema, { string: 'STRING' }).toThrow('The object is missing one or more required properties.', {
      number: 'The value must be a number.',
      boolean: 'The value must be a boolean.',
    })
  })

  it('strips unexpected properties from the input.', () => {
    const result = schema.validate({ string: 'STRING', number: 74105280, boolean: true, unexpected: 'UNEXPECTED' })
    expect(result).toEqual({ string: 'STRING', number: 74105280, boolean: true })
  })

})
