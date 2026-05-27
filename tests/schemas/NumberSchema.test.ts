// IMPORTS
import { describe, it, expect } from 'vitest'
import { NumberSchema } from '@/schemas/NumberSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectValidation, expectError } from '@tests/helpers/expect'

// METHOD ---------------------------------------------------------------------
describe('.create()', () => {

  const schema = NumberSchema.create()

  it('returns an instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NumberSchema)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.validate(input)', () => {

  const schema = NumberSchema.create()

  it('returns when `input` is an integer number.', () => {
    expectValidation(schema, -255).toReturn(-255)
    expectValidation(schema, 255).toReturn(255)
  })

  it('returns when `input` is a float number.', () => {
    expectValidation(schema, -3.14).toReturn(-3.14)
    expectValidation(schema, 3.14).toReturn(3.14)
  })

  it('returns when `input` is an unsafe number.', () => {
    expectValidation(schema, Number.MIN_SAFE_INTEGER - 1).toReturn(Number.MIN_SAFE_INTEGER - 1)
    expectValidation(schema, Number.MAX_SAFE_INTEGER + 1).toReturn(Number.MAX_SAFE_INTEGER + 1)
  })

  it('returns when `input` is an infinite number.', () => {
    expectValidation(schema, -Infinity).toReturn(-Infinity)
    expectValidation(schema, Infinity).toReturn(Infinity)
  })

  it('returns when `input` is `NaN`.', () => {
    expectValidation(schema, NaN).toReturn(NaN)
  })

  it('throws when `input` is not a number.', () => {
    DataTypeGenerator.skip('numbers').forEach((value) => {
      expectValidation(schema, value).toThrow('The value must be a number.')
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.lessThan(target, { clamp })', () => {
  describe('when `target` is `NaN`', () => {
    it('throws when `clamp` is `undefined`.', () => {
      expectError(() => {
        NumberSchema.create().lessThan(NaN)
      }).toHaveMessage('The `target` parameter cannot be NaN.')
    })

    it('throws when `clamp` is `false`.', () => {
      expectError(() => {
        NumberSchema.create().lessThan(NaN, { clamp: false })
      }).toHaveMessage('The `target` parameter cannot be NaN.')
    })

    it('throws when `clamp` is `true`.', () => {
      expectError(() => {
        NumberSchema.create().lessThan(NaN, { clamp: true })
      }).toHaveMessage('The `target` parameter cannot be NaN.')
    })
  })

  describe('when `clamp` is `undefined`', () => {

    const base = NumberSchema.create()
    const schema = base.lessThan(500)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(NumberSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` is less than `target`.', () => {
      expectValidation(schema, 499.999).toReturn(499.999)
      expectValidation(schema, 499).toReturn(499)
      expectValidation(schema, 0).toReturn(0)
      expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
      expectValidation(schema, -Infinity).toReturn(-Infinity)
    })

    it('throws when `input` is equal to `target`.', () => {
      expectValidation(schema, 500).toThrow(`The value must be less than ${500}.`)
    })

    it('throws when `input` is greater than `target`.', () => {
      expectValidation(schema, 500.001).toThrow('The value must be less than 500.')
      expectValidation(schema, 501).toThrow('The value must be less than 500.')
      expectValidation(schema, 1000).toThrow('The value must be less than 500.')
      expectValidation(schema, Number.MAX_SAFE_INTEGER).toThrow('The value must be less than 500.')
      expectValidation(schema, Infinity).toThrow('The value must be less than 500.')
    })
  })

  describe('when `clamp` is `false`', () => {

    const base = NumberSchema.create()
    const schema = base.lessThan(500, { clamp: false })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(NumberSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` is less than `target`.', () => {
      expectValidation(schema, 499.999).toReturn(499.999)
      expectValidation(schema, 499).toReturn(499)
      expectValidation(schema, 0).toReturn(0)
      expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
      expectValidation(schema, -Infinity).toReturn(-Infinity)
    })

    it('throws when `input` is equal to `target`.', () => {
      expectValidation(schema, 500).toThrow('The value must be less than 500.')
    })

    it('throws when `input` is greater than `target`.', () => {
      expectValidation(schema, 500.001).toThrow('The value must be less than 500.')
      expectValidation(schema, 501).toThrow('The value must be less than 500.')
      expectValidation(schema, 1000).toThrow('The value must be less than 500.')
      expectValidation(schema, Number.MAX_SAFE_INTEGER).toThrow('The value must be less than 500.')
      expectValidation(schema, Infinity).toThrow('The value must be less than 500.')
    })
  })

  describe('when `clamp` is `true`', () => {

    const base = NumberSchema.create()
    const schema = base.lessThan(500, { clamp: true })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(NumberSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` is less than `target`.', () => {
      expectValidation(schema, 499.999).toReturn(499.999)
      expectValidation(schema, 499).toReturn(499)
      expectValidation(schema, 0).toReturn(0)
      expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
      expectValidation(schema, -Infinity).toReturn(-Infinity)
    })

    it('clamps when `input` is equal to `target`.', () => {
      expectValidation(schema, 500).toReturn(499)
    })

    it('clamps when `input` is greater than `target`.', () => {
      expectValidation(schema, 500.001).toReturn(499)
      expectValidation(schema, 501).toReturn(499)
      expectValidation(schema, 1000).toReturn(499)
      expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(499)
      expectValidation(schema, Infinity).toReturn(499)
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.lessThanOrEqual(target, { clamp })', () => {
  describe('when `target` is `NaN`', () => {
    it('throws when `clamp` is `undefined`.', () => {
      expectError(() => {
        NumberSchema.create().lessThanOrEqual(NaN)
      }).toHaveMessage('The `target` parameter cannot be NaN.')
    })

    it('throws when `clamp` is `false`.', () => {
      expectError(() => {
        NumberSchema.create().lessThanOrEqual(NaN, { clamp: false })
      }).toHaveMessage('The `target` parameter cannot be NaN.')
    })

    it('throws when `clamp` is `true`.', () => {
      expectError(() => {
        NumberSchema.create().lessThanOrEqual(NaN, { clamp: true })
      }).toHaveMessage('The `target` parameter cannot be NaN.')
    })
  })

  describe('when `clamp` is `undefined`', () => {

    const base = NumberSchema.create()
    const schema = base.lessThanOrEqual(500)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(NumberSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` is less than `target`.', () => {
      expectValidation(schema, 499.999).toReturn(499.999)
      expectValidation(schema, 499).toReturn(499)
      expectValidation(schema, 0).toReturn(0)
      expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
      expectValidation(schema, -Infinity).toReturn(-Infinity)
    })

    it('returns when `input` is equal to `target`.', () => {
      expectValidation(schema, 500).toReturn(500)
    })

    it('throws when `input` is greater than `target`.', () => {
      expectValidation(schema, 500.001).toThrow('The value must be less than or equal to 500.')
      expectValidation(schema, 501).toThrow('The value must be less than or equal to 500.')
      expectValidation(schema, 1000).toThrow('The value must be less than or equal to 500.')
      expectValidation(schema, Number.MAX_SAFE_INTEGER).toThrow('The value must be less than or equal to 500.')
      expectValidation(schema, Infinity).toThrow('The value must be less than or equal to 500.')
    })
  })

  describe('when `clamp` is `false`', () => {

    const base = NumberSchema.create()
    const schema = base.lessThanOrEqual(500, { clamp: false })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(NumberSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` is less than `target`.', () => {
      expectValidation(schema, 499.999).toReturn(499.999)
      expectValidation(schema, 499).toReturn(499)
      expectValidation(schema, 0).toReturn(0)
      expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
      expectValidation(schema, -Infinity).toReturn(-Infinity)
    })

    it('returns when `input` is equal to `target`.', () => {
      expectValidation(schema, 500).toReturn(500)
    })

    it('throws when `input` is greater than `target`.', () => {
      expectValidation(schema, 500.001).toThrow('The value must be less than or equal to 500.')
      expectValidation(schema, 501).toThrow('The value must be less than or equal to 500.')
      expectValidation(schema, 1000).toThrow('The value must be less than or equal to 500.')
      expectValidation(schema, Number.MAX_SAFE_INTEGER).toThrow('The value must be less than or equal to 500.')
      expectValidation(schema, Infinity).toThrow('The value must be less than or equal to 500.')
    })
  })

  describe('when `clamp` is `true`', () => {

    const base = NumberSchema.create()
    const schema = base.lessThanOrEqual(500, { clamp: true })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(NumberSchema)
      expect(schema).not.toBe(base)
    })

    it('returns when `input` is less than `target`.', () => {
      expectValidation(schema, 499.999).toReturn(499.999)
      expectValidation(schema, 499).toReturn(499)
      expectValidation(schema, 0).toReturn(0)
      expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
      expectValidation(schema, -Infinity).toReturn(-Infinity)
    })

    it('returns when `input` is equal to `target`.', () => {
      expectValidation(schema, 500).toReturn(500)
    })

    it('clamps when `input` is greater than `target`.', () => {
      expectValidation(schema, 500.001).toReturn(500)
      expectValidation(schema, 501).toReturn(500)
      expectValidation(schema, 1000).toReturn(500)
      expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(500)
      expectValidation(schema, Infinity).toReturn(500)
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.greaterThan(target, { clamp })', () => {
  describe('when `target` is `NaN`', () => {
    it('throws when `clamp` is `undefined`.', () => {
      expectError(() => {
        NumberSchema.create().greaterThan(NaN)
      }).toHaveMessage('The `target` parameter cannot be NaN.')
    })

    it('throws when `clamp` is `false`.', () => {
      expectError(() => {
        NumberSchema.create().greaterThan(NaN, { clamp: false })
      }).toHaveMessage('The `target` parameter cannot be NaN.')
    })

    it('throws when `clamp` is `true`.', () => {
      expectError(() => {
        NumberSchema.create().greaterThan(NaN, { clamp: true })
      }).toHaveMessage('The `target` parameter cannot be NaN.')
    })
  })

  describe('when `clamp` is `undefined`', () => {

    const base = NumberSchema.create()
    const schema = base.greaterThan(500)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(NumberSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` is less than `target`.', () => {
      expectValidation(schema, 499.999).toThrow('The value must be greater than 500.')
      expectValidation(schema, 499).toThrow('The value must be greater than 500.')
      expectValidation(schema, 0).toThrow('The value must be greater than 500.')
      expectValidation(schema, Number.MIN_SAFE_INTEGER).toThrow('The value must be greater than 500.')
      expectValidation(schema, -Infinity).toThrow('The value must be greater than 500.')
    })

    it('throws when `input` is equal to `target`.', () => {
      expectValidation(schema, 500).toThrow('The value must be greater than 500.')
    })

    it('returns when `input` is greater than `target`.', () => {
      expectValidation(schema, 500.001).toReturn(500.001)
      expectValidation(schema, 501).toReturn(501)
      expectValidation(schema, 1000).toReturn(1000)
      expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
      expectValidation(schema, Infinity).toReturn(Infinity)
    })
  })

  describe('when `clamp` is `false`', () => {

    const base = NumberSchema.create()
    const schema = base.greaterThan(500, { clamp: false })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(NumberSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` is less than `target`.', () => {
      expectValidation(schema, 499.999).toThrow('The value must be greater than 500.')
      expectValidation(schema, 499).toThrow('The value must be greater than 500.')
      expectValidation(schema, 0).toThrow('The value must be greater than 500.')
      expectValidation(schema, Number.MIN_SAFE_INTEGER).toThrow('The value must be greater than 500.')
      expectValidation(schema, -Infinity).toThrow('The value must be greater than 500.')
    })

    it('throws when `input` is equal to `target`.', () => {
      expectValidation(schema, 500).toThrow('The value must be greater than 500.')
    })

    it('returns when `input` is greater than `target`.', () => {
      expectValidation(schema, 500.001).toReturn(500.001)
      expectValidation(schema, 501).toReturn(501)
      expectValidation(schema, 1000).toReturn(1000)
      expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
      expectValidation(schema, Infinity).toReturn(Infinity)
    })
  })

  describe('when `clamp` is `true`', () => {

    const base = NumberSchema.create()
    const schema = base.greaterThan(500, { clamp: true })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(NumberSchema)
      expect(schema).not.toBe(base)
    })

    it('clamps when `input` is less than `target`.', () => {
      expectValidation(schema, 499.999).toReturn(501)
      expectValidation(schema, 499).toReturn(501)
      expectValidation(schema, 0).toReturn(501)
      expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(501)
      expectValidation(schema, -Infinity).toReturn(501)
    })

    it('clamps when `input` is equal to `target`.', () => {
      expectValidation(schema, 500).toReturn(501)
    })

    it('returns when `input` is greater than `target`.', () => {
      expectValidation(schema, 500.001).toReturn(500.001)
      expectValidation(schema, 501).toReturn(501)
      expectValidation(schema, 1000).toReturn(1000)
      expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
      expectValidation(schema, Infinity).toReturn(Infinity)
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.greaterThanOrEqual(target, { clamp })', () => {
  describe('when `target` is `NaN`', () => {
    it('throws when `clamp` is `undefined`.', () => {
      expectError(() => {
        NumberSchema.create().greaterThanOrEqual(NaN)
      }).toHaveMessage('The `target` parameter cannot be NaN.')
    })

    it('throws when `clamp` is `false`.', () => {
      expectError(() => {
        NumberSchema.create().greaterThanOrEqual(NaN, { clamp: false })
      }).toHaveMessage('The `target` parameter cannot be NaN.')
    })

    it('throws when `clamp` is `true`.', () => {
      expectError(() => {
        NumberSchema.create().greaterThanOrEqual(NaN, { clamp: true })
      }).toHaveMessage('The `target` parameter cannot be NaN.')
    })
  })

  describe('when `clamp` is `undefined`', () => {

    const base = NumberSchema.create()
    const schema = base.greaterThanOrEqual(500)

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(NumberSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` is less than `target`.', () => {
      expectValidation(schema, 499.999).toThrow('The value must be greater than or equal to 500.')
      expectValidation(schema, 499).toThrow('The value must be greater than or equal to 500.')
      expectValidation(schema, 0).toThrow('The value must be greater than or equal to 500.')
      expectValidation(schema, Number.MIN_SAFE_INTEGER).toThrow('The value must be greater than or equal to 500.')
      expectValidation(schema, -Infinity).toThrow('The value must be greater than or equal to 500.')
    })

    it('throws when `input` is equal to `target`.', () => {
      expectValidation(schema, 500).toReturn(500)
    })

    it('returns when `input` is greater than `target`.', () => {
      expectValidation(schema, 500.001).toReturn(500.001)
      expectValidation(schema, 501).toReturn(501)
      expectValidation(schema, 1000).toReturn(1000)
      expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
      expectValidation(schema, Infinity).toReturn(Infinity)
    })
  })

  describe('when `clamp` is `false`', () => {

    const base = NumberSchema.create()
    const schema = base.greaterThanOrEqual(500, { clamp: false })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(NumberSchema)
      expect(schema).not.toBe(base)
    })

    it('throws when `input` is less than `target`.', () => {
      expectValidation(schema, 499.999).toThrow('The value must be greater than or equal to 500.')
      expectValidation(schema, 499).toThrow('The value must be greater than or equal to 500.')
      expectValidation(schema, 0).toThrow('The value must be greater than or equal to 500.')
      expectValidation(schema, Number.MIN_SAFE_INTEGER).toThrow('The value must be greater than or equal to 500.')
      expectValidation(schema, -Infinity).toThrow('The value must be greater than or equal to 500.')
    })

    it('throws when `input` is equal to `target`.', () => {
      expectValidation(schema, 500).toReturn(500)
    })

    it('returns when `input` is greater than `target`.', () => {
      expectValidation(schema, 500.001).toReturn(500.001)
      expectValidation(schema, 501).toReturn(501)
      expectValidation(schema, 1000).toReturn(1000)
      expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
      expectValidation(schema, Infinity).toReturn(Infinity)
    })
  })

  describe('when `clamp` is `true`', () => {

    const base = NumberSchema.create()
    const schema = base.greaterThanOrEqual(500, { clamp: true })

    it('returns a new instance of the schema.', () => {
      expect(schema).toBeInstanceOf(NumberSchema)
      expect(schema).not.toBe(base)
    })

    it('clamps when `input` is less than `target`.', () => {
      expectValidation(schema, 499.999).toReturn(500)
      expectValidation(schema, 499).toReturn(500)
      expectValidation(schema, 0).toReturn(500)
      expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(500)
      expectValidation(schema, -Infinity).toReturn(500)
    })

    it('clamps when `input` is equal to `target`.', () => {
      expectValidation(schema, 500).toReturn(500)
    })

    it('returns when `input` is greater than `target`.', () => {
      expectValidation(schema, 500.001).toReturn(500.001)
      expectValidation(schema, 501).toReturn(501)
      expectValidation(schema, 1000).toReturn(1000)
      expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
      expectValidation(schema, Infinity).toReturn(Infinity)
    })
  })
})

