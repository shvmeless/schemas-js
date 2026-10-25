// TYPE
export type ValidationErrorLocation = Map<unknown, {
  value: unknown
  message: string
  location: ValidationErrorLocation | null
}>

// CLASS
class ValidationErrorCollector {

  // PROPERTIES
  private readonly location: ValidationErrorLocation

  // CONSTRUCTOR
  public constructor() {
    this.location = new Map()
  }

  // METHOD
  public get size(): number {
    return this.location.size
  }

  // METHOD
  public add(location: unknown, error: ValidationError): void {
    this.location.set(location, {
      value: error.value,
      message: error.message,
      location: error.location,
    })
  }

  // METHOD
  public throw(input: unknown, message: string): ValidationError {
    throw new ValidationError(input, message, this.location)
  }

}

// ERROR
export class ValidationError extends Error {

  // PROPERTIES
  public override readonly name = 'ValidationError'

  // PROPERTIES
  public readonly value: unknown
  public readonly location: ValidationErrorLocation | null

  // CONSTRUCTOR
  public constructor(value: unknown, message: string, location?: ValidationErrorLocation | null) {
    super(message)
    this.value = value
    this.location = location ?? null
  }

  // STATIC
  public static prepare(): ValidationErrorCollector {
    return new ValidationErrorCollector()
  }

}
