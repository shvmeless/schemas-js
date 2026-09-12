// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type StringValidations = GenericValidations<'length' | 'min' | 'max' | 'casing' | 'trim' | 'prefix' | 'suffix' | 'includes' | 'excludes' | 'pattern', string>

// INTERFACE
interface StringConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends string | null> {
  optional: TOptional
  nullable: TNullable
  default: TDefault
  fallback: string | null
}

// CLASS
export class StringSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends string | null>
implements GenericSchema<Maybe<string, TOptional, TNullable, TDefault>> {

  // PROPERTIES
  private readonly _config: StringConfig<TOptional, TNullable, TDefault>
  private readonly _validations: StringValidations

  // CONSTRUCTOR
  private constructor(config: StringConfig<TOptional, TNullable, TDefault>, validations: StringValidations) {
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): StringSchema<false, false, null> {
    return new StringSchema({ optional: false, nullable: false, default: null, fallback: null }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateValidation(validations: StringValidations): StringSchema<TOptional, TNullable, TDefault> {
    return new StringSchema(this._config, { ...this._validations, ...validations })
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _resolveInput(input: unknown): string | null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    if (typeof input !== 'string') {
      throw new ValidationError(input, 'The value must be a string.')
    }

    return input

  }

  // VALIDATOR
  public validate(input: unknown): Maybe<string, TOptional, TNullable, TDefault> {
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Maybe<string, TOptional, TNullable, TDefault>
      if (resolved === null) return null as Maybe<string, TOptional, TNullable, TDefault>

      runValidations(this._validations, input, resolved)

      return resolved as Maybe<string, TOptional, TNullable, TDefault>

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): StringSchema<true, TNullable, TDefault> {
    return new StringSchema({ ...this._config, optional: true }, this._validations)
  }

  // CONFIG
  public nullable(): StringSchema<TOptional, true, TDefault> {
    return new StringSchema({ ...this._config, nullable: true }, this._validations)
  }

  // CONFIG
  public default(value: string): StringSchema<TOptional, TNullable, string> {
    return new StringSchema({
      ...this._config,
      default: value,
    }, this._validations)
  }

  // CONFIG
  public fallback(value: string): StringSchema<TOptional, TNullable, TDefault> {
    return new StringSchema({
      ...this._config,
      fallback: value,
    }, this._validations)
  }

  // --------------------------------------------------------------------------

  // METHOD
  public length(length: number): StringSchema<TOptional, TNullable, TDefault> {
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
  public min(length: number): StringSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      min: (current, initial) => {
        if (current.length >= length) return
        throw new ValidationError(initial, `The value must be at least ${stringify(length)} characters long.`)
      },
    })
  }

  // METHOD
  public max(length: number): StringSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      max: (current, initial) => {
        if (current.length <= length) return
        throw new ValidationError(initial, `The value must be at most ${stringify(length)} characters long.`)
      },
    })
  }

  // METHOD
  public lowercase(): StringSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      casing: (current, initial) => {
        if (current.toLowerCase() === current) return
        throw new ValidationError(initial, 'The value must be lowercase.')
      },

    })
  }

  // METHOD
  public uppercase(): StringSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      casing: (current, initial) => {
        if (current.toUpperCase() === current) return
        throw new ValidationError(initial, 'The value must be uppercase.')
      },

    })
  }

  // METHOD
  public trim(): StringSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      trim: (current, initial) => {
        if (current.trim() === current) return
        throw new ValidationError(initial, 'The value must be trimmed.')
      },
    })
  }

  // METHOD
  public startsWith(prefix: string): StringSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      prefix: (current, initial) => {
        if (current.startsWith(prefix)) return
        throw new ValidationError(initial, `The value must start with ${stringify(prefix)}.`)
      },
    })
  }

  // METHOD
  public endsWith(suffix: string): StringSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      suffix: (current, initial) => {
        if (current.endsWith(suffix)) return
        throw new ValidationError(initial, `The value must end with ${stringify(suffix)}.`)
      },
    })
  }

  // METHOD
  public includes(search: string): StringSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      includes: (current, initial) => {
        if (current.includes(search)) return
        throw new ValidationError(initial, `The value must include ${stringify(search)}.`)
      },
    })
  }

  // METHOD
  public excludes(search: string): StringSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      excludes: (current, initial) => {
        if (!current.includes(search)) return
        throw new ValidationError(initial, `The value must not include ${stringify(search)}.`)
      },
    })
  }

  // METHOD
  public match(pattern: RegExp): StringSchema<TOptional, TNullable, TDefault> {
    return this.updateValidation({
      pattern: (current, initial) => {
        if (pattern.test(current)) return
        throw new ValidationError(initial, `The value must match the pattern ${stringify(pattern)}.`)
      },
    })
  }

}