// METHOD ---------------------------------------------------------------------
describe('.negative()', () => {

  const base = NumberSchema.create()
  const schema = base.negative()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NumberSchema)
    expect(schema).not.toBe(base)
  })

  it('throws when `input` is a negative number.', () => {
    expectValidation(schema, -0.001).toReturn(-0.001)
    expectValidation(schema, -1).toReturn(-1)
    expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
    expectValidation(schema, -Infinity).toReturn(-Infinity)
  })

  it('throws when `input` is zero.', () => {
    expectValidation(schema, -0).toThrow('The value must be a negative number.')
    expectValidation(schema, 0).toThrow('The value must be a negative number.')
  })

  it('returns when `input` is a negative number.', () => {
    expectValidation(schema, 0.001).toThrow('The value must be a negative number.')
    expectValidation(schema, 1).toThrow('The value must be a negative number.')
    expectValidation(schema, Number.MAX_SAFE_INTEGER).toThrow('The value must be a negative number.')
    expectValidation(schema, Infinity).toThrow('The value must be a negative number.')
  })
})

// METHOD ---------------------------------------------------------------------
describe('.positive()', () => {

  const base = NumberSchema.create()
  const schema = base.positive()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NumberSchema)
    expect(schema).not.toBe(base)
  })

  it('throws when `input` is a negative number.', () => {
    expectValidation(schema, -0.001).toThrow('The value must be a positive number.')
    expectValidation(schema, -1).toThrow('The value must be a positive number.')
    expectValidation(schema, Number.MIN_SAFE_INTEGER).toThrow('The value must be a positive number.')
    expectValidation(schema, -Infinity).toThrow('The value must be a positive number.')
  })

  it('throws when `input` is zero.', () => {
    expectValidation(schema, -0).toThrow('The value must be a positive number.')
    expectValidation(schema, 0).toThrow('The value must be a positive number.')
  })

  it('returns when `input` is a positive number.', () => {
    expectValidation(schema, 0.001).toReturn(0.001)
    expectValidation(schema, 1).toReturn(1)
    expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
    expectValidation(schema, Infinity).toReturn(Infinity)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.integer()', () => {

  const base = NumberSchema.create()
  const schema = base.integer()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NumberSchema)
    expect(schema).not.toBe(base)
  })

  it('throws when `input` is `NaN`.', () => {
    expectValidation(schema, NaN).toThrow('The value must be an integer.')
  })

  it('throws when `input` is an infinite number.', () => {
    expectValidation(schema, -Infinity).toThrow('The value must be an integer.')
    expectValidation(schema, Infinity).toThrow('The value must be an integer.')
  })

  it('throws when `input` is not an integer.', () => {
    expectValidation(schema, -999999.75).toThrow('The value must be an integer.')
    expectValidation(schema, -500.5).toThrow('The value must be an integer.')
    expectValidation(schema, -0.25).toThrow('The value must be an integer.')
    expectValidation(schema, 0.25).toThrow('The value must be an integer.')
    expectValidation(schema, 500.5).toThrow('The value must be an integer.')
    expectValidation(schema, 999999.75).toThrow('The value must be an integer.')
  })

  it('returns when `input` is an integer.', () => {
    expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
    expectValidation(schema, -100000).toReturn(-100000)
    expectValidation(schema, -1).toReturn(-1)
    expectValidation(schema, -0).toReturn(-0)
    expectValidation(schema, 0).toReturn(0)
    expectValidation(schema, 1).toReturn(1)
    expectValidation(schema, 100000).toReturn(100000)
    expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.finite()', () => {

  const base = NumberSchema.create()
  const schema = base.finite()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NumberSchema)
    expect(schema).not.toBe(base)
  })

  it('throws when `input` is `NaN`.', () => {
    expectValidation(schema, NaN).toThrow('The value must be a finite number.')
  })

  it('throws when `input` is not a finite number.', () => {
    expectValidation(schema, -Infinity).toThrow('The value must be a finite number.')
    expectValidation(schema, Infinity).toThrow('The value must be a finite number.')
  })

  it('returns when `input` is a finite number.', () => {
    expectValidation(schema, Number.MIN_SAFE_INTEGER - 1).toReturn(Number.MIN_SAFE_INTEGER - 1)
    expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
    expectValidation(schema, -Number.MIN_VALUE).toReturn(-Number.MIN_VALUE)
    expectValidation(schema, -0).toReturn(-0)
    expectValidation(schema, 0).toReturn(0)
    expectValidation(schema, Number.MIN_VALUE).toReturn(Number.MIN_VALUE)
    expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
    expectValidation(schema, Number.MAX_SAFE_INTEGER + 1).toReturn(Number.MAX_SAFE_INTEGER + 1)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.safe()', () => {

  const base = NumberSchema.create()
  const schema = base.safe()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NumberSchema)
    expect(schema).not.toBe(base)
  })

  it('throws when `input` is `NaN`.', () => {
    expectValidation(schema, NaN).toThrow('The value must be a safe integer.')
  })

  it('throws when `input` is an infinite number.', () => {
    expectValidation(schema, -Infinity).toThrow('The value must be a safe integer.')
    expectValidation(schema, Infinity).toThrow('The value must be a safe integer.')
  })

  it('throws when `input` is not a safe number.', () => {
    expectValidation(schema, Number.MIN_SAFE_INTEGER - 1).toThrow('The value must be a safe integer.')
    expectValidation(schema, Number.MAX_SAFE_INTEGER + 1).toThrow('The value must be a safe integer.')
  })

  it('returns when `input` is a safe number.', () => {
    expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
    expectValidation(schema, -Number.MIN_VALUE).toReturn(-Number.MIN_VALUE)
    expectValidation(schema, -0).toReturn(-0)
    expectValidation(schema, 0).toReturn(0)
    expectValidation(schema, Number.MIN_VALUE).toReturn(Number.MIN_VALUE)
    expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.trunc()', () => {

  const base = NumberSchema.create()
  const schema = base.trunc()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NumberSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is an integer.', () => {
    expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
    expectValidation(schema, -999999).toReturn(-999999)
    expectValidation(schema, -100).toReturn(-100)
    expectValidation(schema, -0).toReturn(-0)
    expectValidation(schema, 0).toReturn(0)
    expectValidation(schema, 100).toReturn(100)
    expectValidation(schema, 999999).toReturn(999999)
    expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
  })

  it('truncates when `input` is a float.', () => {
    expectValidation(schema, -999999.75).toReturn(-999999)
    expectValidation(schema, -100.5).toReturn(-100)
    expectValidation(schema, -0.25).toReturn(-0)
    expectValidation(schema, 0.25).toReturn(0)
    expectValidation(schema, 100.5).toReturn(100)
    expectValidation(schema, 999999.75).toReturn(999999)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.round()', () => {

  const base = NumberSchema.create()
  const schema = base.round()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NumberSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is an integer.', () => {
    expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
    expectValidation(schema, -999999).toReturn(-999999)
    expectValidation(schema, -100).toReturn(-100)
    expectValidation(schema, -0).toReturn(-0)
    expectValidation(schema, 0).toReturn(0)
    expectValidation(schema, 100).toReturn(100)
    expectValidation(schema, 999999).toReturn(999999)
    expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
  })

  it('rounds when `input` is a float.', () => {
    expectValidation(schema, -999999.75).toReturn(-1000000)
    expectValidation(schema, -100.55).toReturn(-101)
    expectValidation(schema, -0.25).toReturn(-0)
    expectValidation(schema, 0.25).toReturn(0)
    expectValidation(schema, 100.55).toReturn(101)
    expectValidation(schema, 999999.75).toReturn(1000000)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.floor()', () => {

  const base = NumberSchema.create()
  const schema = base.floor()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NumberSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is an integer.', () => {
    expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
    expectValidation(schema, -999999).toReturn(-999999)
    expectValidation(schema, -100).toReturn(-100)
    expectValidation(schema, -0).toReturn(-0)
    expectValidation(schema, 0).toReturn(0)
    expectValidation(schema, 100).toReturn(100)
    expectValidation(schema, 999999).toReturn(999999)
    expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
  })

  it('floors when `input` is a float.', () => {
    expectValidation(schema, -999999.75).toReturn(-1000000)
    expectValidation(schema, -100.5).toReturn(-101)
    expectValidation(schema, -0.25).toReturn(-1)
    expectValidation(schema, 0.25).toReturn(0)
    expectValidation(schema, 100.5).toReturn(100)
    expectValidation(schema, 999999.75).toReturn(999999)
  })
})

