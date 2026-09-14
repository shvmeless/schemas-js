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

// METHOD ---------------------------------------------------------------------
describe('.optional()', () => {

  const base = TupleSchema.create([StringSchema.create(), NumberSchema.create(), BooleanSchema.create()])
  const schema = base.optional()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(TupleSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when all `input` elements match the `shapes` schemas.', () => {
    const input = ['STRING', 74105280, true]
    const expected = ['STRING', 74105280, true]
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('returns when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(undefined)
  })

  it('throws when `input` is not an array.', () => {
    DataTypeGenerator.skip('arrays', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an array.')
    })
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
})

// METHOD ---------------------------------------------------------------------
describe('.nullable()', () => {

  const base = TupleSchema.create([StringSchema.create(), NumberSchema.create(), BooleanSchema.create()])
  const schema = base.nullable()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(TupleSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when all `input` elements match the `shapes` schemas.', () => {
    const input = ['STRING', 74105280, true]
    const expected = ['STRING', 74105280, true]
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('returns when `input` is `null`.', () => {
    expectValidation(schema, null).toReturn(null)
  })

  it('throws when `input` is not an array.', () => {
    DataTypeGenerator.skip('arrays', 'null').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an array.')
    })
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
})

// METHOD ---------------------------------------------------------------------
describe('.default(value)', () => {

  const base = TupleSchema.create([StringSchema.create(), NumberSchema.create(), BooleanSchema.create()]).optional()
  const schema = base.default(['STRING', 74105280, true])

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(TupleSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when all `input` elements match the `shapes` schemas.', () => {
    const input = ['STRING', 74105280, true]
    const expected = ['STRING', 74105280, true]
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('returns the `default` value when `input` is `undefined`.', () => {
    expectValidation(schema, undefined).toReturn(['STRING', 74105280, true])
  })

  it('returns the `default` value when `input` is `null` and the schema is nullable.', () => {
    expectValidation(schema.nullable(), null).toReturn(['STRING', 74105280, true])
  })

  it('throws when `input` is not an array.', () => {
    DataTypeGenerator.skip('arrays', 'undefined').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an array.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.fallback(value)', () => {

  const base = TupleSchema.create([StringSchema.create(), NumberSchema.create(), BooleanSchema.create()])
  const schema = base.fallback(['FALLBACK', 0, false])

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(TupleSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when all `input` elements match the `shapes` schemas.', () => {
    const input = ['STRING', 74105280, true]
    const expected = ['STRING', 74105280, true]
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('returns the `fallback` value when `input` is not an array.', () => {
    DataTypeGenerator.skip('arrays').forEach((value) => {
      expectValidation(schema, value).toReturn(['FALLBACK', 0, false])
    })
  })

  it('returns the `fallback` value when at least one `input` element does not match the `shapes` schemas.', () => {
    const input = ['STRING', 'NOT-A-NUMBER', true]
    expectValidation(schema, input).toReturn(['FALLBACK', 0, false])
  })

  it('returns when `input` is `undefined` and the schema is optional.', () => {
    expectValidation(schema.optional(), undefined).toReturn(undefined)
  })

  it('returns when `input` is `null` and the schema is nullable.', () => {
    expectValidation(schema.nullable(), null).toReturn(null)
  })
})
