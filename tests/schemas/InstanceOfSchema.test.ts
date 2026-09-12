// IMPORTS
import { describe, it, expect } from 'vitest'
import { InstanceOfSchema } from '@/schemas/InstanceOfSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(constructor)', () => {

  const schema = InstanceOfSchema.create(Date)

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(InstanceOfSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = InstanceOfSchema.create(Date)

  it('throws when `input` is not a class instance.', () => {
    DataTypeGenerator.skip('classes').forEach((value) => {
      expectValidation(schema, value).toThrow('Expected instance of Date.')
    })
  })

  it('returns when `input` is an instance of the `constructor`.', () => {
    expectValidation(schema, new Date()).toReturnInstanceOf(Date)
    expectValidation(schema, new Date('1993-06-26')).toReturnInstanceOf(Date)
    expectValidation(schema, new Date(741052800000)).toReturnInstanceOf(Date)
  })

  it('throws when `input` is not an instance of the `constructor`.', () => {
    expectValidation(schema, new Map()).toThrow('Expected instance of Date.')
    expectValidation(schema, new Set()).toThrow('Expected instance of Date.')
    expectValidation(schema, new ArrayBuffer()).toThrow('Expected instance of Date.')
  })

  it('returns the same `input` instance.', () => {
    const input = new Date()
    expectValidation(schema, input).toReturnSame(input)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.optional()', () => {

  const base = InstanceOfSchema.create(Date)
  const schema = base.optional()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(InstanceOfSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is an instance of the `constructor`.', () => {
    expectValidation(schema, new Date()).toReturnInstanceOf(Date)
  })

  it('returns when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(undefined)
  })

  it('throws when `input` is not an instance of the `constructor`.', () => {
    DataTypeGenerator.skip('classes', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('Expected instance of Date.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.nullable()', () => {

  const base = InstanceOfSchema.create(Date)
  const schema = base.nullable()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(InstanceOfSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is an instance of the `constructor`.', () => {
    expectValidation(schema, new Date()).toReturnInstanceOf(Date)
  })

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })

  it('throws when `input` is not an instance of the `constructor`.', () => {
    DataTypeGenerator.skip('classes', 'null').forEach((value) => {
      expectValidation(schema, value).toThrow('Expected instance of Date.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.default(value)', () => {

  const base = InstanceOfSchema.create(Date).optional()
  const schema = base.default(new Date('1993-06-26'))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(InstanceOfSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is an instance of the `constructor`.', () => {
    expectValidation(schema, new Date()).toReturnInstanceOf(Date)
  })

  it('returns the `default` value when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(new Date('1993-06-26'))
  })

  it('returns the `default` value when `input` is `null` and the schema is nullable.', () => {
    expectValidation(schema.nullable(), null).toReturn(new Date('1993-06-26'))
  })

  it('throws when `input` is not an instance of the `constructor`.', () => {
    DataTypeGenerator.skip('classes', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('Expected instance of Date.')
    })
  })
})
