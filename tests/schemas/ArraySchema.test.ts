// IMPORTS
import { describe, it, expect } from 'vitest'
import { ArraySchema } from '@/schemas/ArraySchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation, expectError } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(shape)', () => {

  const schema = ArraySchema.create(StringSchema.create())

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(ArraySchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = ArraySchema.create(StringSchema.create())

  it('returns when `input` is an array.', () => {
    const input: Array<string> = []
    const expected: Array<string> = []
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `input` is not an array.', () => {
    DataTypeGenerator.skip('arrays').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an array.')
    })
  })

  it('returns when all `input` elements match the `shape` schema.', () => {
    const input = ['a', 'b', 'c']
    const expected = ['a', 'b', 'c']
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when at least one `input` element does not match the `shape` schema.', () => {
    const input = [true, 'b', 255]
    expectValidation(schema, input).toThrow('At least one element does not match the given schema.', [
      [0, {
        value: true,
        message: 'The value must be a string.',
      }],
      [2, {
        value: 255,
        message: 'The value must be a string.',
      }],
    ])
  })
})

// METHOD ---------------------------------------------------------------------
describe('.prune()', () => {

  const base = ArraySchema.create(StringSchema.create())
  const schema = base.prune()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(ArraySchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is an array.', () => {
    const input: Array<string> = []
    const expected: Array<string> = []
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `input` is not an array.', () => {
    DataTypeGenerator.skip('arrays').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an array.')
    })
  })

  it('returns when all `input` elements match the `shape` schema.', () => {
    const input = ['a', 'b', 'c']
    const expected = ['a', 'b', 'c']
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('prunes when some `input` elements do not match the `shape` schema.', () => {
    const input = ['a', true, 'b', 255, 'c']
    const expected = ['a', 'b', 'c']
    expectValidation(schema, input).toReturnNew(expected)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.length(length)', () => {
  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        ArraySchema.create(StringSchema.create()).length(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        ArraySchema.create(StringSchema.create()).length(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const base = ArraySchema.create(StringSchema.create())
    const schema = base.length(0)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(ArraySchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` length is as expected.', () => {
      const input: Array<string> = []
      const expected: Array<string> = []
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = ['A', 'B', 'C']
      expectValidation(schema, input).toThrow('The value must be 0 elements long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const base = ArraySchema.create(StringSchema.create())
    const schema = base.length(5)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(ArraySchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` length is less than expected.', () => {
      const input = ['A', 'B', 'C']
      expectValidation(schema, input).toThrow('The value must be 5 elements long.')
    })

    it('returns when `input` length is as expected.', () => {
      const input = ['A', 'B', 'C', 'D', 'E']
      const expected = ['A', 'B', 'C', 'D', 'E']
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      expectValidation(schema, input).toThrow('The value must be 5 elements long.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.min(length)', () => {
  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        ArraySchema.create(StringSchema.create()).min(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        ArraySchema.create(StringSchema.create()).min(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const base = ArraySchema.create(StringSchema.create())
    const schema = base.min(0)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(ArraySchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` is empty.', () => {
      const input: Array<string> = []
      const expected: Array<string> = []
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('returns when `input` length is greater than expected.', () => {
      const input = ['A', 'B', 'C']
      const expected = ['A', 'B', 'C']
      expectValidation(schema, input).toReturnNew(expected)
    })
  })

  describe('when `length` is a positive number', () => {

    const base = ArraySchema.create(StringSchema.create())
    const schema = base.min(5)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(ArraySchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` length is less than expected.', () => {
      const input = ['A', 'B', 'C']
      expectValidation(schema, input).toThrow('The value must be at least 5 elements long.')
    })

    it('returns when `input` length is as expected.', () => {
      const input = ['A', 'B', 'C', 'D', 'E']
      const expected = ['A', 'B', 'C', 'D', 'E']
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('returns when `input` length is greater than expected.', () => {
      const input = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      const expected = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      expectValidation(schema, input).toReturnNew(expected)
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.max(length)', () => {
  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        ArraySchema.create(StringSchema.create()).max(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        ArraySchema.create(StringSchema.create()).max(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const base = ArraySchema.create(StringSchema.create())
    const schema = base.max(0)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(ArraySchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` is empty.', () => {
      const input: Array<string> = []
      const expected: Array<string> = []
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = ['A', 'B', 'C']
      expectValidation(schema, input).toThrow('The value must be at most 0 elements long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const base = ArraySchema.create(StringSchema.create())
    const schema = base.max(5)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(ArraySchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` length is less than expected.', () => {
      const input = ['A', 'B', 'C']
      const expected = ['A', 'B', 'C']
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('returns when `input` length is as expected.', () => {
      const input = ['A', 'B', 'C', 'D', 'E']
      const expected = ['A', 'B', 'C', 'D', 'E']
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      expectValidation(schema, input).toThrow('The value must be at most 5 elements long.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.filter(callback)', () => {

  const base = ArraySchema.create(StringSchema.create())
  const schema = base.filter((value) => (value !== ''))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(ArraySchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `callback` returns `true` for all `input` elements.', () => {
    const input = ['A', 'B', 'C']
    const expected = ['A', 'B', 'C']
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('filters when `callback` returns `false` for some `input` elements.', () => {
    const input = ['A', '', 'C']
    const expected = ['A', 'C']
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('filters when `callback` returns `false` for all `input` elements.', () => {
    const input = ['', '', '']
    const expected: Array<string> = []
    expectValidation(schema, input).toReturnNew(expected)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.some(callback)', () => {

  const base = ArraySchema.create(StringSchema.create())
  const schema = base.some((value) => (value !== ''))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(ArraySchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `callback` returns `true` for some `input` elements.', () => {
    const input = ['A', 'B', 'C']
    const expected = ['A', 'B', 'C']
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('returns when `callback` returns `false` for some `input` elements.', () => {
    const input = ['A', '', 'C']
    const expected = ['A', '', 'C']
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `callback` returns `false` for all `input` elements.', () => {
    const input = ['', '', '']
    expectValidation(schema, input).toThrow('No element satisfies the given validation function.')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.every(callback)', () => {

  const base = ArraySchema.create(StringSchema.create())
  const schema = base.every((value) => (value !== ''))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(ArraySchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `callback` returns `true` for all `input` elements.', () => {
    const input = ['A', 'B', 'C']
    const expected = ['A', 'B', 'C']
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `callback` returns `false` for some `input` elements.', () => {
    const input = ['A', '', 'C']
    expectValidation(schema, input).toThrow('At least one element does not satisfy the given validation function.')
  })

  it('throws when `callback` returns `false` for all `input` elements.', () => {
    const input = ['', '', '']
    expectValidation(schema, input).toThrow('At least one element does not satisfy the given validation function.')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.none(callback)', () => {

  const base = ArraySchema.create(StringSchema.create())
  const schema = base.none((value) => (value !== ''))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(ArraySchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `callback` returns `true` for all `input` elements.', () => {
    const input = ['', '', '']
    const expected = ['', '', '']
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `callback` returns `false` for some `input` elements.', () => {
    const input = ['A', '', 'C']
    expectValidation(schema, input).toThrow('At least one element satisfies the given validation function.')
  })

  it('throws when `callback` returns `false` for all `input` elements.', () => {
    const input = ['A', 'B', 'C']
    expectValidation(schema, input).toThrow('At least one element satisfies the given validation function.')
  })
})
