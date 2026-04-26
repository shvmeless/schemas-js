// IMPORTS
import { GenericSchema } from '@/interfaces'

// CLASS
export class TransformSchema<T, V> implements GenericSchema<V> {

  // PROPERTIES
  private readonly _schema: GenericSchema<T>
  private readonly _transform: (input: T) => V

  // CONSTRUCTOR
  private constructor(schema: GenericSchema<T>, transform: (input: T) => V) {
    this._schema = schema
    this._transform = transform
  }

  // CONSTRUCTOR
  public static create<T, V>(schema: GenericSchema<T>, transform: (input: T) => V): TransformSchema<T, V> {
    return new TransformSchema(schema, transform)
  }

  // METHOD
  public validate(input: unknown): V {
    const result = this._schema.validate(input)
    return this._transform(result)
  }

}
