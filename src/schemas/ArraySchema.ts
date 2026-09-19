// IMPORTS
import type { Nullish } from '@/lib/NullishSchema'
import type { GenericSchema, TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'
import { stringify } from '@/utils/stringify'
import { type Unset, UNSET } from '@/utils/unset'

// INTERFACE
interface ArrayConfig<TItem> {
  schema: GenericSchema<TItem>
  prune: boolean
  optional: boolean
  nullable: boolean
  default: Array<TItem> | Unset
  fallback: Array<TItem> | Unset
}

// CLASS
export class ArraySchema<TItem, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<Array<TItem>, TOptional, TNullable, TDefault> {

  // CONFIG
  protected readonly _schema: GenericSchema<TItem>
  protected readonly _prune: boolean
  protected readonly _optional: boolean
  protected readonly _nullable: boolean
  protected readonly _default: Array<TItem> | Unset
  protected readonly _fallback: Array<TItem> | Unset

  // PIPELINE
  protected readonly _tests: TestObject<Array<TItem>>

  // CONSTRUCTOR
  private constructor(config: ArrayConfig<TItem>, tests: TestObject<Array<TItem>>) {
    super()
    this._schema = config.schema
    this._prune = config.prune
    this._optional = config.optional
    this._nullable = config.nullable
    this._default = config.default
    this._fallback = config.fallback
    this._tests = tests
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TItem>(schema: GenericSchema<TItem>): ArraySchema<TItem, false, false, false> {
    return new ArraySchema({
      schema: schema,
      prune: false,
      optional: false,
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UTILITY
  private get _configuration(): ArrayConfig<TItem> {
    return {
      schema: this._schema,
      prune: this._prune,
      optional: this._optional,
      nullable: this._nullable,
      default: this._default,
      fallback: this._fallback,
    }
  }

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(configuration: Partial<ArrayConfig<TItem>>): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return new ArraySchema({
      ...this._configuration,
      ...configuration,
    }, this._tests)
  }

  // UPDATER
  private _updateTests(tests: TestObject<Array<TItem>>): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return new ArraySchema(this._configuration, {
      ...this._tests,
      ...tests,
    })
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<Array<TItem>, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (!Array.isArray(current)) {
        throw new ValidationError(input, 'The value must be an array.')
      }

      const resolved = current as Array<unknown>
      const output: Array<TItem> = []
      const errors = ValidationError.prepare()

      resolved.forEach((element, index) => {
        try {
          const value = this._schema.validate(element)
          output.push(value)
        } catch (error) {
          if (error instanceof ValidationError) {
            if (this._prune) return
            errors.add(index, error)
          } else throw error
        }
      })

      if (errors.size > 0) {
        errors.throw(input, 'At least one element does not match the given schema.')
      }

      return output

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public prune(): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return this._updateConfig({ prune: true })
  }

  // CONFIG
  public optional(): ArraySchema<TItem, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): ArraySchema<TItem, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: Array<TItem>): ArraySchema<TItem, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: Array<TItem>): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // METHOD
  public length(length: number): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      min: undefined,
      max: undefined,
      length: (current) => {
        if (current.length !== length) return `The value must be ${stringify(length)} elements long.`
        return null
      },
    })
  }

  // METHOD
  public min(length: number): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      min: (current) => {
        if (current.length < length) return `The value must be at least ${stringify(length)} elements long.`
        return null
      },
    })
  }

  // METHOD
  public max(length: number): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      max: (current) => {
        if (current.length > length) return `The value must be at most ${stringify(length)} elements long.`
        return null
      },
    })
  }

  // METHOD
  public some(callback: (value: TItem, index: number, array: Array<TItem>) => boolean): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return this._updateTests({
      some: (current) => {
        for (let index = 0; index < current.length; index++) {
          const value = current[index] as TItem
          if (callback(value, index, current)) return null
        }
        return 'No element satisfies the given validation function.'
      },
    })
  }

  // METHOD
  public every(callback: (value: TItem, index: number, array: Array<TItem>) => boolean): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return this._updateTests({
      every: (current) => {
        for (let index = 0; index < current.length; index++) {
          const value = current[index] as TItem
          if (!callback(value, index, current)) return 'At least one element does not satisfy the given validation function.'
        }
        return null
      },
    })
  }

  // METHOD
  public none(callback: (value: TItem, index: number, array: Array<TItem>) => boolean): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return this._updateTests({
      none: (current) => {
        for (let index = 0; index < current.length; index++) {
          const value = current[index] as TItem
          if (callback(value, index, current)) return 'At least one element satisfies the given validation function.'
        }
        return null
      },
    })
  }

}
