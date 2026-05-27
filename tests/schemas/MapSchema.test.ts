// IMPORTS
import { describe, expect, it } from 'vitest'
import { MapSchema } from '@/schemas/MapSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectError, expectValidation } from '@tests/helpers/expect'
import { NumberSchema } from '@/schemas/NumberSchema'

// METHOD
describe('.create(key, value)', () => {

  const schema = MapSchema.create(StringSchema.create(), NumberSchema.create())

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(MapSchema)
  })
})

// METHOD
describe('.validate(input)', () => {

  const schema = MapSchema.create(StringSchema.create(), NumberSchema.create())

  it('returns when `input` is a `Map` instance.', () => {
    expectValidation(schema, new Map()).toReturn(new Map())
  })

  it('throws when `input` is not a `Map` instance.', () => {
    DataTypeGenerator.skip('maps').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a Map.')
    })
  })

  it('returns when all `input` entries match the `key` and `value` schemas.', () => {
    const input = new Map([['a', 1], ['b', 2], ['c', 3]])
    const expected = new Map([['a', 1], ['b', 2], ['c', 3]])
    expectValidation(schema, input).toReturn(expected)
  })

  it('throws when at least one `input` key does not match the `key` schema.', () => {
    const input = new Map<unknown, number>([[true, 1], ['b', 2], [false, 3]])
    expectValidation(schema, input).toThrow('At least one entry does not match the given schema.', [
      [true, {
        value: true,
        message: 'The value must be a string.',
      }],
      [false, {
        value: false,
        message: 'The value must be a string.',
      }],
    ])
  })

  it('throws when at least one `input` value does not match the `value` schema.', () => {
    const input = new Map<string, unknown>([['a', true], ['b', 2], ['c', false]])
    expectValidation(schema, input).toThrow('At least one entry does not match the given schema.', [
      ['a', {
        value: true,
        message: 'The value must be a number.',
      }],
      ['c', {
        value: false,
        message: 'The value must be a number.',
      }],
    ])
  })

  it('returns a new `Map` instance.', () => {
    const input = new Map([['a', 1], ['b', 2], ['c', 3]])
    const expected = new Map([['a', 1], ['b', 2], ['c', 3]])
    expectValidation(schema, input).toReturn(expected)
    expectValidation(schema, input).notToReturn(input)
  })
})

// METHOD
describe('.prune()', () => {

  const schema = MapSchema.create(StringSchema.create(), NumberSchema.create()).prune()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(MapSchema)
  })

  it('returns when `input` is a `Map` instance.', () => {
    expectValidation(schema, new Map([])).toReturn(new Map([]))
  })

  it('throws when `input` is not a `Map` instance.', () => {
    DataTypeGenerator.skip('maps').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a Map.')
    })
  })

  it('returns when all `input` elements match the `shape` schema.', () => {
    const input = new Map([['A', 1], ['B', 2], ['C', 3]])
    const expected = new Map([['A', 1], ['B', 2], ['C', 3]])
    expectValidation(schema, input).toReturn(expected)
  })

  it('prunes when some `input` keys do not match the `shape` schema.', () => {
    const input = new Map<string | boolean, number>([['A', 1], [true, 2], ['C', 3], [false, 4], ['E', 5]])
    const expected = new Map<string, number | boolean>([['A', 1], ['C', 3], ['E', 5]])
    expectValidation(schema, input).toReturn(expected)
  })

  it('prunes when some `input` values do not match the `shape` schema.', () => {
    const input = new Map<string, number | boolean>([['A', 1], ['B', true], ['C', 3], ['D', false], ['E', 5]])
    const expected = new Map<string, number | boolean>([['A', 1], ['C', 3], ['E', 5]])
    expectValidation(schema, input).toReturn(expected)
  })

  it('returns a new `Map` instance.', () => {
    const input = new Map([['A', 1], ['B', 2], ['C', 3]])
    const expected = new Map([['A', 1], ['B', 2], ['C', 3]])
    expectValidation(schema, input).toReturn(expected)
    expectValidation(schema, input).notToReturn(input)
  })
})

