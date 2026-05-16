// TYPE
export type ValidationErrorIndex = Map<unknown, {
  value: unknown
  message: string
  index: ValidationErrorIndex | null
}>

// CLASS
class ValidationErrorPreparator {

  // PROPERTIES
  private readonly index: ValidationErrorIndex

  // CONSTRUCTOR
  public constructor() {
    this.index = new Map()
  }

  // METHOD
  public get size(): number {
    return this.index.size
  }

  // METHOD
  public add(index: unknown, error: ValidationError): void {
    this.index.set(index, {
      value: error.value,
      message: error.message,
      index: error.index,
    })
  }

  // METHOD
  public throw(input: unknown, message: string): ValidationError {
    throw new ValidationError(input, message, this.index)
  }

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

  // STATIC
  public static prepare(): ValidationErrorPreparator {
    return new ValidationErrorPreparator()
  }

}
