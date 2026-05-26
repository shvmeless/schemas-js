// IMPORTS
import { describe, expect, it } from 'vitest'
import { ObjectSchema } from '@/schemas/ObjectSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create(shape)', () => {

  const schema = ObjectSchema.create({
    string: StringSchema.create(),
    number: NumberSchema.create(),
    boolean: BooleanSchema.create(),
  })

  it('throws when `input` is not an object.', () => {
    DataTypeGenerator.skip('objects').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be an object.')
    })
  })

  it('returns when `input` matches the `shape` schema.', () => {
    const result = schema.validate({ string: 'STRING', number: 74105280, boolean: true })
    expect(result).toEqual({ string: 'STRING', number: 74105280, boolean: true })
  })

  it('throws when `input` contains fewer properties than expected.', () => {
    expectSchema(schema, { string: 'STRING' }).toThrow('The object is missing one or more required properties.', [
      ['number', {
        value: undefined,
        message: 'The value must be a number.',
      }],
      ['boolean', {
        value: undefined,
        message: 'The value must be a boolean.',
      }],
    ])
  })

  it('throws when `input` contains more properties than expected.', () => {
    expectSchema(schema, { string: 'STRING', number: 74105280, boolean: true, unexpected: 'UNEXPECTED' }).toThrow('The object contains one or more unexpected properties.', [
      ['unexpected', {
        value: 'UNEXPECTED',
        message: 'Unexpected property.',
      }],
    ])
  })

  it('returns a new object.', () => {
    const input = { string: 'STRING', number: 74105280, boolean: true }
    const result = schema.validate(input)
    expect(result).not.toBe(input)
    expect(result).toEqual(input)
  })

})

// METHOD
describe('.strip()', () => {

  const base = ObjectSchema.create({
    string: StringSchema.create(),
    number: NumberSchema.create(),
    boolean: BooleanSchema.create(),
  })

  const schema = base.strip()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(ObjectSchema)
    expect(schema).not.toBe(base)
  })

  it('throws when `input` is not an object.', () => {
    DataTypeGenerator.skip('objects').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be an object.')
    })
  })

  it('returns when `input` matches the `shape` schema.', () => {
    const result = schema.validate({ string: 'STRING', number: 74105280, boolean: true })
    expect(result).toEqual({ string: 'STRING', number: 74105280, boolean: true })
  })

  it('throws when `input` contains fewer properties than expected.', () => {
    expectSchema(schema, { string: 'STRING' }).toThrow('The object is missing one or more required properties.', [
      ['number', {
        value: undefined,
        message: 'The value must be a number.',
      }],
      ['boolean', {
        value: undefined,
        message: 'The value must be a boolean.',
      }],
    ])
  })

  it('strips when `input` contains unexpected properties.', () => {
    const result = schema.validate({ string: 'STRING', number: 74105280, boolean: true, unexpected: 'UNEXPECTED' })
    expect(result).toEqual({ string: 'STRING', number: 74105280, boolean: true })
  })

  it('returns a new object.', () => {
    const input = { string: 'STRING', number: 74105280, boolean: true }
    const result = schema.validate(input)
    expect(result).not.toBe(input)
    expect(result).toEqual(input)
  })

})
