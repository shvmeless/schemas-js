// IMPORTS
import { describe, it } from 'vitest'
import { ObjectSchema } from '@/schemas/ObjectSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { ArraySchema } from '@/schemas/ArraySchema'
import { TupleSchema } from '@/schemas/TupleSchema'
import { RecordSchema } from '@/schemas/RecordSchema'
import { MapSchema } from '@/schemas/MapSchema'
import { SetSchema } from '@/schemas/SetSchema'
import { expectValidation } from '@tests/helpers/expect'

// METHOD
describe('ValidationErrorIndex', () => {

  const schema = ObjectSchema.create({
    string: StringSchema.create(),
    number: NumberSchema.create(),
    boolean: BooleanSchema.create(),
    array: ArraySchema.create(StringSchema.create()),
    tuple: TupleSchema.create([StringSchema.create(), NumberSchema.create(), BooleanSchema.create()]),
    record: RecordSchema.create(NumberSchema.create()),
    object: ObjectSchema.create({
      string: StringSchema.create(),
      number: NumberSchema.create(),
      boolean: BooleanSchema.create(),
    }),
    map: MapSchema.create(StringSchema.create(), NumberSchema.create()),
    set: SetSchema.create(StringSchema.create()),
  })

  it('contains a deep index for each element that fails.', () => {

    const input = {
      string: 255,
      number: 'NOT A NUMBER',
      boolean: 'NOT A BOOLEAN',
      array: [100, 200, 300],
      tuple: [true, 'NOT A NUMBER', 255],
      record: { a: '1', b: '2', c: '3' },
      object: {
        string: true,
        number: 'NOT A NUMBER',
        boolean: 255,
      },
      map: new Map([['a', '1'], ['b', '2'], ['c', '3']]),
      set: new Set([100, 200, 300]),
    }

    expectValidation(schema, input).toThrow('At least one property does not match the given schema.', [
      ['string', {
        value: 255,
        message: 'The value must be a string.',
      }],
      ['number', {
        value: 'NOT A NUMBER',
        message: 'The value must be a number.',
      }],
      ['boolean', {
        value: 'NOT A BOOLEAN',
        message: 'The value must be a boolean.',
      }],
      ['array', {
        value: [100, 200, 300],
        message: 'At least one element does not match the given schema.',
        index: new Map([
          [0, { value: 100, message: 'The value must be a string.', index: null }],
          [1, { value: 200, message: 'The value must be a string.', index: null }],
          [2, { value: 300, message: 'The value must be a string.', index: null }],
        ]),
      }],
      ['tuple', {
        value: [true, 'NOT A NUMBER', 255],
        message: 'At least one element does not match the given schema.',
        index: new Map([
          [0, { value: true, message: 'The value must be a string.', index: null }],
          [1, { value: 'NOT A NUMBER', message: 'The value must be a number.', index: null }],
          [2, { value: 255, message: 'The value must be a boolean.', index: null }],
        ]),
      }],
      ['record', {
        value: { a: '1', b: '2', c: '3' },
        message: 'At least one entry does not match the given schema.',
        index: new Map([
          ['a', { value: '1', message: 'The value must be a number.', index: null }],
          ['b', { value: '2', message: 'The value must be a number.', index: null }],
          ['c', { value: '3', message: 'The value must be a number.', index: null }],
        ]),
      }],
      ['object', {
        value: { string: true, number: 'NOT A NUMBER', boolean: 255 },
        message: 'At least one property does not match the given schema.',
        index: new Map([
          ['string', { value: true, message: 'The value must be a string.', index: null }],
          ['number', { value: 'NOT A NUMBER', message: 'The value must be a number.', index: null }],
          ['boolean', { value: 255, message: 'The value must be a boolean.', index: null }],
        ]),
      }],
      ['map', {
        value: new Map([['a', '1'], ['b', '2'], ['c', '3']]),
        message: 'At least one entry does not match the given schema.',
        index: new Map([
          ['a', { value: '1', message: 'The value must be a number.', index: null }],
          ['b', { value: '2', message: 'The value must be a number.', index: null }],
          ['c', { value: '3', message: 'The value must be a number.', index: null }],
        ]),
      }],
      ['set', {
        value: new Set([100, 200, 300]),
        message: 'At least one element does not match the given schema.',
        index: new Map([
          [100, { value: 100, message: 'The value must be a string.', index: null }],
          [200, { value: 200, message: 'The value must be a string.', index: null }],
          [300, { value: 300, message: 'The value must be a string.', index: null }],
        ]),
      }],
    ])

  })

})
