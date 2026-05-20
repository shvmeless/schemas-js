// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import { GenericSchema } from '@/schemas/GenericSchema'
import { OptionalSchema } from '@/schemas/OptionalSchema'
import { NullableSchema } from '@/schemas/NullableSchema'
import { UnionSchema } from '@/schemas/UnionSchema'
import { FallbackSchema } from '@/schemas/FallbackSchema'
import { TransformSchema } from '@/schemas/TransformSchema'
import { stringify } from '@/utils/stringify'

// CLASS
export class StringSchema implements GenericSchema<string> {

  // PROPERTIES
  private readonly _queue: Array<(original: string, output: string) => string>

  // CONSTRUCTOR
  private constructor(queue: Array<(original: string, output: string) => string>) {
    this._queue = queue
  }

  // CONSTRUCTOR
  public static create(): StringSchema {
    return new StringSchema([])
  }

  // CONSTRUCTOR
  private push(fn: (original: string, output: string) => string): StringSchema {
    return new StringSchema([...this._queue, fn])
  }

  // METHOD
  public validate(input: unknown): string {

    if (typeof input !== 'string') {
      throw new ValidationError(input, 'The value must be a string.')
    }

    let output = input
    for (const fn of this._queue) {
      output = fn(input, output)
    }

    return output

  }

  // METHOD
  public isValid(input: unknown): boolean {
    return GenericSchema.isValid(this, input)
  }

  // METHOD
  public optional(): OptionalSchema<string, undefined> {
    return OptionalSchema.create(this)
  }

  // METHOD
  public nullable(): NullableSchema<string, null> {
    return NullableSchema.create(this)
  }

  // METHOD
  public or<NT>(schema: GenericSchema<NT>): UnionSchema<string | NT> {
    return UnionSchema.create(this as GenericSchema<string>, schema)
  }

  // METHOD
  public fallback(value: string): FallbackSchema<string> {
    return FallbackSchema.create(this, value)
  }

  // METHOD
  public transform<V>(fn: (value: string) => V): TransformSchema<string, V> {
    return TransformSchema.create(this, fn)
  }

  // METHOD
  public length(length: number): StringSchema {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.length === length) return output
      throw new ValidationError(original, `The value must be ${stringify(length)} characters long.`)
    })
  }

  // METHOD
  public min(length: number): StringSchema {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.length >= length) return output
      throw new ValidationError(original, `The value must be at least ${stringify(length)} characters long.`)
    })
  }

  // METHOD
  public max(length: number): StringSchema {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((original, output) => {
      if (output.length <= length) return output
      throw new ValidationError(original, `The value must be at most ${stringify(length)} characters long.`)
    })
  }

  // METHOD
  public lowercase(options: { fix?: boolean } = {}): StringSchema {
    return this.push((original, output) => {
      if (output.toLowerCase() === output) return output
      if (options.fix === true) return output.toLowerCase()
      throw new ValidationError(original, 'The value must be lowercase.')
    })
  }

  // METHOD
  public uppercase(options: { fix?: boolean } = {}): StringSchema {
    return this.push((original, output) => {
      if (output.toUpperCase() === output) return output
      if (options.fix === true) return output.toUpperCase()
      throw new ValidationError(original, 'The value must be uppercase.')
    })
  }

  // METHOD
  public trim(options: { fix?: boolean } = {}): StringSchema {
    return this.push((original, output) => {
      if (output.trim() === output) return output
      if (options.fix === true) return output.trim()
      throw new ValidationError(original, 'The value must be trimmed.')
    })
  }

  // METHOD
  public startsWith(prefix: string, options: { fix?: boolean } = {}): StringSchema {
    return this.push((original, output) => {
      if (output.startsWith(prefix)) return output
      if (options.fix === true) return (prefix + output)
      throw new ValidationError(original, `The value must start with "${prefix}".`)
    })
  }

  // METHOD
  public endsWith(suffix: string, options: { fix?: boolean } = {}): StringSchema {
    return this.push((original, output) => {
      if (output.endsWith(suffix)) return output
      if (options.fix === true) return (output + suffix)
      throw new ValidationError(original, `The value must end with "${suffix}".`)
    })
  }

}
