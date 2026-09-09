// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'
import { stringify } from '@/utils/stringify'

// CLASS
export class StringSchema implements GenericSchema<string> {

  // PROPERTIES
  private readonly _validations: Array<(initial: string, current: string) => undefined>

  // CONSTRUCTOR
  private constructor(validations: Array<(initial: string, current: string) => undefined>) {
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): StringSchema {
    return new StringSchema([])
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private push(fn: (initial: string, current: string) => undefined): StringSchema {
    return new StringSchema([...this._validations, fn])
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): string {

    if (typeof input !== 'string') {
      throw new ValidationError(input, 'The value must be a string.')
    }

    for (const fn of this._validations) {
      fn(input, input)
    }

    return input

  }

  // --------------------------------------------------------------------------

  // METHOD
  public length(length: number): StringSchema {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (current.length === length) return
      throw new ValidationError(initial, `The value must be ${stringify(length)} characters long.`)
    })
  }

  // METHOD
  public min(length: number): StringSchema {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (current.length >= length) return
      throw new ValidationError(initial, `The value must be at least ${stringify(length)} characters long.`)
    })
  }

  // METHOD
  public max(length: number): StringSchema {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (current.length <= length) return
      throw new ValidationError(initial, `The value must be at most ${stringify(length)} characters long.`)
    })
  }

  // METHOD
  public lowercase(): StringSchema {
    return this.push((initial, current) => {
      if (current.toLowerCase() === current) return
      throw new ValidationError(initial, 'The value must be lowercase.')
    })
  }

  // METHOD
  public uppercase(): StringSchema {
    return this.push((initial, current) => {
      if (current.toUpperCase() === current) return
      throw new ValidationError(initial, 'The value must be uppercase.')
    })
  }

  // METHOD
  public trim(): StringSchema {
    return this.push((initial, current) => {
      if (current.trim() === current) return
      throw new ValidationError(initial, 'The value must be trimmed.')
    })
  }

  // METHOD
  public startsWith(prefix: string): StringSchema {
    return this.push((initial, current) => {
      if (current.startsWith(prefix)) return
      throw new ValidationError(initial, `The value must start with ${stringify(prefix)}.`)
    })
  }

  // METHOD
  public endsWith(suffix: string): StringSchema {
    return this.push((initial, current) => {
      if (current.endsWith(suffix)) return
      throw new ValidationError(initial, `The value must end with ${stringify(suffix)}.`)
    })
  }

  // METHOD
  public includes(search: string): StringSchema {
    return this.push((initial, current) => {
      if (current.includes(search)) return
      throw new ValidationError(initial, `The value must include ${stringify(search)}.`)
    })
  }

  // METHOD
  public excludes(search: string): StringSchema {
    return this.push((initial, current) => {
      if (!current.includes(search)) return
      throw new ValidationError(initial, `The value must not include ${stringify(search)}.`)
    })
  }

  // METHOD
  public match(pattern: RegExp): StringSchema {
    return this.push((initial, current) => {
      if (pattern.test(current)) return
      throw new ValidationError(initial, `The value must match the pattern ${stringify(pattern)}.`)
    })
  }

}
