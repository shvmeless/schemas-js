/* eslint-disable @typescript-eslint/consistent-return */

// IMPORTS
import { expect } from 'vitest'
import type { GenericSchema } from '@/schemas/GenericSchema'
import { ValidationError, type ValidationErrorIndex } from '@/errors/ValidationError'

// INTERFACE
interface ExpectSchemaResult {
  toReturn(value: unknown): void
  notToReturn(value: unknown): void
  toReturnInstanceOf(value: unknown): void
  toThrow(message: string, index?: Array<[unknown, {
    value: unknown
    message: string
    index?: ValidationErrorIndex | null
  }]>): void
}

// FUNCTION
export function expectSchema(schema: GenericSchema<unknown>, input: unknown): ExpectSchemaResult {
  return {
    toReturn(value: unknown): void {
      const result = schema.validate(input)
      expect(result).toEqual(value)
    },
    notToReturn(value: unknown): void {
      const result = schema.validate(input)
      expect(result).not.toBe(value)
    },
    toReturnInstanceOf(value: unknown): void {
      const result = schema.validate(input)
      expect(result).toBeInstanceOf(value)
    },
    toThrow(message: string, index?: Array<[unknown, {
      value: unknown
      message: string
      index?: ValidationErrorIndex | null
    }]>): void {
      try {

        schema.validate(input)
        expect.unreachable('Expected validation to throw an error.')

      } catch (error: unknown) {

        expect(error).toBeInstanceOf(ValidationError)
        const e = error as ValidationError

        index?.forEach(([, index]) => {
          index.index ??= null
        })

        expect(e.value).toBe(input)
        expect(e.message).toBe(message)
        expect(e.index).toStrictEqual(index ? new Map(index) : null)

      }
    },
  }
}

// FUNCTION
export function expectError(fn: () => void): { toHaveMessage(message: string): void } {
  let error: Error
  try {
    fn()
    expect.unreachable('Expected to throw an error.')
  } catch (e: unknown) {
    expect(e).toBeInstanceOf(Error)
    error = e as Error
    return {
      toHaveMessage(message: string): void {
        expect(error.message).toBe(message)
      },
    }
  }
}
