// IMPORTS
import { describe, it, expect } from 'vitest'
import { RecordSchema } from '@/schemas/RecordSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation, expectError } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(shape)', () => {

  const schema = RecordSchema.create(NumberSchema.create())

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(RecordSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = RecordSchema.create(NumberSchema.create())

  it('returns when `input` is an object.', () => {
    const input: Record<string, number> = {}
    const expected: Record<string, number> = {}
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `input` is not an object.', () => {
    DataTypeGenerator.skip('objects').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an object.')
    })
  })

  it('returns when all `input` entries match the `shape` schema.', () => {
    const input = { a: 1, b: 2, c: 3 }
    const expected = { a: 1, b: 2, c: 3 }
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when at least one `input` entry does not match the `shape` schema.', () => {
    const input = { a: true, b: 2, c: '3' }
    expectValidation(schema, input).toThrow('At least one entry does not match the given schema.', [
      ['a', {
        value: true,
        message: 'The value must be a number.',
      }],
      ['c', {
        value: '3',
        message: 'The value must be a number.',
      }],
    ])
  })
})

// METHOD ---------------------------------------------------------------------
describe('.prune()', () => {

  const base = RecordSchema.create(NumberSchema.create())
  const schema = base.prune()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(RecordSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is an object.', () => {
    const input: Record<string, number> = {}
    const expected: Record<string, number> = {}
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `input` is not an object.', () => {
    DataTypeGenerator.skip('objects').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an object.')
    })
  })

  it('returns when all `input` entries match the `shape` schema.', () => {
    const input = { a: 1, b: 2, c: 3 }
    const expected = { a: 1, b: 2, c: 3 }
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('prunes when some `input` entries do not match the `shape` schema.', () => {
    const input = { a: 1, b: true, c: 3, d: false, e: 5 }
    const expected = { a: 1, c: 3, e: 5 }
    expectValidation(schema, input).toReturnNew(expected)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.length(length)', () => {
  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        RecordSchema.create(NumberSchema.create()).length(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        RecordSchema.create(NumberSchema.create()).length(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const base = RecordSchema.create(NumberSchema.create())
    const schema = base.length(0)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(RecordSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` length is as expected.', () => {
      const input: Record<string, number> = {}
      const expected: Record<string, number> = {}
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = { a: 1, b: 2, c: 3 }
      expectValidation(schema, input).toThrow('The value must be 0 entries long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const base = RecordSchema.create(NumberSchema.create())
    const schema = base.length(5)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(RecordSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` length is less than expected.', () => {
      const input = { a: 1, b: 2, c: 3 }
      expectValidation(schema, input).toThrow('The value must be 5 entries long.')
    })

    it('returns when `input` length is as expected.', () => {
      const input = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      const expected = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }
      expectValidation(schema, input).toThrow('The value must be 5 entries long.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.min(length)', () => {
  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        RecordSchema.create(NumberSchema.create()).min(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        RecordSchema.create(NumberSchema.create()).min(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const base = RecordSchema.create(NumberSchema.create())
    const schema = base.min(0)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(RecordSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` is empty.', () => {
      const input: Record<string, number> = {}
      const expected: Record<string, number> = {}
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('returns when `input` length is greater than expected.', () => {
      const input = { a: 1, b: 2, c: 3 }
      const expected = { a: 1, b: 2, c: 3 }
      expectValidation(schema, input).toReturnNew(expected)
    })
  })

  describe('when `length` is a positive number', () => {

    const base = RecordSchema.create(NumberSchema.create())
    const schema = base.min(5)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(RecordSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` length is less than expected.', () => {
      const input = { a: 1, b: 2, c: 3 }
      expectValidation(schema, input).toThrow('The value must be at least 5 entries long.')
    })

    it('returns when `input` length is as expected.', () => {
      const input = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      const expected = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('returns when `input` length is greater than expected.', () => {
      const input = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }
      const expected = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }
      expectValidation(schema, input).toReturnNew(expected)
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.max(length)', () => {
  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        RecordSchema.create(NumberSchema.create()).max(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        RecordSchema.create(NumberSchema.create()).max(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const base = RecordSchema.create(NumberSchema.create())
    const schema = base.max(0)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(RecordSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` is empty.', () => {
      const input: Record<string, number> = {}
      const expected: Record<string, number> = {}
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = { a: 1, b: 2, c: 3 }
      expectValidation(schema, input).toThrow('The value must be at most 0 entries long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const base = RecordSchema.create(NumberSchema.create())
    const schema = base.max(5)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(RecordSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` length is less than expected.', () => {
      const input = { a: 1, b: 2, c: 3 }
      const expected = { a: 1, b: 2, c: 3 }
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('returns when `input` length is as expected.', () => {
      const input = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      const expected = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }
      expectValidation(schema, input).toThrow('The value must be at most 5 entries long.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.filter(callback)', () => {

  const base = RecordSchema.create(NumberSchema.create())
  const schema = base.filter((value) => (value % 10 === 0))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(RecordSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `callback` returns `true` for all `input` entries.', () => {
    const input = { a: 10, b: 20, c: 30 }
    const expected = { a: 10, b: 20, c: 30 }
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('filters when `callback` returns `false` for some `input` entries.', () => {
    const input = { a: 10, b: 22, c: 30 }
    const expected = { a: 10, c: 30 }
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('filters when `callback` returns `false` for all `input` entries.', () => {
    const input = { a: 11, b: 22, c: 33 }
    const expected: Record<string, number> = {}
    expectValidation(schema, input).toReturnNew(expected)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.some(callback)', () => {

  const base = RecordSchema.create(NumberSchema.create())
  const schema = base.some((value) => (value % 10 === 0))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(RecordSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `callback` returns `true` for some `input` entries.', () => {
    const input = { a: 10, b: 20, c: 30 }
    const expected = { a: 10, b: 20, c: 30 }
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('returns when `callback` returns `false` for some `input` entries.', () => {
    const input = { a: 10, b: 22, c: 30 }
    const expected = { a: 10, b: 22, c: 30 }
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `callback` returns `false` for all `input` entries.', () => {
    const input = { a: 11, b: 22, c: 33 }
    expectValidation(schema, input).toThrow('No entry satisfies the given validation function.')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.every(callback)', () => {

  const base = RecordSchema.create(NumberSchema.create())
  const schema = base.every((value) => (value % 10 === 0))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(RecordSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `callback` returns `true` for all `input` entries.', () => {
    const input = { a: 10, b: 20, c: 30 }
    const expected = { a: 10, b: 20, c: 30 }
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `callback` returns `false` for some `input` entries.', () => {
    const input = { a: 10, b: 22, c: 30 }
    expectValidation(schema, input).toThrow('At least one entry does not satisfy the given validation function.')
  })

  it('throws when `callback` returns `false` for all `input` entries.', () => {
    const input = { a: 11, b: 22, c: 33 }
    expectValidation(schema, input).toThrow('At least one entry does not satisfy the given validation function.')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.none(callback)', () => {

  const base = RecordSchema.create(NumberSchema.create())
  const schema = base.none((value) => (value % 10 === 0))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(RecordSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `callback` returns `true` for all `input` entries.', () => {
    const input = { a: 11, b: 22, c: 33 }
    const expected = { a: 11, b: 22, c: 33 }
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `callback` returns `false` for some `input` entries.', () => {
    const input = { a: 10, b: 22, c: 30 }
    expectValidation(schema, input).toThrow('At least one entry satisfies the given validation function.')
  })

  it('throws when `callback` returns `false` for all `input` entries.', () => {
    const input = { a: 10, b: 20, c: 30 }
    expectValidation(schema, input).toThrow('At least one entry satisfies the given validation function.')
  })
})
