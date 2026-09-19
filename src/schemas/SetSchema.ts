// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import type { GenericSchema, TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'
import { stringify } from '@/utils/stringify'
import { UNSET } from '@/utils/unset'

// INTERFACE
interface SetConfig<TValue> extends NullishConfig<Set<TValue>> {
  schema: GenericSchema<TValue>
  prune: boolean
}

// CLASS
export class SetSchema<TValue, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<Set<TValue>, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: SetConfig<TValue>
  protected readonly _tests: TestObject<Set<TValue>>

  // CONSTRUCTOR
  private constructor(config: SetConfig<TValue>, tests: TestObject<Set<TValue>>) {
    super()
    this._config = config
    this._tests = tests
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue>(schema: GenericSchema<TValue>): SetSchema<TValue, false, false, false> {
    return new SetSchema<TValue, false, false, false>({
      schema: schema,
      prune: false,
      optional: false,
      nullable: false,
      default: UNSET,
      fallback: UNSET,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(config: Partial<SetConfig<TValue>>): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return new SetSchema(
      { ...this._config, ...config },
      this._tests,
    )
  }

  // UPDATER
  private _updateTests(tests: Partial<TestObject<Set<TValue>>>): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return new SetSchema<TValue, TOptional, TNullable, TDefault>(
      this._config,
      { ...this._tests, ...tests },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<Set<TValue>, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (!(current instanceof Set)) {
        throw new ValidationError(input, 'The value must be a Set.')
      }

      const resolved = current as Set<unknown>
      const result = new Set<TValue>()
      const errors = ValidationError.prepare()

      for (const element of resolved) {
        try {
          const value = this._config.schema.validate(element)
          result.add(value)
        } catch (error) {
          if (error instanceof ValidationError) {
            if (this._config.prune) continue
            errors.add(element, error)
          } else throw error
        }
      }

      if (errors.size > 0) {
        errors.throw(input, 'At least one element does not match the given schema.')
      }

      return result

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public prune(): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ prune: true })
  }

  // CONFIG
  public optional(): SetSchema<TValue, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): SetSchema<TValue, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: Set<TValue>): SetSchema<TValue, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: Set<TValue>): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // METHOD
  public size(length: number): SetSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      min: undefined,
      max: undefined,
      size: (current) => {
        if (current.size !== length) return `The value must be ${stringify(length)} elements long.`
        return null
      },
    })
  }

  // METHOD
  public min(length: number): SetSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      min: (current) => {
        if (current.size < length) return `The value must be at least ${stringify(length)} elements long.`
        return null
      },
    })
  }

  // METHOD
  public max(length: number): SetSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      max: (current) => {
        if (current.size > length) return `The value must be at most ${stringify(length)} elements long.`
        return null
      },
    })
  }

  // METHOD
  public some(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      some: (current) => {
        for (const value of current) {
          if (callback(value, current)) return null
        }
        return 'No element satisfies the given validation function.'
      },
    })
  }

  // METHOD
  public every(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      every: (current) => {
        for (const value of current) {
          if (!callback(value, current)) return 'At least one element does not satisfy the given validation function.'
        }
        return null
      },
    })
  }

  // METHOD
  public none(callback: (value: TValue, set: Set<TValue>) => boolean): SetSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      none: (current) => {
        for (const value of current) {
          if (callback(value, current)) return 'At least one element satisfies the given validation function.'
        }
        return null
      },
    })
  }

}
