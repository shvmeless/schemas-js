// IMPORTS
import { expect } from 'vitest'
import { ValidationError, type ValidationErrorIndex } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'

// INTERFACE
interface ExpectSchemaResult {
  toThrow(message: string, fields?: Array<[unknown, string | ValidationErrorIndex]>): void
}

// FUNCTION
export function expectSchema(schema: GenericSchema<unknown>, input: unknown): ExpectSchemaResult {
  return {
    toThrow(message: string, fields?: Array<[unknown, string | ValidationErrorIndex]>): void {
      try {

        schema.validate(input)
        expect.unreachable('Expected validation to throw an error.')

      } catch (error: unknown) {

        expect(error).toBeInstanceOf(ValidationError)
        const e = error as ValidationError

        expect(e.value).toBe(input)
        expect(e.message).toBe(message)
        expect(e.index).toStrictEqual(fields ? new Map(fields) : null)

      }
    },
  }
}
