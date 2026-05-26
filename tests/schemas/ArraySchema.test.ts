// IMPORTS
import { describe, expect, it } from 'vitest'
import { ArraySchema } from '@/schemas/ArraySchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectError, expectValidation } from '@tests/helpers/expect'

// METHOD
describe('.create(shape)', () => {

  const schema = ArraySchema.create(StringSchema.create())

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(ArraySchema)
  })
})

// METHOD
describe('.prune()', () => {

  const schema = ArraySchema.create(StringSchema.create()).prune()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(ArraySchema)
  })

  it('returns when `input` is an array.', () => {
    expectValidation(schema, []).toReturn([])
  })

  it('throws when `input` is not an array.', () => {
    DataTypeGenerator.skip('arrays').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an array.')
    })
  })

  it('returns when all `input` elements match the `shape` schema.', () => {
    const input = ['a', 'b', 'c']
    const expected = ['a', 'b', 'c']
    expectValidation(schema, input).toReturn(expected)
  })

  it('prunes when some `input` elements do not match the `shape` schema.', () => {
    const input = ['a', true, 'b', 255, 'c']
    const expected = ['a', 'b', 'c']
    expectValidation(schema, input).toReturn(expected)
  })

  it('returns a new array.', () => {
    const input = ['a', 'b', 'c']
    expectValidation(schema, input).toReturn(['a', 'b', 'c'])
    expectValidation(schema, input).notToReturn(input)
  })
})

// METHOD
describe('.validate(input)', () => {

  const schema = ArraySchema.create(StringSchema.create())

  it('returns when `input` is an array.', () => {
    expectValidation(schema, []).toReturn([])
  })

  it('throws when `input` is not an array.', () => {
    DataTypeGenerator.skip('arrays').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be an array.')
    })
  })

  it('returns when all `input` elements match the `shape` schema.', () => {
    expectValidation(schema, ['a', 'b', 'c']).toReturn(['a', 'b', 'c'])
  })

  it('throws when at least one `input` element does not match the `shape` schema.', () => {
    expectValidation(schema, [true, 'b', 255]).toThrow('At least one element does not match the given schema.', [
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

  it('returns a new array.', () => {
    const input = ['a', 'b', 'c']
    expectValidation(schema, input).toReturn(['a', 'b', 'c'])
    expectValidation(schema, input).notToReturn(input)
  })
})

// METHOD
describe('.length(length)', () => {

  it('returns a new instance of the schema.', () => {
    const base = ArraySchema.create(ArraySchema.create(StringSchema.create()))
    const schema = base.length(5)
    expect(schema).toBeInstanceOf(ArraySchema)
    expect(schema).not.toBe(base)
  })

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

    const schema = ArraySchema.create(StringSchema.create()).length(0)

    it('returns when `input` length is as expected.', () => {
      expectValidation(schema, []).toReturn([])
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = ['A', 'B', 'C']
      expectValidation(schema, input).toThrow('The value must be 0 elements long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const schema = ArraySchema.create(StringSchema.create()).length(5)

    it('throws when `input` length is less than expected.', () => {
      const input = ['A', 'B', 'C']
      expectValidation(schema, input).toThrow('The value must be 5 elements long.')
    })

    it('returns when `input` length is as expected.', () => {
      const input = ['A', 'B', 'C', 'D', 'E']
      const expected = ['A', 'B', 'C', 'D', 'E']
      expectValidation(schema, input).toReturn(expected)
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      expectValidation(schema, input).toThrow('The value must be 5 elements long.')
    })
  })
})

// METHOD
describe('.min(length)', () => {

  it('returns a new instance of the schema.', () => {
    const base = ArraySchema.create(ArraySchema.create(StringSchema.create()))
    const schema = base.min(5)
    expect(schema).toBeInstanceOf(ArraySchema)
    expect(schema).not.toBe(base)
  })

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

    const schema = ArraySchema.create(StringSchema.create()).min(0)

    it('returns when `input` is empty.', () => {
      expectValidation(schema, []).toReturn([])
    })

    it('returns when `input` length is greater than expected.', () => {
      const input = ['A', 'B', 'C']
      const expected = ['A', 'B', 'C']
      expectValidation(schema, input).toReturn(expected)
    })
  })

  describe('when `length` is a positive number', () => {

    const schema = ArraySchema.create(StringSchema.create()).min(5)

    it('throws when `input` length is less than expected.', () => {
      const input = ['A', 'B', 'C']
      expectValidation(schema, input).toThrow('The value must be at least 5 elements long.')
    })

    it('returns when `input` length is as expected.', () => {
      const input = ['A', 'B', 'C', 'D', 'E']
      const expected = ['A', 'B', 'C', 'D', 'E']
      expectValidation(schema, input).toReturn(expected)
    })

    it('returns when `input` length is greater than expected.', () => {
      const input = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      const expected = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      expectValidation(schema, input).toReturn(expected)
    })
  })
})

// METHOD
describe('.max(length)', () => {

  it('returns a new instance of the schema.', () => {
    const base = ArraySchema.create(ArraySchema.create(StringSchema.create()))
    const schema = base.max(5)
    expect(schema).toBeInstanceOf(ArraySchema)
    expect(schema).not.toBe(base)
  })

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

    const schema = ArraySchema.create(StringSchema.create()).max(0)

    it('returns when `input` is empty.', () => {
      expectValidation(schema, []).toReturn([])
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = ['A', 'B', 'C']
      expectValidation(schema, input).toThrow('The value must be at most 0 elements long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const schema = ArraySchema.create(StringSchema.create()).max(5)

    it('throws when `input` length is less than expected.', () => {
      const input = ['A', 'B', 'C']
      const expected = ['A', 'B', 'C']
      expectValidation(schema, input).toReturn(expected)
    })

    it('returns when `input` length is as expected.', () => {
      const input = ['A', 'B', 'C', 'D', 'E']
      const expected = ['A', 'B', 'C', 'D', 'E']
      expectValidation(schema, input).toReturn(expected)
    })

    it('throws when `input` length is greater than expected.', () => {
      const input = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      expectValidation(schema, input).toThrow('The value must be at most 5 elements long.')
    })
  })
})
