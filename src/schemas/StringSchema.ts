// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Optional } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type StringValidations = GenericValidations<'length' | 'min' | 'max' | 'casing' | 'trim' | 'prefix' | 'suffix' | 'includes' | 'excludes' | 'pattern', string>

// INTERFACE
interface StringConfig<TOptional extends boolean> {
  optional: TOptional
}

// CLASS
export class StringSchema<TOptional extends boolean>
implements GenericSchema<Optional<string, TOptional>> {

  // PROPERTIES
  private readonly _config: StringConfig<TOptional>
  private readonly _validations: StringValidations

  // CONSTRUCTOR
  private constructor(config: StringConfig<TOptional>, validations: StringValidations) {
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): StringSchema<false> {
    return new StringSchema({ optional: false }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateValidation(validations: StringValidations): StringSchema<TOptional> {
    return new StringSchema(this._config, { ...this._validations, ...validations })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Optional<string, TOptional> {

    if (input === undefined && this._config.optional) return input as Optional<string, TOptional>

    if (typeof input !== 'string') {
      throw new ValidationError(input, 'The value must be a string.')
    }

    runValidations(this._validations, input, input)

    return input as Optional<string, TOptional>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): StringSchema<true> {
    return new StringSchema({ ...this._config, optional: true }, this._validations)
  }

  // METHOD
  public length(length: number): StringSchema<TOptional> {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      min: undefined,
      max: undefined,
      length: (current, initial) => {
        if (current.length === length) return
        throw new ValidationError(initial, `The value must be ${stringify(length)} characters long.`)
      },
    })
  }

  // METHOD
  public min(length: number): StringSchema<TOptional> {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      min: (current, initial) => {
        if (current.length >= length) return
        throw new ValidationError(initial, `The value must be at least ${stringify(length)} characters long.`)
      },
    })
  }

  // METHOD
  public max(length: number): StringSchema<TOptional> {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      max: (current, initial) => {
        if (current.length <= length) return
        throw new ValidationError(initial, `The value must be at most ${stringify(length)} characters long.`)
      },
    })
  }

  // METHOD
  public lowercase(): StringSchema<TOptional> {
    return this.updateValidation({
      casing: (current, initial) => {
        if (current.toLowerCase() === current) return
        throw new ValidationError(initial, 'The value must be lowercase.')
      },

    })
  }

  // METHOD
  public uppercase(): StringSchema<TOptional> {
    return this.updateValidation({
      casing: (current, initial) => {
        if (current.toUpperCase() === current) return
        throw new ValidationError(initial, 'The value must be uppercase.')
      },

    })
  }

  // METHOD
  public trim(): StringSchema<TOptional> {
    return this.updateValidation({
      trim: (current, initial) => {
        if (current.trim() === current) return
        throw new ValidationError(initial, 'The value must be trimmed.')
      },
    })
  }

  // METHOD
  public startsWith(prefix: string): StringSchema<TOptional> {
    return this.updateValidation({
      prefix: (current, initial) => {
        if (current.startsWith(prefix)) return
        throw new ValidationError(initial, `The value must start with ${stringify(prefix)}.`)
      },
    })
  }

  // METHOD
  public endsWith(suffix: string): StringSchema<TOptional> {
    return this.updateValidation({
      suffix: (current, initial) => {
        if (current.endsWith(suffix)) return
        throw new ValidationError(initial, `The value must end with ${stringify(suffix)}.`)
      },
    })
  }

  // METHOD
  public includes(search: string): StringSchema<TOptional> {
    return this.updateValidation({
      includes: (current, initial) => {
        if (current.includes(search)) return
        throw new ValidationError(initial, `The value must include ${stringify(search)}.`)
      },
    })
  }

  // METHOD
  public excludes(search: string): StringSchema<TOptional> {
    return this.updateValidation({
      excludes: (current, initial) => {
        if (!current.includes(search)) return
        throw new ValidationError(initial, `The value must not include ${stringify(search)}.`)
      },
    })
  }

  // METHOD
  public match(pattern: RegExp): StringSchema<TOptional> {
    return this.updateValidation({
      pattern: (current, initial) => {
        if (pattern.test(current)) return
        throw new ValidationError(initial, `The value must match the pattern ${stringify(pattern)}.`)
      },
    })
  }

}
