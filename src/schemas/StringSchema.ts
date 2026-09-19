// IMPORTS
import type { Nullish } from '@/lib/NullishSchema'
import type { TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'
import { stringify } from '@/utils/stringify'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface StringConfig {
  optional: boolean
  nullable: boolean
  default: string | Unset
  fallback: string | Unset
}

// CLASS
export class StringSchema<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<string, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: string | Unset
  protected readonly _fallback: string | Unset

  // PIPELINE
  protected readonly _tests: TestObject<string>

  // CONSTRUCTOR
  private constructor(config: StringConfig, tests: TestObject<string>) {
    super()
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
    this._tests = tests
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create(): StringSchema<false, false, false> {
    return new StringSchema({
      optional: false,
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UTILITY
  private get _configuration(): StringConfig {
    return {
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<StringConfig>): StringSchema<TOptional, TNullable, TDefault> {
    return new StringSchema({
      ...this._configuration,
      ...configuration,
    }, this._tests)
  }

  // UPDATER
  private _updateTests(tests: TestObject<string>): StringSchema<TOptional, TNullable, TDefault> {
    return new StringSchema(this._configuration, {
      ...this._tests,
      ...tests,
    })
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
    return this._updateTests({
      min: undefined,
      max: undefined,
      length: (current) => {
        if (current.length !== length) return `The value must be ${stringify(length)} characters long.`
        return null
      },
    })
  }

  // METHOD
  public min(length: number): StringSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      min: (current) => {
        if (current.length < length) return `The value must be at least ${stringify(length)} characters long.`
        return null
      },
    })
  }

  // METHOD
  public max(length: number): StringSchema<TOptional, TNullable, TDefault> {
    if (Number.isNaN(length) || length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      max: (current) => {
        if (current.length > length) return `The value must be at most ${stringify(length)} characters long.`
        return null
      },
    })
  }

  // METHOD
  public lowercase(): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      casing: (current) => {
        if (current.toLowerCase() !== current) return 'The value must be lowercase.'
        return null
      },

    })
  }

  // METHOD
  public uppercase(): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      casing: (current) => {
        if (current.toUpperCase() !== current) return 'The value must be uppercase.'
        return null
      },

    })
  }

  // METHOD
  public trim(): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      trim: (current) => {
        if (current.trim() !== current) return 'The value must be trimmed.'
        return null
      },
    })
  }

  // METHOD
  public startsWith(prefix: string): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      prefix: (current) => {
        if (!current.startsWith(prefix)) return `The value must start with ${stringify(prefix)}.`
        return null
      },
    })
  }

  // METHOD
  public endsWith(suffix: string): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      suffix: (current) => {
        if (!current.endsWith(suffix)) return `The value must end with ${stringify(suffix)}.`
        return null
      },
    })
  }

  // METHOD
  public includes(search: string): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      includes: (current) => {
        if (!current.includes(search)) return `The value must include ${stringify(search)}.`
        return null
      },
    })
  }

  // METHOD
  public excludes(search: string): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      excludes: (current) => {
        if (current.includes(search)) return `The value must not include ${stringify(search)}.`
        return null
      },
    })
  }

  // METHOD
  public match(pattern: RegExp): StringSchema<TOptional, TNullable, TDefault> {
    return this._updateTests({
      pattern: (current) => {
        if (!pattern.test(current)) return `The value must match the pattern ${stringify(pattern)}.`
        return null
      },
    })
  }

}