// METHOD
describe('.size(length)', () => {

  it('returns a new instance of the schema.', () => {
    const base = MapSchema.create(StringSchema.create(), NumberSchema.create())
    const schema = base.size(5)
    expect(schema).toBeInstanceOf(MapSchema)
    expect(schema).not.toBe(base)
  })

  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        MapSchema.create(StringSchema.create(), NumberSchema.create()).size(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        MapSchema.create(StringSchema.create(), NumberSchema.create()).size(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const schema = MapSchema.create(StringSchema.create(), NumberSchema.create()).size(0)

    it('returns when `input` size is as expected.', () => {
      expectValidation(schema, new Map()).toReturn(new Map())
    })

    it('throws when `input` size is greater than expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3]])
      expectValidation(schema, input).toThrow('The value must be 0 elements long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const schema = MapSchema.create(StringSchema.create(), NumberSchema.create()).size(5)

    it('throws when `input` size is less than expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3]])
      expectValidation(schema, input).toThrow('The value must be 5 elements long.')
    })

    it('returns when `input` size is as expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5]])
      const expected = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5]])
      expectValidation(schema, input).toReturn(expected)
    })

    it('throws when `input` size is greater than expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5], ['F', 6], ['G', 7]])
      expectValidation(schema, input).toThrow('The value must be 5 elements long.')
    })
  })
})

// METHOD
describe('.min(length)', () => {

  it('returns a new instance of the schema.', () => {
    const base = MapSchema.create(StringSchema.create(), NumberSchema.create())
    const schema = base.min(5)
    expect(schema).toBeInstanceOf(MapSchema)
    expect(schema).not.toBe(base)
  })

  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        MapSchema.create(StringSchema.create(), NumberSchema.create()).min(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        MapSchema.create(StringSchema.create(), NumberSchema.create()).min(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const schema = MapSchema.create(StringSchema.create(), NumberSchema.create()).min(0)

    it('returns when `input` is empty.', () => {
      expectValidation(schema, new Map([])).toReturn(new Map([]))
    })

    it('returns when `input` size is greater than expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3]])
      const expected = new Map([['A', 1], ['B', 2], ['C', 3]])
      expectValidation(schema, input).toReturn(expected)
    })
  })

  describe('when `length` is a positive number', () => {

    const schema = MapSchema.create(StringSchema.create(), NumberSchema.create()).min(5)

    it('throws when `input` size is less than expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3]])
      expectValidation(schema, input).toThrow('The value must be at least 5 elements long.')
    })

    it('returns when `input` size is as expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5]])
      const expected = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5]])
      expectValidation(schema, input).toReturn(expected)
    })

    it('returns when `input` size is greater than expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5], ['F', 6], ['G', 7]])
      const expected = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5], ['F', 6], ['G', 7]])
      expectValidation(schema, input).toReturn(expected)
    })
  })
})