// METHOD ---------------------------------------------------------------------
describe('.ceil()', () => {

  const base = NumberSchema.create()
  const schema = base.ceil()

  it('returns a new instance of the schema.', () => {
    expect(schema).toBeInstanceOf(NumberSchema)
    expect(schema).not.toBe(base)
  })

  it('returns when `input` is an integer.', () => {
    expectValidation(schema, Number.MIN_SAFE_INTEGER).toReturn(Number.MIN_SAFE_INTEGER)
    expectValidation(schema, -999999).toReturn(-999999)
    expectValidation(schema, -100).toReturn(-100)
    expectValidation(schema, -0).toReturn(-0)
    expectValidation(schema, 0).toReturn(0)
    expectValidation(schema, 100).toReturn(100)
    expectValidation(schema, 999999).toReturn(999999)
    expectValidation(schema, Number.MAX_SAFE_INTEGER).toReturn(Number.MAX_SAFE_INTEGER)
  })

  it('ceils when `input` is a float.', () => {
    expectValidation(schema, -999999.75).toReturn(-999999)
    expectValidation(schema, -100.5).toReturn(-100)
    expectValidation(schema, -0.25).toReturn(-0)
    expectValidation(schema, 0.25).toReturn(1)
    expectValidation(schema, 100.5).toReturn(101)
    expectValidation(schema, 999999.75).toReturn(1000000)
  })
})
