// IMPORTS
import { expect } from 'vitest'
import { ValidationError, type ValidationErrorFields } from '@/errors/ValidationError'
import { GenericSchema } from '@/interfaces'

// INTERFACE
interface ExpectSchemaResult {
  toThrow(input: unknown): void
}

// FUNCTION
export function expectSchema(schema: GenericSchema<unknown>, input: unknown): ExpectSchemaResult {
  return {
    toThrow(message: string, fields?: ValidationErrorFields | null): void {
      try {
        schema.validate(input)
        expect.unreachable('Expected validation to throw an error.')
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ValidationError)
        const e = error as ValidationError
        expect(e.value).toBe(input)
        expect(e.message).toBe(message)
        expect(e.fields).toStrictEqual(fields ?? null)
      }
    },
  }
}
