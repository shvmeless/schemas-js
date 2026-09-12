// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema, Maybe } from '@/lib/GenericSchema'
import { runValidations, type GenericValidations } from '@/utils/validations'
import { stringify } from '@/utils/stringify'

// TYPE
type ArrayValidations<TItem> = GenericValidations<'length' | 'min' | 'max' | 'some' | 'every' | 'none', Array<TItem>>

// INTERFACE
interface ArrayConfig<TItem, TOptional extends boolean, TNullable extends boolean> {
  schema: GenericSchema<TItem>
  prune: boolean
  optional: TOptional
  nullable: TNullable
}

// CLASS
export class ArraySchema<TItem, TOptional extends boolean, TNullable extends boolean>
implements GenericSchema<Maybe<Array<TItem>, TOptional, TNullable>> {

  // PROPERTIES
  private readonly _config: ArrayConfig<TItem, TOptional, TNullable>
  private readonly _validations: ArrayValidations<TItem>

  // CONSTRUCTOR
  private constructor(config: ArrayConfig<TItem, TOptional, TNullable>, validations: ArrayValidations<TItem>) {
    this._config = config
    this._validations = validations
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TItem>(schema: GenericSchema<TItem>): ArraySchema<TItem, false, false> {
    return new ArraySchema({
      schema: schema,
      prune: false,
      optional: false,
      nullable: false,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private updateValidation(validations: ArrayValidations<TItem>): ArraySchema<TItem, TOptional, TNullable> {
    return new ArraySchema(
      this._config,
      { ...this._validations, ...validations },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Maybe<Array<TItem>, TOptional, TNullable> {

    if (input === undefined && this._config.optional) return input as Maybe<Array<TItem>, TOptional, TNullable>
    if (input === null && this._config.nullable) return input as Maybe<Array<TItem>, TOptional, TNullable>

    if (!Array.isArray(input)) {
      throw new ValidationError(input, 'The value must be an array.')
    }

    const output: Array<TItem> = []
    const errors = ValidationError.prepare()

    input.forEach((element, index) => {
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

    return output as Maybe<Array<TItem>, TOptional, TNullable>

  }

  // --------------------------------------------------------------------------

  // CONFIG
  public prune(): ArraySchema<TItem, TOptional, TNullable> {
    return new ArraySchema({
      ...this._config,
      prune: true,
    }, this._validations)
  }

  // CONFIG
  public optional(): ArraySchema<TItem, true, TNullable> {
    return new ArraySchema({
      ...this._config,
      optional: true,
    }, this._validations)
  }

  // CONFIG
  public nullable(): ArraySchema<TItem, TOptional, true> {
    return new ArraySchema({
      ...this._config,
      nullable: true,
    }, this._validations)
  }

  // --------------------------------------------------------------------------

  // METHOD
  public length(length: number): ArraySchema<TItem, TOptional, TNullable> {
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
  public min(length: number): ArraySchema<TItem, TOptional, TNullable> {
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
  public max(length: number): ArraySchema<TItem, TOptional, TNullable> {
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
  public some(callback: (value: TItem, index: number, array: Array<TItem>) => boolean): ArraySchema<TItem, TOptional, TNullable> {
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
  public every(callback: (value: TItem, index: number, array: Array<TItem>) => boolean): ArraySchema<TItem, TOptional, TNullable> {
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
  public none(callback: (value: TItem, index: number, array: Array<TItem>) => boolean): ArraySchema<TItem, TOptional, TNullable> {
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
