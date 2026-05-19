// IMPORTS
import { inspect } from 'util'

// FUNCTION
export function stringify(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'boolean') return value.toString()
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (Array.isArray(value)) return value.map(stringify).join(', ')
  return inspect(value)
}
