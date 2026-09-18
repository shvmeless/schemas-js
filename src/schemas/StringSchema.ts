// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import type { GenericValidations } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'
import { stringify } from '@/utils/stringify'

// TYPE
type StringValidations = GenericValidations<'length' | 'min' | 'max' | 'casing' | 'trim' | 'prefix' | 'suffix' | 'includes' | 'excludes' | 'pattern', string>

// CLASS
export class StringSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<string, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: NullishConfig<string>
  protected readonly _validations: StringValidations

  // CONSTRUCTOR
  private constructor(config: NullishConfig<string>, validations: StringValidations) {
    super()
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): StringSchema<false, false, false> {
    return new StringSchema({
      optional: false,
      nullable: false,
      default: undefined,
      fallback: undefined,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(config: Partial<NullishConfig<string>>): StringSchema<TOptional, TNullable, TDefault> {
    return new StringSchema(
      { ...this._config, ...config },
      this._validations,
    )
  }

  // UPDATER
  private _updateValidation(validations: StringValidations): StringSchema<TOptional, TNullable, TDefault> {
    return new StringSchema(
      this._config,
      { ...this._validations, ...validations },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<string, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (typeof current !== 'string') {
        throw new ValidationError(input, 'The value must be a string.')
      }

      return current

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public optional(): StringSchema<true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): StringSchema<TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: string): StringSchema<TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: string): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // METHOD
  public length(length: number): StringSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateValidation({
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
    return this._updateValidation({
      min: (current, initial) => {
        if (current.length >= length) return
        throw new ValidationError(initial, `The value must be at least ${stringify(length)} characters long.`)
      },
    })
  }

  // METHOD
  public max(length: number): StringSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateValidation({
      max: (current, initial) => {
        if (current.length <= length) return
        throw new ValidationError(initial, `The value must be at most ${stringify(length)} characters long.`)
      },
    })
  }

  // METHOD
  public lowercase(): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      casing: (current, initial) => {
        if (current.toLowerCase() === current) return
        throw new ValidationError(initial, 'The value must be lowercase.')
      },

    })
  }

  // METHOD
  public uppercase(): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      casing: (current, initial) => {
        if (current.toUpperCase() === current) return
        throw new ValidationError(initial, 'The value must be uppercase.')
      },

    })
  }

  // METHOD
  public trim(): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      trim: (current, initial) => {
        if (current.trim() === current) return
        throw new ValidationError(initial, 'The value must be trimmed.')
      },
    })
  }

  // METHOD
  public startsWith(prefix: string): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      prefix: (current, initial) => {
        if (current.startsWith(prefix)) return
        throw new ValidationError(initial, `The value must start with ${stringify(prefix)}.`)
      },
    })
  }

  // METHOD
  public endsWith(suffix: string): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      suffix: (current, initial) => {
        if (current.endsWith(suffix)) return
        throw new ValidationError(initial, `The value must end with ${stringify(suffix)}.`)
      },
    })
  }

  // METHOD
  public includes(search: string): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      includes: (current, initial) => {
        if (current.includes(search)) return
        throw new ValidationError(initial, `The value must include ${stringify(search)}.`)
      },
    })
  }

  // METHOD
  public excludes(search: string): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      excludes: (current, initial) => {
        if (!current.includes(search)) return
        throw new ValidationError(initial, `The value must not include ${stringify(search)}.`)
      },
    })
  }

  // METHOD
  public match(pattern: RegExp): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateValidation({
      pattern: (current, initial) => {
        if (pattern.test(current)) return
        throw new ValidationError(initial, `The value must match the pattern ${stringify(pattern)}.`)
      },
    })
  }

}
