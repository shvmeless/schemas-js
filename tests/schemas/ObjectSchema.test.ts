// IMPORTS
import { describe, it, expect } from 'vitest'
import type { GenericSchemaLike } from '@/lib/GenericSchema'
import { ObjectSchema } from '@/schemas/ObjectSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(shape)', () => {

  const schema = ObjectSchema.create({
    string: StringSchema.create(),
    number: NumberSchema.create(),
    boolean: BooleanSchema.create(),
  })

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(ObjectSchema)
  })

  it('does not keep a reference to the given `shape`.', () => {
    const shape: Record<string, GenericSchemaLike> = {
      string: StringSchema.create(),
    }

    const copy = ObjectSchema.create(shape)

    shape['string'] = NumberSchema.create()
    shape['number'] = NumberSchema.create()

    expectValidation(copy, { string: 'STRING' }).toReturn({ string: 'STRING' })
    expectValidation(copy, { string: 123 }).toThrow('At least one property does not match the given schema.', [
      ['string', {
        value: 123,
        message: 'The value must be a string.',
      }],
    ])
    expectValidation(copy, { string: 'STRING', number: 123 }).toThrow('The object contains one or more unexpected properties.', [
      ['number', {
        value: 123,
        message: 'Unexpected property.',
      }],
    ])
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = ObjectSchema.create({
    string: StringSchema.create(),
    number: NumberSchema.create(),
    boolean: BooleanSchema.create(),
  })

  it('throws when `input` is not an object.', () => {
    DataTypeGenerator.skip('objects').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an object.')
    })
  })

  it('returns when `input` matches the `shape` schema.', () => {
    const input = { string: 'STRING', number: 74105280, boolean: true }
    const expected = { string: 'STRING', number: 74105280, boolean: true }
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `input` contains fewer properties than expected.', () => {
    const input = { string: 'STRING' }
    expectValidation(schema, input).toThrow('The object is missing one or more required properties.', [
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
    const input = { string: 'STRING', number: 74105280, boolean: true, unexpected: 'UNEXPECTED' }
    expectValidation(schema, input).toThrow('The object contains one or more unexpected properties.', [
      ['unexpected', {
        value: 'UNEXPECTED',
        message: 'Unexpected property.',
      }],
    ])
  })

  it('compares the `shape` keys with the `input` keys instead of their amounts.', () => {
    const input = { string: 'STRING', boolean: true, unexpected: 'UNEXPECTED' }
    expectValidation(schema, input).toThrow('The object is missing one or more required properties.', [
      ['number', {
        value: undefined,
        message: 'The value must be a number.',
      }],
      ['unexpected', {
        value: 'UNEXPECTED',
        message: 'Unexpected property.',
      }],
    ])
  })

  it('does not report missing optional properties as required.', () => {
    const optional = ObjectSchema.create({
      string: StringSchema.create(),
      number: NumberSchema.create().optional(),
    })
    const input = { string: 123 }
    expectValidation(optional, input).toThrow('At least one property does not match the given schema.', [
      ['string', {
        value: 123,
        message: 'The value must be a string.',
      }],
    ])
  })

  it('does not treat inherited properties of `input` as part of the `shape`.', () => {
    const input = { string: 'STRING', number: 74105280, boolean: true, toString: 'UNEXPECTED' }
    expectValidation(schema, input).toThrow('The object contains one or more unexpected properties.', [
      ['toString', {
        value: 'UNEXPECTED',
        message: 'Unexpected property.',
      }],
    ])
  })

  it('does not read inherited properties from `input`.', () => {
    const inherited = ObjectSchema.create({ toString: StringSchema.create() })
    expectValidation(inherited, {}).toThrow('The object is missing one or more required properties.', [
      ['toString', {
        value: undefined,
        message: 'The value must be a string.',
      }],
    ])
  })

  it('does not pollute the prototype with `__proto__` keys.', () => {
    const protoSchema = ObjectSchema.create({ ['__proto__']: StringSchema.create() })
    const input = JSON.parse('{"__proto__":"value"}') as { __proto__: string }
    const result = protoSchema.validate(input)

    expect(Object.keys(result)).toEqual(['__proto__'])
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
    expect(Object.hasOwn(result, '__proto__')).toBe(true)
    expect(protoSchema.validate(result)).toEqual(result)
  })
})

// METHOD ---------------------------------------------------------------------
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
      expectValidation(schema, value).toThrow('The value must be an object.')
    })
  })

  it('returns when `input` matches the `shape` schema.', () => {
    const input = { string: 'STRING', number: 74105280, boolean: true }
    const expected = { string: 'STRING', number: 74105280, boolean: true }
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `input` contains fewer properties than expected.', () => {
    const input = { string: 'STRING' }
    expectValidation(schema, input).toThrow('The object is missing one or more required properties.', [
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
    const input = { string: 'STRING', number: 74105280, boolean: true, unexpected: 'UNEXPECTED' }
    const expected = { string: 'STRING', number: 74105280, boolean: true }
    expectValidation(schema, input).toReturnNew(expected)
  })
})

