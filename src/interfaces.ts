// INTERFACE
export interface GenericSchema<T> {
  validate(input: unknown): T
}
