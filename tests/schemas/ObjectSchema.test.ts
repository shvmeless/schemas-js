// IMPORTS
import { describe, it, expect } from 'vitest'
import { ObjectSchema } from '@/schemas/ObjectSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'
import type { GenericSchema } from '@/lib/GenericSchema'

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shape: Record<string, GenericSchema<any, boolean, boolean, boolean>> = {
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
describe('.merge(...schemas)', () => {

  const base = ObjectSchema.create({
    string: StringSchema.create(),
    number: NumberSchema.create(),
  })

  it('returns an instance of the schema.', () => {
    expect(ObjectSchema.merge(base)).toBeInstanceOf(ObjectSchema)
  })

  it('merges an indefinite amount of `shape` schemas.', () => {
    const schema = ObjectSchema.merge(
      base,
      ObjectSchema.create({ boolean: BooleanSchema.create() }),
      ObjectSchema.create({ optional: StringSchema.create().optional() }),
    )
    expectValidation(schema, { string: 'STRING', number: 74105280, boolean: true }).toReturn({
      string: 'STRING',
      number: 74105280,
      boolean: true,
    })
  })

  it('gives precedence to the last schema when keys collide.', () => {
    const schema = ObjectSchema.merge(
      ObjectSchema.create({ value: StringSchema.create() }),
      ObjectSchema.create({ value: NumberSchema.create() }),
      ObjectSchema.create({ value: BooleanSchema.create() }),
    )
    expectValidation(schema, { value: true }).toReturn({ value: true })
    expectValidation(schema, { value: 74105280 }).toThrow('At least one property does not match the given schema.', [
      ['value', {
        value: 74105280,
        message: 'The value must be a boolean.',
      }],
    ])
  })

  it('does not keep a reference to the given `shape` schemas.', () => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shape: Record<string, GenericSchema<any, boolean, boolean, boolean>> = {
      string: StringSchema.create(),
    }

    const schema = ObjectSchema.merge(ObjectSchema.create(shape))

    shape['string'] = NumberSchema.create()

    expectValidation(schema, { string: 'STRING' }).toReturn({ string: 'STRING' })
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

  it('does not include `undefined` properties in the result.', () => {
    const optional = ObjectSchema.create({
      string: StringSchema.create(),
      number: NumberSchema.create().optional(),
    })

    const absent = optional.validate({ string: 'STRING' })
    expect(absent).toEqual({ string: 'STRING' })
    expect(Object.hasOwn(absent as object, 'number')).toBe(false)

    const explicit = optional.validate({ string: 'STRING', number: undefined })
    expect(explicit).toEqual({ string: 'STRING' })
    expect(Object.hasOwn(explicit as object, 'number')).toBe(false)
  })

  it('keeps the `default` value of absent optional properties.', () => {
    const defaulted = ObjectSchema.create({
      string: StringSchema.create(),
      number: NumberSchema.create().optional().default(74105280),
    })
    expectValidation(defaulted, { string: 'STRING' }).toReturn({ string: 'STRING', number: 74105280 })
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
