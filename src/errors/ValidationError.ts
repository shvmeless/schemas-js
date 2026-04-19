// TYPE
export type ValidationErrorFields = {
  [key: string]: string | ValidationErrorFields
}

// ERROR
export class ValidationError extends Error {

  // PROPERTIES
  public readonly value: unknown
  public readonly fields: ValidationErrorFields | null

  // CONSTRUCTOR
  public constructor(value: unknown, message: string, fields?: ValidationErrorFields | null) {
    super(message)
    this.value = value
    this.fields = fields ?? null
  }

}