// METHOD
describe('.max(length)', () => {

  it('returns a new instance of the schema.', () => {
    const base = MapSchema.create(StringSchema.create(), NumberSchema.create())
    const schema = base.max(5)
    expect(schema).toBeInstanceOf(MapSchema)
    expect(schema).not.toBe(base)
  })

  describe('when `length` is `NaN`', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        MapSchema.create(StringSchema.create(), NumberSchema.create()).max(NaN)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is a negative number', () => {
    it('throws when the schema is being built.', () => {
      expectError(() => {
        MapSchema.create(StringSchema.create(), NumberSchema.create()).max(-8)
      }).toHaveMessage('The length value must be zero or positive.')
    })
  })

  describe('when `length` is zero', () => {

    const schema = MapSchema.create(StringSchema.create(), NumberSchema.create()).max(0)

    it('returns when `input` is empty.', () => {
      expectValidation(schema, new Map([])).toReturn(new Map([]))
    })

    it('throws when `input` size is greater than expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3]])
      expectValidation(schema, input).toThrow('The value must be at most 0 elements long.')
    })
  })

  describe('when `length` is a positive number', () => {

    const schema = MapSchema.create(StringSchema.create(), NumberSchema.create()).max(5)

    it('throws when `input` size is less than expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3]])
      const expected = new Map([['A', 1], ['B', 2], ['C', 3]])
      expectValidation(schema, input).toReturn(expected)
    })

    it('returns when `input` size is as expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5]])
      const expected = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5]])
      expectValidation(schema, input).toReturn(expected)
    })

    it('throws when `input` size is greater than expected.', () => {
      const input = new Map([['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5], ['F', 6], ['G', 7]])
      expectValidation(schema, input).toThrow('The value must be at most 5 elements long.')
    })
  })
})

// METHOD
describe('.filter(callback)', () => {

  const schema = MapSchema.create(StringSchema.create(), NumberSchema.create()).filter((value) => (value % 10 === 0))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(MapSchema)
  })

  it('returns when `callback` returns `true` for all `input` elements.', () => {
    const input = new Map([['A', 10], ['B', 20], ['C', 30]])
    const expected = new Map([['A', 10], ['B', 20], ['C', 30]])
    expectValidation(schema, input).toReturn(expected)
  })

  it('filters when `callback` returns `false` for some `input` elements.', () => {
    const input = new Map([['A', 10], ['B', 22], ['C', 30]])
    const expected = new Map([['A', 10], ['C', 30]])
    expectValidation(schema, input).toReturn(expected)
  })

  it('filters when `callback` returns `false` for all `input` elements.', () => {
    const input = new Map([['A', 11], ['B', 22], ['C', 33]])
    const expected: Map<string, number> = new Map([])
    expectValidation(schema, input).toReturn(expected)
  })
})

// METHOD
describe('.some(callback)', () => {

  const schema = MapSchema.create(StringSchema.create(), NumberSchema.create()).some((value) => (value % 10 === 0))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(MapSchema)
  })

  it('returns when `callback` returns `true` for some `input` elements.', () => {
    const input = new Map([['A', 10], ['B', 20], ['C', 30]])
    const expected = new Map([['A', 10], ['B', 20], ['C', 30]])
    expectValidation(schema, input).toReturn(expected)
  })

  it('returns when `callback` returns `false` for some `input` elements.', () => {
    const input = new Map([['A', 10], ['B', 22], ['C', 30]])
    const expected = new Map([['A', 10], ['B', 22], ['C', 30]])
    expectValidation(schema, input).toReturn(expected)
  })

  it('throws when `callback` returns `false` for all `input` elements.', () => {
    const input = new Map([['A', 11], ['B', 22], ['C', 33]])
    expectValidation(schema, input).toThrow('No element satisfies the given validation function.')
  })
})

// METHOD
describe('.every(callback)', () => {

  const schema = MapSchema.create(StringSchema.create(), NumberSchema.create()).every((value) => (value % 10 === 0))

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(MapSchema)
  })

  it('returns when `callback` returns `true` for all `input` elements.', () => {
    const input = new Map([['A', 10], ['B', 20], ['C', 30]])
    const expected = new Map([['A', 10], ['B', 20], ['C', 30]])
    expectValidation(schema, input).toReturn(expected)
  })

  it('throws when `callback` returns `false` for some `input` elements.', () => {
    const input = new Map([['A', 10], ['B', 22], ['C', 30]])
    expectValidation(schema, input).toThrow('At least one element does not satisfy the given validation function.')
  })

  it('throws when `callback` returns `false` for all `input` elements.', () => {
    const input = new Map([['A', 11], ['B', 22], ['C', 33]])
    expectValidation(schema, input).toThrow('At least one element does not satisfy the given validation function.')
  })
})
