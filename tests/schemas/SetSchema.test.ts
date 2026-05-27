// IMPORTS
import { describe, it, expect } from 'vitest'
import { SetSchema } from '@/schemas/SetSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation, expectError } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create(shape)', () => {

  const schema = SetSchema.create(StringSchema.create())

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(SetSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = SetSchema.create(StringSchema.create())

  it('returns when `input` is a `Set` instance.', () => {
    const input: Set<string> = new Set()
    const expected: Set<string> = new Set()
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `input` is not a `Set` instance.', () => {
    DataTypeGenerator.skip('sets').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a Set.')
    })
  })

  it('returns when all `input` elements match the `shape` schema.', () => {
    const input = new Set(['a', 'b', 'c'])
    const expected = new Set(['a', 'b', 'c'])
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when at least one `input` element does not match the `shape` schema.', () => {
    const input = new Set([true, 'b', 255])
    expectValidation(schema, input).toThrow('At least one element does not match the given schema.', [
      [true, {
        value: true,
        message: 'The value must be a string.',
      }],
      [255, {
        value: 255,
        message: 'The value must be a string.',
      }],
    ])
  })
})

// METHOD ---------------------------------------------------------------------
describe('.prune()', () => {

  const base = SetSchema.create(StringSchema.create())
  const schema = base.prune()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(SetSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is a `Set` instance.', () => {
    const input: Set<string> = new Set()
    const expected: Set<string> = new Set()
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `input` is not a `Set` instance.', () => {
    DataTypeGenerator.skip('sets').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a Set.')
    })
  })

  it('returns when all `input` elements match the `shape` schema.', () => {
    const input = new Set(['a', 'b', 'c'])
    const expected = new Set(['a', 'b', 'c'])
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('prunes when some `input` elements do not match the `shape` schema.', () => {
    const input = new Set(['a', true, 'b', 255, 'c'])
    const expected = new Set(['a', 'b', 'c'])
    expectValidation(schema, input).toReturnNew(expected)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.size(length)', () => {
  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        SetSchema.create(StringSchema.create()).size(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        SetSchema.create(StringSchema.create()).size(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const base = SetSchema.create(StringSchema.create())
    const schema = base.size(0)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(SetSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` size is as expected.', () => {
      const input: Set<string> = new Set()
      const expected: Set<string> = new Set()
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('throws when `input` size is greater than expected.', () => {
      const input = new Set(['A', 'B', 'C'])
      expectValidation(schema, input).toThrow('The value must be 0 elements long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const base = SetSchema.create(StringSchema.create())
    const schema = base.size(5)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(SetSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` size is less than expected.', () => {
      const input = new Set(['A', 'B', 'C'])
      expectValidation(schema, input).toThrow('The value must be 5 elements long.')
    })

    it('returns when `input` size is as expected.', () => {
      const input = new Set(['A', 'B', 'C', 'D', 'E'])
      const expected = new Set(['A', 'B', 'C', 'D', 'E'])
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('throws when `input` size is greater than expected.', () => {
      const input = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
      expectValidation(schema, input).toThrow('The value must be 5 elements long.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.min(length)', () => {
  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        SetSchema.create(StringSchema.create()).min(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        SetSchema.create(StringSchema.create()).min(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const base = SetSchema.create(StringSchema.create())
    const schema = base.min(0)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(SetSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` is empty.', () => {
      const input: Set<string> = new Set([])
      const expected: Set<string> = new Set([])
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('returns when `input` size is greater than expected.', () => {
      const input = new Set(['A', 'B', 'C'])
      const expected = new Set(['A', 'B', 'C'])
      expectValidation(schema, input).toReturnNew(expected)
    })
  })

  describe('when `length` is a positive number', () => {

    const base = SetSchema.create(StringSchema.create())
    const schema = base.min(5)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(SetSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` size is less than expected.', () => {
      const input = new Set(['A', 'B', 'C'])
      expectValidation(schema, input).toThrow('The value must be at least 5 elements long.')
    })

    it('returns when `input` size is as expected.', () => {
      const input = new Set(['A', 'B', 'C', 'D', 'E'])
      const expected = new Set(['A', 'B', 'C', 'D', 'E'])
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('returns when `input` size is greater than expected.', () => {
      const input = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
      const expected = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
      expectValidation(schema, input).toReturnNew(expected)
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.max(length)', () => {
  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        SetSchema.create(StringSchema.create()).max(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        SetSchema.create(StringSchema.create()).max(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const base = SetSchema.create(StringSchema.create())
    const schema = base.max(0)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(SetSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` is empty.', () => {
      const input: Set<string> = new Set([])
      const expected: Set<string> = new Set([])
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('throws when `input` size is greater than expected.', () => {
      const input = new Set(['A', 'B', 'C'])
      expectValidation(schema, input).toThrow('The value must be at most 0 elements long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const base = SetSchema.create(StringSchema.create())
    const schema = base.max(5)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(SetSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` size is less than expected.', () => {
      const input = new Set(['A', 'B', 'C'])
      const expected = new Set(['A', 'B', 'C'])
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('returns when `input` size is as expected.', () => {
      const input = new Set(['A', 'B', 'C', 'D', 'E'])
      const expected = new Set(['A', 'B', 'C', 'D', 'E'])
      expectValidation(schema, input).toReturnNew(expected)
    })

    it('throws when `input` size is greater than expected.', () => {
      const input = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
      expectValidation(schema, input).toThrow('The value must be at most 5 elements long.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.filter(callback)', () => {

  const base = SetSchema.create(StringSchema.create())
  const schema = base.filter((value) => (value !== ''))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(SetSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `callback` returns `true` for all `input` elements.', () => {
    const input = new Set(['A', 'B', 'C'])
    const expected = new Set(['A', 'B', 'C'])
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('filters when `callback` returns `false` for some `input` elements.', () => {
    const input = new Set(['A', '', 'C'])
    const expected = new Set(['A', 'C'])
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('filters when `callback` returns `false` for all `input` elements.', () => {
    const input = new Set(['', '', ''])
    const expected: Set<string> = new Set([])
    expectValidation(schema, input).toReturnNew(expected)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.some(callback)', () => {

  const base = SetSchema.create(NumberSchema.create())
  const schema = base.some((value) => (value % 10 === 0))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(SetSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `callback` returns `true` for some `input` elements.', () => {
    const input = new Set([10, 20, 30])
    const expected = new Set([10, 20, 30])
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('returns when `callback` returns `false` for some `input` elements.', () => {
    const input = new Set([10, 22, 30])
    const expected = new Set([10, 22, 30])
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `callback` returns `false` for all `input` elements.', () => {
    const input = new Set([11, 22, 33])
    expectValidation(schema, input).toThrow('No element satisfies the given validation function.')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.every(callback)', () => {

  const base = SetSchema.create(NumberSchema.create())
  const schema = base.every((value) => (value % 10 === 0))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(SetSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `callback` returns `true` for all `input` elements.', () => {
    const input = new Set([10, 20, 30])
    const expected = new Set([10, 20, 30])
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `callback` returns `false` for some `input` elements.', () => {
    const input = new Set([10, 22, 30])
    expectValidation(schema, input).toThrow('At least one element does not satisfy the given validation function.')
  })

  it('throws when `callback` returns `false` for all `input` elements.', () => {
    const input = new Set([11, 22, 33])
    expectValidation(schema, input).toThrow('At least one element does not satisfy the given validation function.')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.none(callback)', () => {

  const base = SetSchema.create(NumberSchema.create())
  const schema = base.none((value) => (value % 10 === 0))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(SetSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `callback` returns `true` for all `input` elements.', () => {
    const input = new Set([11, 22, 33])
    const expected = new Set([11, 22, 33])
    expectValidation(schema, input).toReturnNew(expected)
  })

  it('throws when `callback` returns `false` for some `input` elements.', () => {
    const input = new Set([10, 22, 30])
    expectValidation(schema, input).toThrow('At least one element satisfies the given validation function.')
  })

  it('throws when `callback` returns `false` for all `input` elements.', () => {
    const input = new Set([10, 20, 30])
    expectValidation(schema, input).toThrow('At least one element satisfies the given validation function.')
  })
})
