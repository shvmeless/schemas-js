// ENUM
type DataLabels = 'strings'
  | 'empty_strings'
  | 'numbers'
  | 'infinity_numbers'
  | 'unsafe_numbers'
  | 'finite_numbers'
  | 'negative_numbers'
  | 'positive_numbers'
  | 'nan'
  | 'booleans'
  | 'true'
  | 'false'
  | 'null'
  | 'undefined'
  | 'symbols'
  | 'objects'
  | 'arrays'
  | 'functions'
  | 'classes'

// CONSTANTS
const TYPES: Array<{ value: unknown, labels: Array<DataLabels> }> = [
  { value: 'string', labels: ['strings'] },
  { value: '', labels: ['strings', 'empty_strings'] },
  { value: -Infinity, labels: ['numbers', 'infinity_numbers', 'unsafe_numbers'] },
  { value: Number.MIN_SAFE_INTEGER - 1, labels: ['numbers', 'finite_numbers', 'unsafe_numbers'] },
  { value: -100, labels: ['numbers', 'finite_numbers', 'negative_numbers'] },
  { value: 0, labels: ['numbers', 'finite_numbers'] },
  { value: 100, labels: ['numbers', 'finite_numbers', 'positive_numbers'] },
  { value: Number.MAX_SAFE_INTEGER + 1, labels: ['numbers', 'finite_numbers', 'unsafe_numbers'] },
  { value: Infinity, labels: ['numbers', 'infinity_numbers', 'unsafe_numbers'] },
  { value: NaN, labels: ['numbers', 'nan'] },
  { value: true, labels: ['booleans', 'true'] },
  { value: false, labels: ['booleans', 'false'] },
  { value: null, labels: ['null'] },
  { value: undefined, labels: ['undefined'] },
  { value: Symbol('symbol'), labels: ['symbols'] },
  { value: { a: 1, b: 2, c: 3 }, labels: ['objects'] },
  { value: {}, labels: ['objects'] },
  { value: ['a', 'b', 'c'], labels: ['arrays'] },
  { value: [], labels: ['arrays'] },
  { value: function namedFunction(): void {}, labels: ['functions'] },
  { value: (): void => {}, labels: ['functions'] },
  { value: new Date(), labels: ['classes'] },
]

// CLASS
export class DataTypeGenerator {

  // PROPERTIES
  private readonly _skip: Set<DataLabels>

  // CONSTRUCTOR
  private constructor(...skip: Array<DataLabels>) {
    this._skip = new Set<DataLabels>()
    for (const label of skip) {
      this._skip.add(label)
    }
  }

  // CONSTRUCTOR
  public static forEach(callback: (value: unknown) => void): void {
    for (const { value } of TYPES) {
      callback(value)
    }
  }

  // CONSTRUCTOR
  public static skip(...skip: Array<DataLabels>): DataTypeGenerator {
    return new DataTypeGenerator(...skip)
  }

  // METHOD
  public forEach(callback: (value: unknown) => void): void {
    for (const { value, labels } of TYPES) {
      if (labels.some((label) => this._skip.has(label))) {
        continue
      }
      callback(value)
    }
  }

}
