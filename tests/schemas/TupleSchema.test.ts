// IMPORTS
import { describe, it, expect } from 'vitest'
import { TupleSchema } from '@/schemas/TupleSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(shapes)', () => {

  const schema = TupleSchema.create([StringSchema.create(), NumberSchema.create(), BooleanSchema.create()])

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(TupleSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = TupleSchema.create([StringSchema.create(), NumberSchema.create(), BooleanSchema.create()])

  it('throws when `input` is not an array.', () => {
    DataTypeGenerator.skip('arrays').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an array.')
    })
  })

  it('returns when all `input` elements match the `shapes` schemas.', () => {
    const input = ['STRING', 74105280, true]
    const expected = ['STRING', 74105280, true]
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `input` contains fewer elements than expected.', () => {
    const input = ['STRING']
    expectValidation(schema, input).toThrow('The tuple is missing one or more required elements.', [
      [1, {
        value: undefined,
        message: 'The value must be a number.',
      }],
      [2, {
        value: undefined,
        message: 'The value must be a boolean.',
      }],
    ])
  })

  it('throws when `input` contains more elements than expected.', () => {
    const input = ['STRING', 74105280, true, 'UNEXPECTED']
    expectValidation(schema, input).toThrow('The tuple contains one or more unexpected elements.', [
      [3, {
        value: 'UNEXPECTED',
        message: 'Unexpected element.',
      }],
    ])
  })
})

// METHOD ---------------------------------------------------------------------
describe('.strip()', () => {

  const base = TupleSchema.create([StringSchema.create(), NumberSchema.create(), BooleanSchema.create()])
  const schema = base.strip()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(TupleSchema)
    expect(schema).not.toBe(base)
  })

  it('throws when `input` is not an array.', () => {
    DataTypeGenerator.skip('arrays').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an array.')
    })
  })

  it('returns when all `input` elements match the `shapes` schemas.', () => {
    const input = ['STRING', 74105280, true]
    const expected = ['STRING', 74105280, true]
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `input` contains fewer elements than expected.', () => {
    const input = ['STRING']
    expectValidation(schema, input).toThrow('The tuple is missing one or more required elements.', [
      [1, {
        value: undefined,
        message: 'The value must be a number.',
      }],
      [2, {
        value: undefined,
        message: 'The value must be a boolean.',
      }],
    ])
  })

  it('strips when `input` contains unexpected elements.', () => {
    const input = ['STRING', 74105280, true, 'UNEXPECTED']
    const expected = ['STRING', 74105280, true]
    expectValidation(schema, input).toReturnNew(expected)
  })
})
