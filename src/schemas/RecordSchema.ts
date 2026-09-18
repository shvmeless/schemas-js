// IMPORTS
import type { Nullish, NullishConfig } from '@/lib/NullishSchema'
import type { GenericSchema, TestObject } from '@/lib/GenericSchema'
import { ValidationError } from '@/errors/ValidationError'
import { NullishSchema } from '@/lib/NullishSchema'
import { stringify } from '@/utils/stringify'

// INTERFACE
interface RecordConfig<TValue> extends NullishConfig<Record<string, TValue>> {
  schema: GenericSchema<TValue>
  prune: boolean
}

// CLASS
export class RecordSchema<TValue, TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>
  extends NullishSchema<Record<string, TValue>, TOptional, TNullable, TDefault> {

  // PROPERTIES
  protected readonly _config: RecordConfig<TValue>
  protected readonly _tests: TestObject<Record<string, TValue>>

  // CONSTRUCTOR
  private constructor(config: RecordConfig<TValue>, tests: TestObject<Record<string, TValue>>) {
    super()
    this._config = config
    this._tests = tests
  }

  // --------------------------------------------------------------------------

  // FACTORY
  public static create<TValue>(schema: GenericSchema<TValue>): RecordSchema<TValue, false, false, false> {
    return new RecordSchema<TValue, false, false, false>({
      schema: schema,
      prune: false,
      optional: false,
      nullable: false,
      default: undefined,
      fallback: undefined,
    }, {})
  }

  // --------------------------------------------------------------------------

  // UPDATER
  private _updateConfig<TOptional extends boolean, TNullable extends boolean, TDefault extends boolean>(config: Partial<RecordConfig<TValue>>): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return new RecordSchema(
      { ...this._config, ...config },
      this._tests,
    )
  }

  // UPDATER
  private _updateTests(tests: Partial<TestObject<Record<string, TValue>>>): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return new RecordSchema<TValue, TOptional, TNullable, TDefault>(
      this._config,
      { ...this._tests, ...tests },
    )
  }

  // --------------------------------------------------------------------------

  // VALIDATOR
  public validate(input: unknown): Nullish<Record<string, TValue>, TOptional, TNullable, TDefault> {
    return this._runSchema((current) => {

      if (typeof current !== 'object' || current === null || Array.isArray(current) || (Object.getPrototypeOf(current) !== Object.prototype && Object.getPrototypeOf(current) !== null)) {
        throw new ValidationError(input, 'The value must be an object.')
      }

      const resolved = current as Record<string, unknown>
      const result: Record<string, TValue> = {}
      const errors = ValidationError.prepare()

      for (const [key, value] of Object.entries(resolved)) {
        try {
          result[key] = this._config.schema.validate(value)
        } catch (error) {
          if (error instanceof ValidationError) {
            if (this._config.prune) continue
            errors.add(key, error)
          } else throw error
        }
      }

      if (errors.size > 0) {
        errors.throw(input, 'At least one entry does not match the given schema.')
      }

      return result

    }, input)
  }

  // --------------------------------------------------------------------------

  // CONFIG
  public prune(): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ prune: true })
  }

  // CONFIG
  public optional(): RecordSchema<TValue, true, TNullable, TDefault> {
    return this._updateConfig({ optional: true })
  }

  // CONFIG
  public nullable(): RecordSchema<TValue, TOptional, true, TDefault> {
    return this._updateConfig({ nullable: true })
  }

  // CONFIG
  public default(value: Record<string, TValue>): RecordSchema<TValue, TOptional, TNullable, true> {
    return this._updateConfig({ default: value })
  }

  // CONFIG
  public fallback(value: Record<string, TValue>): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateConfig({ fallback: value })
  }

  // --------------------------------------------------------------------------

  // METHOD
  public length(length: number): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      min: undefined,
      max: undefined,
      length: (current) => {
        if (Object.entries(current).length !== length) return `The value must be ${stringify(length)} entries long.`
        return null
      },
    })
  }

  // METHOD
  public min(length: number): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      min: (current) => {
        if (Object.entries(current).length < length) return `The value must be at least ${stringify(length)} entries long.`
        return null
      },
    })
  }

  // METHOD
  public max(length: number): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    if (Number.isNaN(length)) throw new Error('The length value must be zero or positive.')
    if (length < 0) throw new Error('The length value must be zero or positive.')
    return this._updateTests({
      max: (current) => {
        if (Object.entries(current).length > length) return `The value must be at most ${stringify(length)} entries long.`
        return null
      },
    })
  }

  // METHOD
  public some(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      some: (current) => {
        for (const [key, value] of Object.entries(current)) {
          if (callback(value, key, current)) return null
        }
        return 'No entry satisfies the given validation function.'
      },
    })
  }

  // METHOD
  public every(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      every: (current) => {
        for (const [key, value] of Object.entries(current)) {
          if (!callback(value, key, current)) return 'At least one entry does not satisfy the given validation function.'
        }
        return null
      },
    })
  }

  // METHOD
  public none(callback: (value: TValue, key: string, record: Record<string, TValue>) => boolean): RecordSchema<TValue, TOptional, TNullable, TDefault> {
    return this._updateTests({
      none: (current) => {
        for (const [key, value] of Object.entries(current)) {
          if (callback(value, key, current)) return 'At least one entry satisfies the given validation function.'
        }
        return null
      },
    })
  }

}
