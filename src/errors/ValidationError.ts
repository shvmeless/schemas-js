// TYPE
export type ValidationErrorIndex = Map<unknown, string | ValidationErrorIndex>

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
  public add(index: unknown, message: string): void {
    this.index.set(index, message)
  }

  // METHOD
  public addError(index: unknown, error: ValidationError): void {
    this.index.set(index, error.index ?? error.message)
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
