// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, NullishSchema, Nullish } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type ArrayValidations<TItem> = GenericValidations<'length' | 'min' | 'max' | 'some' | 'every' | 'none', Array<TItem>>

// INTERFACE
interface ArrayConfig<TItem> {
  schema: GenericSchema<TItem>
  prune: boolean
  optional: boolean
  nullable: boolean
  default: Array<TItem> | null
  fallback: Array<TItem> | null
}

// CLASS
export class ArraySchema<TItem, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
implements NullishSchema<Array<TItem>, TOptional, TNullable, TDefault> {

  // PROPERTIES
  private readonly _config: ArrayConfig<TItem>
  private readonly _validations: ArrayValidations<TItem>

  // CONSTRUCTOR
  private constructor(config: ArrayConfig<TItem>, validations: ArrayValidations<TItem>) {
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TItem>(schema: GenericSchema<TItem>): ArraySchema<TItem, false, false, false> {
    return new ArraySchema({
      schema: schema,
      prune: false,
      optional: false,
      nullable: false,
      default: null,
      fallback: null,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateValidation(validations: ArrayValidations<TItem>): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return new ArraySchema(
      this._config,
      { ...this._validations, ...validations },
    )
  }

  // --------------------------------------------------------------------------

  // PRIVATE
  private _resolveInput(input: unknown): Array<unknown> | null | undefined {

    if (input === undefined && this._config.optional) {
      return (this._config.default !== null) ? this._config.default : undefined
    }

    if (input === null && this._config.nullable) {
      return (this._config.default !== null) ? this._config.default : null
    }

    if (!Array.isArray(input)) {
      throw new ValidationError(input, 'The value must be an array.')
    }

    return input as Array<unknown>

  }

  // VALIDATOR
  public validate(input: unknown): Nullish<Array<TItem>, TOptional, TNullable, TDefault> {
    type Output = Nullish<Array<TItem>, TOptional, TNullable, TDefault>
    try {

      const resolved = this._resolveInput(input)

      if (resolved === undefined) return undefined as Output
      if (resolved === null) return null as Output

      const output: Array<TItem> = []
      const errors = ValidationError.prepare()

      resolved.forEach((element, index) => {
        try {
          const value = this._config.schema.validate(element)
          output.push(value)
        } catch (error) {
          if (error instanceof ValidationError) {
            if (this._config.prune) return
            errors.add(index, error)
          } else throw error
        }
      })

      if (errors.size > 0) {
        errors.throw(input, 'At least one element does not match the given schema.')
      }

      runValidations(this._validations, input, output)

      return output as Output

    } catch (error) {
      if (this._config.fallback !== null) return this._config.fallback
      throw error
    }
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public prune(): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return new ArraySchema({
      ...this._config,
      prune: true,
    }, this._validations)
  }

  // CONFIG
  public optional(): ArraySchema<TItem, true, TNullable, TDefault> {
    return new ArraySchema({
      ...this._config,
      optional: true,
    }, this._validations)
  }

  // CONFIG
  public nullable(): ArraySchema<TItem, TOptional, true, TDefault> {
    return new ArraySchema({
      ...this._config,
      nullable: true,
    }, this._validations)
  }

  // CONFIG
  public default(value: Array<TItem>): ArraySchema<TItem, TOptional, TNullable, true> {
    return new ArraySchema({
      ...this._config,
      default: value,
    }, this._validations)
  }

  // CONFIG
  public fallback(value: Array<TItem>): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return new ArraySchema({
      ...this._config,
      fallback: value,
    }, this._validations)
  }

  // --------------------------------------------------------------------------

  // METHOD
  public length(length: number): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      min: undefined,
      max: undefined,
      length: (current, initial) => {
        if (current.length === length) return
        throw new ValidationError(initial, `The value must be ${stringify(length)} elements long.`)
      },
    })
  }

  // METHOD
  public min(length: number): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      min: (current, initial) => {
        if (current.length >= length) return
        throw new ValidationError(initial, `The value must be at least ${stringify(length)} elements long.`)
      },
    })
  }

  // METHOD
  public max(length: number): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.updateValidation({
      max: (current, initial) => {
        if (current.length <= length) return
        throw new ValidationError(initial, `The value must be at most ${stringify(length)} elements long.`)
      },
    })
  }

  // METHOD
  public some(callback: (value: TItem, index: number, array: Array<TItem>) => boolean): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return this.updateValidation({
      some: (current, initial) => {
        for (let index = 0; index < current.length; index++) {
          const value = current[index] as TItem
          if (callback(value, index, current)) return
        }
        throw new ValidationError(initial, 'No element satisfies the given validation function.')
      },
    })
  }

  // METHOD
  public every(callback: (value: TItem, index: number, array: Array<TItem>) => boolean): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return this.updateValidation({
      every: (current, initial) => {
        for (let index = 0; index < current.length; index++) {
          const value = current[index] as TItem
          if (!callback(value, index, current)) throw new ValidationError(initial, 'At least one element does not satisfy the given validation function.')
        }
      },
    })
  }

  // METHOD
  public none(callback: (value: TItem, index: number, array: Array<TItem>) => boolean): ArraySchema<TItem, TOptional, TNullable, TDefault> {
    return this.updateValidation({
      none: (current, initial) => {
        for (let index = 0; index < current.length; index++) {
          const value = current[index] as TItem
          if (callback(value, index, current)) throw new ValidationError(initial, 'At least one element satisfies the given validation function.')
        }
      },
    })
  }

}
