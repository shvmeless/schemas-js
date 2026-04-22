// TYPE
export type ValidationErrorIndex = {
  [key: string]: string | ValidationErrorIndex
}

// ERROR
export class ValidationError extends Error {

  // PROPERTIES
  public readonly value: unknown
  public readonly index: ValidationErrorIndex | null

  // CONSTRUCTOR
  public constructor(value: unknown, message: string, index?: ValidationErrorIndex | null) {
    super(message)
    this.value = value
    this.index = index ?? null
  }

}
