// IMPORTS
import { describe, expectTypeOf, it } from 'vitest'
import { schemas } from '@/index'

// METHOD ---------------------------------------------------------------------
describe('type inference', () => {

  it('propagates `optional()` through container outputs.', () => {
    expectTypeOf(schemas.object({ a: schemas.string().optional() }).validate({})).toEqualTypeOf<{ a: string | undefined }>()
    expectTypeOf(schemas.array(schemas.string().optional()).validate([])).toEqualTypeOf<Array<string | undefined>>()
    expectTypeOf(schemas.tuple([schemas.string().optional()]).validate([])).toEqualTypeOf<[string | undefined]>()
    expectTypeOf(schemas.record(schemas.string().optional()).validate({})).toEqualTypeOf<Record<string, string | undefined>>()
    expectTypeOf(schemas.set(schemas.string().optional()).validate(new Set())).toEqualTypeOf<Set<string | undefined>>()
    expectTypeOf(schemas.map(schemas.string().optional(), schemas.number()).validate(new Map())).toEqualTypeOf<Map<string | undefined, number>>()
  })

  it('propagates `nullable()` through container outputs.', () => {
    expectTypeOf(schemas.object({ a: schemas.string().nullable() }).validate({ a: 'x' })).toEqualTypeOf<{ a: string | null }>()
    expectTypeOf(schemas.array(schemas.string().nullable()).validate([])).toEqualTypeOf<Array<string | null>>()
    expectTypeOf(schemas.tuple([schemas.string().nullable()]).validate(['x'])).toEqualTypeOf<[string | null]>()
    expectTypeOf(schemas.record(schemas.string().nullable()).validate({})).toEqualTypeOf<Record<string, string | null>>()
    expectTypeOf(schemas.set(schemas.string().nullable()).validate(new Set())).toEqualTypeOf<Set<string | null>>()
    expectTypeOf(schemas.map(schemas.string(), schemas.number().nullable()).validate(new Map())).toEqualTypeOf<Map<string, number | null>>()
  })
})
