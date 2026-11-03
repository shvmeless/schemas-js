// IMPORTS
import { describe, expectTypeOf, it } from 'vitest'
import { schemas } from '@/index'
import { ObjectSchema } from '@/classes'

// METHOD ---------------------------------------------------------------------
describe('type inference', () => {

  it('propagates `optional()` through container outputs.', () => {
    expectTypeOf(schemas.object({ a: schemas.string().optional() }).validate({})).toEqualTypeOf<{ a: string | undefined }>()
    expectTypeOf(schemas.array(schemas.string().optional()).validate([])).toEqualTypeOf<Array<string | undefined>>()
    expectTypeOf(schemas.tuple([schemas.string().optional()]).validate([])).toEqualTypeOf<readonly [string | undefined]>()
    expectTypeOf(schemas.record(schemas.string().optional()).validate({})).toEqualTypeOf<Record<string, string | undefined>>()
    expectTypeOf(schemas.set(schemas.string().optional()).validate(new Set())).toEqualTypeOf<Set<string | undefined>>()
    expectTypeOf(schemas.map(schemas.string().optional(), schemas.number()).validate(new Map())).toEqualTypeOf<Map<string | undefined, number>>()
  })

  it('propagates `nullable()` through container outputs.', () => {
    expectTypeOf(schemas.object({ a: schemas.string().nullable() }).validate({ a: 'x' })).toEqualTypeOf<{ a: string | null }>()
    expectTypeOf(schemas.array(schemas.string().nullable()).validate([])).toEqualTypeOf<Array<string | null>>()
    expectTypeOf(schemas.tuple([schemas.string().nullable()]).validate(['x'])).toEqualTypeOf<readonly [string | null]>()
    expectTypeOf(schemas.record(schemas.string().nullable()).validate({})).toEqualTypeOf<Record<string, string | null>>()
    expectTypeOf(schemas.set(schemas.string().nullable()).validate(new Set())).toEqualTypeOf<Set<string | null>>()
    expectTypeOf(schemas.map(schemas.string(), schemas.number().nullable()).validate(new Map())).toEqualTypeOf<Map<string, number | null>>()
  })

  it('merges an indefinite amount of object schemas.', () => {
    const merged = ObjectSchema.merge(
      ObjectSchema.create({ a: schemas.string() }),
      ObjectSchema.create({ b: schemas.number() }),
      ObjectSchema.create({ c: schemas.boolean() }),
    )
    expectTypeOf(merged.validate({ a: 'x', b: 1, c: true })).toEqualTypeOf<{ a: string, b: number, c: boolean }>()
  })

  it('lets the last object schema override colliding keys.', () => {
    const merged = ObjectSchema.merge(
      ObjectSchema.create({ value: schemas.string(), keep: schemas.boolean() }),
      ObjectSchema.create({ value: schemas.number() }),
      ObjectSchema.create({ value: schemas.boolean() }),
    )
    expectTypeOf(merged.validate({ value: true, keep: true })).toEqualTypeOf<{ value: boolean, keep: boolean }>()
  })
})
