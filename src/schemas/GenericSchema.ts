// INTERFACE
export interface GenericSchema<T> {

  // METHOD
  validate(input: unknown): T

}
