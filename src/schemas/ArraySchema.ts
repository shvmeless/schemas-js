// IMPORTS
import { ValidationError } from '@/errors/ValidationError'
import type { GenericSchema } from '@/lib/GenericSchema'
import { stringify } from '@/utils/stringify'

// CLASS
export class ArraySchema<TItem> implements GenericSchema<Array<TItem>> {

  // PROPERTIES
  private readonly _schema: GenericSchema<TItem>
  private readonly _validations: Array<(initial: Array<TItem>, current: Array<TItem>) => undefined>
  private readonly _prune: boolean

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<TItem>, validations: Array<(initial: Array<TItem>, current: Array<TItem>) => undefined>, prune: boolean) {
    this._schema = schema
    this._validations = validations
    this._prune = prune
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TItem>(schema: GenericSchema<TItem>): ArraySchema<TItem> {
    return new ArraySchema<TItem>(schema, [], false)
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private clone(params: {
    schema?: GenericSchema<TItem>
    validations?: Array<(initial: Array<TItem>, current: Array<TItem>) => undefined>
    prune?: boolean
  } = {}): ArraySchema<TItem> {
    return new ArraySchema<TItem>(
      params.schema ?? this._schema,
      params.validations ?? this._validations,
      params.prune ?? this._prune,
    )
  }

  // UPDATER
  private push(fn: (initial: Array<TItem>, current: Array<TItem>) => undefined): ArraySchema<TItem> {
    return new ArraySchema<TItem>(this._schema, [...this._validations, fn], this._prune)
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Array<TItem> {

    if (!Array.isArray(input)) {
      throw new ValidationError(input, 'The value must be an array.')
    }

    const result: Array<TItem> = []
    const errors = ValidationError.prepare()

    input.forEach((element, index) => {
      try {
        const value = this._schema.validate(element)
        result.push(value)
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

    for (const fn of this._validations) {
      fn(input as Array<TItem>, result)
    }

    return result

  }

  // --------------------------------------------------------------------------

  // METHOD
  public prune(): ArraySchema<TItem> {
    return this.clone({ prune: true })
  }

  // METHOD
  public length(length: number): ArraySchema<TItem> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (current.length !== length) throw new ValidationError(initial, `The value must be ${stringify(length)} elements long.`)
    })
  }

  // METHOD
  public min(length: number): ArraySchema<TItem> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (current.length < length) throw new ValidationError(initial, `The value must be at least ${stringify(length)} elements long.`)
    })
  }

  // METHOD
  public max(length: number): ArraySchema<TItem> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this.push((initial, current) => {
      if (current.length > length) throw new ValidationError(initial, `The value must be at most ${stringify(length)} elements long.`)
    })
  }

  // METHOD
  public some(callback: (value: TItem, index: number, array: Array<TItem>) => boolean): ArraySchema<TItem> {
    return this.push((initial, current) => {
      for (let index = 0; index < current.length; index++) {
        const value = current[index] as TItem
        if (callback(value, index, current)) return
      }
      throw new ValidationError(initial, 'No element satisfies the given validation function.')
    })
  }

  // METHOD
  public every(callback: (value: TItem, index: number, array: Array<TItem>) => boolean): ArraySchema<TItem> {
    return this.push((initial, current) => {
      for (let index = 0; index < current.length; index++) {
        const value = current[index] as TItem
        if (!callback(value, index, current)) throw new ValidationError(initial, 'At least one element does not satisfy the given validation function.')
      }
    })
  }

  // METHOD
  public none(callback: (value: TItem, index: number, array: Array<TItem>) => boolean): ArraySchema<TItem> {
    return this.push((initial, current) => {
      for (let index = 0; index < current.length; index++) {
        const value = current[index] as TItem
        if (callback(value, index, current)) throw new ValidationError(initial, 'At least one element satisfies the given validation function.')
      }
    })
  }

}
