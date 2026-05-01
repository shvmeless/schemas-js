// IMPORTS
import { describe, expect, it } from 'vitest'
import { TupleSchema } from '@/schemas/TupleSchema'
import { StringSchema } from '@/schemas/StringSchema'
import { NumberSchema } from '@/schemas/NumberSchema'
import { BooleanSchema } from '@/schemas/BooleanSchema'
import { DataTypeGenerator } from '@tests/helpers/generator'
import { expectSchema } from '@tests/helpers/expect'

// METHOD
describe('.create()', () => {

  const schema = TupleSchema.create([StringSchema.create(), NumberSchema.create(), BooleanSchema.create()])

  it('validates that each element matches its corresponding schema.', () => {
    const result = schema.validate(['STRING', 74105280, true])
    expect(result).toEqual(['STRING', 74105280, true])
  })

  it('throws when the input is not an array.', () => {
    DataTypeGenerator.skip('arrays').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be an array.')
    })
  })

  it('throws when the input contains fewer elements than expected.', () => {
    expectSchema(schema, ['STRING']).toThrow('The tuple is missing one or more required elements.', [
      [1, 'The value must be a number.'],
      [2, 'The value must be a boolean.'],
    ])
  })

  it('throws when the input contains more elements than expected.', () => {
    expectSchema(schema, ['STRING', 74105280, true, 'UNEXPECTED']).toThrow('The tuple contains one or more unexpected elements.', [
      [3, 'Unexpected element.'],
    ])
  })

})

// METHOD
describe('.skip()', () => {

  const schema = TupleSchema.create([StringSchema.create(), NumberSchema.create(), BooleanSchema.create()]).skip()

  it('validates that each element matches its corresponding schema.', () => {
    const result = schema.validate(['STRING', 74105280, true])
    expect(result).toEqual(['STRING', 74105280, true])
  })

  it('throws when the input is not an array.', () => {
    DataTypeGenerator.skip('arrays').forEach((value) => {
      expectSchema(schema, value).toThrow('The value must be an array.')
    })
  })

  it('throws when the input contains fewer elements than expected.', () => {
    expectSchema(schema, ['STRING']).toThrow('The tuple is missing one or more required elements.', [
      [1, 'The value must be a number.'],
      [2, 'The value must be a boolean.'],
    ])
  })

  it('strips unexpected elements from the input.', () => {
    const result = schema.validate(['STRING', 74105280, true, 'UNEXPECTED'])
    expect(result).toEqual(['STRING', 74105280, true])
  })

})
