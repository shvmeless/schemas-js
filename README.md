# Schemas JS

A TypeScript type-safe schema declaration library for data validation with a fluent chainable API.

## Schema Functions

This package includes the following functions for creating schemas:

- **`any`** - Accepts any input and types it as `any`.
- **`unknown`** - Accepts any input and types it as `unknown`.
- **`string`** - Validates that the input is a string.
- **`number`** - Validates that the input is a number.
- **`boolean`** - Validates that the input is a boolean.
- **`literal`** - Validates that the input matches a specific literal value.
- **`enum`** - Validates that the input matches one of the provided literal values.
- **`null`** - Validates that the input is null.
- **`undefined`** - Validates that the input is undefined.
- **`instanceOf`** - Validates that the input is an instance of a specific class.
- **`array`** - Validates that the input is an array where each element matches a given schema.
- **`record`** - Validates that the input is an object where each value matches a given schema.
- **`tuple`** - Validates that the input is a fixed-length array where each position matches a specific schema.
- **`object`** - Validates that the input matches a specific object schema.
- **`set`** - Validates that the input is a `Set` where all items match a given schema.
- **`map`** - Validates that the input is a `Map` where keys and values match given schemas.

_**Note:** These functions are exposed through the `schemas` object, importable directly from `@shvmeless/schemas`._

## Basic Classes

The functions above internally use the following classes:

`AnySchema`, `UnknownSchema`, `StringSchema`, `NumberSchema`, `BooleanSchema`, `LiteralSchema`, `EnumSchema`, `NullSchema`, `UndefinedSchema`, `InstanceOfSchema`, `ArraySchema`, `RecordSchema`, `TupleSchema`, `SetSchema`, `MapSchema`, and `ObjectSchema`.

_**Note:** These classes are available in the `classes` module, which can be imported from `@shvmeless/schemas/classes`, *but it is **not recommended** to use them directly*._

## Special Classes

Additionally, some classes provide special functionality, usually created internally by methods available on the basic schemas.

- **`NullableSchema`** - Validates that the input matches a specific schema or is `null`.
- **`OptionalSchema`** - Validates that the input matches a specific schema or is `undefined`.
- **`UnionSchema`** - Validates that the input matches any of the provided schemas.
- **`FallbackSchema`** - Provides a fallback output when input validation fails.
- **`TransformSchema`** - Transforms the input after validation.

_**Note:** These classes are also available in the `classes` module, which can be imported from `@shvmeless/schemas/classes`, *but it is **not recommended** to use them directly*._

## Error Classes

The `schemas` module also includes the following error classes:

- **`ValidationError`** - Thrown when `validate()` fails, with details about the validation failure.
- **`ValidationErrorIndex`** - A `Map` of nested errors produced during validation of complex structures.

## Usage

Import the `schemas` object and use its methods to define schemas.

```typescript
import { schemas } from '@shvmeless/schemas';

const schema = schemas.object({
  name: schemas.string(),
  age: schemas.number(),
  allowed: schemas.boolean(),
});
```

Alternatively, if you prefer, you can create schemas using the classes directly, although this is **not recommended**.

```typescript
import { ObjectSchema, StringSchema, NumberSchema, BooleanSchema }
from '@shvmeless/schemas/classes';

const schema = ObjectSchema.create({
  name: StringSchema.create(),
  age: NumberSchema.create(),
  allowed: BooleanSchema.create(),
}).strip();
```

## Validation Methods

Currently, there are two methods to validate input against a schema:

- **`validate`** - Returns the validated input or throws an error if validation fails.

```typescript
const result = schema.validate({
  name: 'Jessica Álvarez',
  age: 33,
  allowed: true,
});

console.log(result); // { name: 'Jessica Álvarez', age: 33, allowed: true }
```

- **`isValid`** - Returns `true` if the input matches the schema; otherwise, returns `false`.

```typescript
const isValid = schema.isValid({
  name: 'Jessica Álvarez',
  age: 33,
  allowed: true,
});

console.log(isValid); // true
```

## Common Methods

Some schemas include common methods that allow their behavior to be modified, such as:

- **`nullable`** - Allows the input to be `null`.

```typescript
const schema = schemas.string().nullable();

schema.validate('STRING'); // 'STRING'
schema.validate(null); // null
```

- **`optional`** - Allows the input to be `undefined`.

```typescript
const schema = schemas.string().optional();

schema.validate('STRING'); // 'STRING'
schema.validate(undefined); // undefined
```

- **`or`** - Allows the input to match any of the provided schemas.

```typescript
const schema = schemas.string().or(schemas.number());

schema.validate('STRING'); // 'STRING'
schema.validate(123); // 123
```

- **`fallback`** - Provides a fallback output when input validation fails.

```typescript
const schema = schemas.string().fallback('DEFAULT');

schema.validate('STRING'); // 'STRING'
schema.validate(123); // 'DEFAULT'
```

- **`transform`** - Transforms validated input into a new output, including type changes.

```typescript
const schema = schemas.string().transform((input) => input.length);

schema.validate('STRING'); // 6
```

## Specific Methods

Some classes also contain specific methods that allow their behavior to be modified in a special way.

### `StringSchema`

- **`length`** - Checks the length of the string and throws an error if it does not match the expected length.

```typescript
const schema = schemas.string().length(5);

schema.validate('1234567'); // throws an error!
schema.validate('12345'); // '12345'
schema.validate('123'); // throws an error!
```

- **`min`** - Checks the length of the string and throws an error if it is less than the expected length.

```typescript
const schema = schemas.string().min(5);

schema.validate('1234567'); // '1234567'
schema.validate('12345'); // '12345'
schema.validate('123'); // throws an error!
```

- **`max`** - Checks the length of the string and throws an error if it is greater than the expected length.

```typescript
const schema = schemas.string().max(5);

schema.validate('1234567'); // throws an error!
schema.validate('12345'); // '12345'
schema.validate('123'); // '123'
```

- **`lowercase`** - Checks if the string is lowercase, can fix or throw an error if it is not.

```typescript
const schema = schemas.string().lowercase();

schema.validate('string'); // 'string'
schema.validate('STRING'); // throws an error!
```

```typescript
const schema = schemas.string().lowercase({ fix: true });

schema.validate('string'); // 'string'
schema.validate('STRING'); // 'string'
```

- **`uppercase`** - Checks if the string is uppercase, can fix or throw an error if it is not.

```typescript
const schema = schemas.string().uppercase();

schema.validate('string'); // throws an error!
schema.validate('STRING'); // 'STRING'
```

```typescript
const schema = schemas.string().uppercase({ fix: true });

schema.validate('string'); // 'STRING'
schema.validate('STRING'); // 'STRING'
```

- **`trim`** - Checks if the string contains leading and trailing whitespace, can fix or throw an error if it does.

```typescript
const schema = schemas.string().trim();

schema.validate('string'); // 'string'
schema.validate('  string  '); // throws an error!
```

```typescript
const schema = schemas.string().trim({ fix: true });

schema.validate('string'); // 'string'
schema.validate('  string  '); // 'string'
```

- **`startsWith`** - Checks if the string starts with the given prefix, can fix or throw an error if it does not.

```typescript
const schema = schemas.string().startsWith('prefix-');

schema.validate('prefix-string'); // 'prefix-string'
schema.validate('string'); // throws an error!
```

```typescript
const schema = schemas.string().startsWith('prefix-', { fix: true });

schema.validate('prefix-string'); // 'prefix-string'
schema.validate('string'); // 'prefix-string'
```

- **`endsWith`** - Checks if the string ends with the given suffix, can fix or throw an error if it does not.

```typescript
const schema = schemas.string().endsWith('-suffix');

schema.validate('string-suffix'); // 'string-suffix'
schema.validate('string'); // throws an error!
```

```typescript
const schema = schemas.string().endsWith('-suffix', { fix: true });

schema.validate('string-suffix'); // 'string-suffix'
schema.validate('string'); // 'string-suffix'
```

- **`includes`** - Checks if the string includes the given search string and throws an error if it does not.

```typescript
const schema = schemas.string().includes('str');

schema.validate('string'); // 'string'
schema.validate('text'); // throws an error!
```

- **`excludes`** - Checks if the string does not include the given search string and throws an error if it does.

```typescript
const schema = schemas.string().excludes('str');

schema.validate('text'); // 'text'
schema.validate('string'); // throws an error!
```

- **`match`** - Checks if the string matches the given regular expression and throws an error if it does not.

```typescript
const schema = schemas.string().match(/^[a-z]+$/);

schema.validate('string'); // 'string'
schema.validate('12345'); // throws an error!
```

- **`default`** - Provides a default value if the input is an empty string.

```typescript
const schema = schemas.string().default('DEFAULT');

schema.validate(''); // 'DEFAULT'
schema.validate('string'); // 'string'
```

---

### `NumberSchema`

- **`lessThan`** - Checks if the number is less than the given target and throws an error if it is not.

```typescript
const schema = schemas.number().lessThan(5);

schema.validate(4); // 4
schema.validate(5); // throws an error!
schema.validate(6); // throws an error!
```

- **`lessThanOrEqual`** - Checks if the number is less than or equal to the given target and throws an error if it is not.

```typescript
const schema = schemas.number().lessThanOrEqual(5);

schema.validate(4); // 4
schema.validate(5); // 5
schema.validate(6); // throws an error!
```

- **`greaterThan`** - Checks if the number is greater than the given target and throws an error if it is not.

```typescript
const schema = schemas.number().greaterThan(5);

schema.validate(4); // throws an error!
schema.validate(5); // throws an error!
schema.validate(6); // 6
```

- **`greaterThanOrEqual`** - Checks if the number is greater than or equal to the given target and throws an error if it is not.

```typescript
const schema = schemas.number().greaterThanOrEqual(5);

schema.validate(4); // throws an error!
schema.validate(5); // 5
schema.validate(6); // 6
```

- **`negative`** - Checks if the number is negative and throws an error if it is not.

```typescript
const schema = schemas.number().negative();

schema.validate(-5); // -5
schema.validate(0); // throws an error!
schema.validate(5); // throws an error!
```

- **`positive`** - Checks if the number is positive and throws an error if it is not.

```typescript
const schema = schemas.number().positive();

schema.validate(-5); // throws an error!
schema.validate(0); // throws an error!
schema.validate(5); // 5
```

- **`integer`** - Checks if the number is an integer and throws an error if it is not.

```typescript
const schema = schemas.number().integer();

schema.validate(0); // 0
schema.validate(100); // 100
schema.validate(Number.MAX_SAFE_INTEGER); // Number.MAX_SAFE_INTEGER
schema.validate(100.5); // throws an error!
```

- **`finite`** - Checks if the number is a finite number and throws an error if it is not.

```typescript
const schema = schemas.number().finite();

schema.validate(100); // 100
schema.validate(100.5); // 100.5
schema.validate(Number.MAX_SAFE_INTEGER); // Number.MAX_SAFE_INTEGER
schema.validate(Number.MAX_SAFE_INTEGER + 1); // Number.MAX_SAFE_INTEGER + 1
schema.validate(Infinity); // throws an error!
schema.validate(NaN); // throws an error!
```

- **`safe`** - Checks if the number is a safe number and throws an error if it is not.

```typescript
const schema = schemas.number().safe();

schema.validate(100); // 100
schema.validate(100.5); // 100.5
schema.validate(Number.MAX_SAFE_INTEGER); // Number.MAX_SAFE_INTEGER
schema.validate(Number.MAX_SAFE_INTEGER + 1); // throws an error!
schema.validate(Infinity); // throws an error!
schema.validate(NaN); // throws an error!

```

- **`trunc`** - Truncates the number to an integer.

```typescript
const schema = schemas.number().trunc();

schema.validate(100); // 100
schema.validate(100.25); // 100
schema.validate(100.75); // 100
```

- **`round`** - Rounds the number to the nearest integer.

```typescript
const schema = schemas.number().round();

schema.validate(100); // 100
schema.validate(100.25); // 100
schema.validate(100.75); // 101
```

- **`floor`** - Rounds down the number to the nearest integer.

```typescript
const schema = schemas.number().floor();

schema.validate(100); // 100
schema.validate(100.25); // 100
schema.validate(100.75); // 100
```

- **`ceil`** - Rounds up to the nearest integer.

```typescript
const schema = schemas.number().ceil();

schema.validate(100); // 100
schema.validate(100.25); // 101
schema.validate(100.75); // 101
```

---

### `ArraySchema`

- **`prune`** - Skips elements that do not match the schema, removing them from the output.

```typescript
const schema = schemas.array(schemas.number()).prune();

schema.validate([1, '2', 3, '4', 5]);
//     ^ [1, 3, 5]
```

- **`length`** - Checks the length of the array and throws an error if it does not match the expected length.

```typescript
const schema = schemas.array(schemas.number()).length(5);

schema.validate([1, 2, 3, 4, 5, 6, 7]);
//     ^ throws an error!
schema.validate([1, 2, 3, 4, 5]);
//     ^ [1, 2, 3, 4, 5]
schema.validate([1, 2, 3]);
//     ^ throws an error!
```

- **`min`** - Checks the length of the array and throws an error if it is less than the expected length.

```typescript
const schema = schemas.array(schemas.number()).min(5);

schema.validate([1, 2, 3, 4, 5, 6, 7]);
//     ^ [1, 2, 3, 4, 5, 6, 7]
schema.validate([1, 2, 3, 4, 5]);
//     ^ [1, 2, 3, 4, 5]
schema.validate([1, 2, 3]);
//     ^ throws an error!
```

- **`max`** - Checks the length of the array and throws an error if it is greater than the expected length.

```typescript
const schema = schemas.array(schemas.number()).max(5);

schema.validate([1, 2, 3, 4, 5, 6, 7]);
//     ^ throws an error!
schema.validate([1, 2, 3, 4, 5]);
//     ^ [1, 2, 3, 4, 5]
schema.validate([1, 2, 3]);
//     ^ [1, 2, 3]
```

- **`filter`** - Filters the array and removes elements that do not pass the validation function.

```typescript
const schema = schemas.array(schemas.number()).filter((value, index) => value % 10 === 0);

schema.validate([10, 22, 30, 44, 50]);
//     ^ [10, 30, 50]
```

- **`some`** - Checks if any element in the array passes the validation function.

```typescript
const schema = schemas.array(schemas.number()).some((value, index) => value % 10 === 0);

schema.validate([10, 20, 30, 40, 50]);
//     ^ [10, 20, 30, 40, 50]
schema.validate([10, 22, 30, 44, 50]);
//     ^ [10, 22, 30, 44, 50]
schema.validate([11, 22, 33, 44, 55]);
//     ^ throws an error!
```

- **`every`** - Checks if all elements in the array pass the validation function.

```typescript
const schema = schemas.array(schemas.number()).every((value, index) => value % 10 === 0);

schema.validate([10, 20, 30, 40, 50]);
//     ^ [10, 20, 30, 40, 50]
schema.validate([10, 22, 30, 44, 50]);
//     ^ throws an error!
schema.validate([11, 22, 33, 44, 55]);
//     ^ throws an error!
```

- **`none`** - Checks that no element in the array passes the validation function.

```typescript
const schema = schemas.array(schemas.number()).none((value, index) => value % 10 === 0);

schema.validate([10, 20, 30, 40, 50]);
//     ^ throws an error!
schema.validate([10, 22, 30, 44, 50]);
//     ^ throws an error!
schema.validate([11, 22, 33, 44, 55]);
//     ^ [11, 22, 33, 44, 55]
```

---

### `TupleSchema`

- **`strip`** - Ignores unexpected input items in the tuple and removes them from the output.

```typescript
const schema = schemas.tuple([
  schemas.string(),
  schemas.number(),
  schemas.boolean()
]).strip();

schema.validate(['STRING', 123, true, 'UNEXPECTED']);
//     ^ ['STRING', 123, true]
```

---

### `RecordSchema`

- **`prune`** - Skips entries that do not match the schema, removing them from the output.

```typescript
const schema = schemas.record(schemas.number()).prune();

schema.validate({ a: 1, b: '2', c: 3, d: '4', e: 5 });
//     ^ { a: 1, c: 3, e: 5 }
```

- **`length`** - Checks the length of the record and throws an error if it does not match the expected length.

```typescript
const schema = schemas.record(schemas.number()).length(3);

schema.validate({ a: 1, b: 2, c: 3, d: 4, e: 5 });
//     ^ throws an error!
schema.validate({ a: 1, b: 2, c: 3 });
//     ^ { a: 1, b: 2, c: 3 }
schema.validate({ a: 1 });
//     ^ throws an error!
```

- **`min`** - Checks the length of the record and throws an error if it is less than the expected length.

```typescript
const schema = schemas.record(schemas.number()).min(3);

schema.validate({ a: 1, b: 2, c: 3, d: 4, e: 5 });
//     ^ { a: 1, b: 2, c: 3, d: 4, e: 5 }
schema.validate({ a: 1, b: 2, c: 3 });
//     ^ { a: 1, b: 2, c: 3 }
schema.validate({ a: 1 });
//     ^ throws an error!
```

- **`max`** - Checks the length of the record and throws an error if it is greater than the expected length.

```typescript
const schema = schemas.record(schemas.number()).max(3);

schema.validate({ a: 1, b: 2, c: 3, d: 4, e: 5 });
//     ^ throws an error!
schema.validate({ a: 1, b: 2, c: 3 });
//     ^ { a: 1, b: 2, c: 3 }
schema.validate({ a: 1 });
//     ^ { a: 1 }
```

- **`filter`** - Filters the record and removes entries that do not pass the validation function.

```typescript
const schema = schemas.record(schemas.number()).filter((value, key) => value % 10 === 0);

schema.validate({ a: 10, b: 22, c: 30 });
//     ^ { a: 10, c: 30 }
```

- **`some`** - Checks if any entry in the record passes the validation function.

```typescript
const schema = schemas.record(schemas.number()).some((value, key) => value % 10 === 0);

schema.validate({ a: 10, b: 20, c: 30 });
//     ^ { a: 10, b: 20, c: 30 }
schema.validate({ a: 10, b: 22, c: 30 });
//     ^ { a: 10, b: 22, c: 30 }
schema.validate({ a: 11, b: 22, c: 33 });
//     ^ throws an error!
```

- **`every`** - Checks if all entries in the record pass the validation function.

```typescript
const schema = schemas.record(schemas.number()).every((value, key) => value % 10 === 0);

schema.validate({ a: 10, b: 20, c: 30 });
//     ^ { a: 10, b: 20, c: 30 }
schema.validate({ a: 10, b: 22, c: 30 });
//     ^ throws an error!
schema.validate({ a: 11, b: 22, c: 33 });
//     ^ throws an error!
```

- **`none`** - Checks that no entry in the record passes the validation function.

```typescript
const schema = schemas.record(schemas.number()).none((value, key) => value % 10 === 0);

schema.validate({ a: 10, b: 20, c: 30 });
//     ^ throws an error!
schema.validate({ a: 10, b: 22, c: 30 });
//     ^ throws an error!
schema.validate({ a: 11, b: 22, c: 33 });
//     ^ { a: 11, b: 22, c: 33 }
```

---

### `ObjectSchema`

- **`strip`** - Ignores unexpected input properties in the object and removes them from the output.

```typescript
const schema = schemas.object({
  string: schemas.string(),
  number: schemas.number(),
  boolean: schemas.boolean(),
}).strip();

schema.validate({
  string: 'STRING',
  number: 123,
  boolean: true,
  unexpected: 'UNEXPECTED',
}); // { string: 'STRING', number: 123, boolean: true }
```

---

### `SetSchema`

- **`prune`** - Skips elements that do not match the schema, removing them from the output.

```typescript
const schema = schemas.set(schemas.number()).prune();

schema.validate(new Set([1, '2', 3, '4', 5]));
//     ^ Set([1, 3, 5])
```

- **`size`** - Checks the size of the Set and throws an error if it does not match the expected size.

```typescript
const schema = schemas.set(schemas.number()).size(5);

schema.validate(new Set([1, 2, 3, 4, 5, 6, 7]));
//     ^ throws an error!
schema.validate(new Set([1, 2, 3, 4, 5]));
//     ^ Set([1, 2, 3, 4, 5])
schema.validate(new Set([1, 2, 3]));
//     ^ throws an error!
```

- **`min`** - Checks the size of the Set and throws an error if it is less than the expected size.

```typescript
const schema = schemas.set(schemas.number()).min(5);

schema.validate(new Set([1, 2, 3, 4, 5, 6, 7]));
//     ^ Set([1, 2, 3, 4, 5, 6, 7])
schema.validate(new Set([1, 2, 3, 4, 5]));
//     ^ Set([1, 2, 3, 4, 5])
schema.validate(new Set([1, 2, 3]));
//     ^ throws an error!
```

- **`max`** - Checks the size of the Set and throws an error if it is greater than the expected size.

```typescript
const schema = schemas.set(schemas.number()).max(5);

schema.validate(new Set([1, 2, 3, 4, 5, 6, 7]));
//     ^ throws an error!
schema.validate(new Set([1, 2, 3, 4, 5]));
//     ^ Set([1, 2, 3, 4, 5])
schema.validate(new Set([1, 2, 3]));
//     ^ Set([1, 2, 3])
```

- **`filter`** - Filters the Set and removes elements that do not pass the validation function.

```typescript
const schema = schemas.set(schemas.number()).filter((value) => value % 10 === 0);

schema.validate(new Set([10, 22, 30, 44, 50]));
//     ^ Set([10, 30, 50])
```

- **`some`** - Checks if any element in the Set passes the validation function.

```typescript
const schema = schemas.set(schemas.number()).some((value) => value % 10 === 0);

schema.validate(new Set([10, 20, 30, 40, 50]));
//     ^ Set([10, 20, 30, 40, 50])
schema.validate(new Set([10, 22, 30, 44, 50]));
//     ^ Set([10, 22, 30, 44, 50])
schema.validate(new Set([11, 22, 33, 44, 55]));
//     ^ throws an error!
```

- **`every`** - Checks if all elements in the Set pass the validation function.

```typescript
const schema = schemas.set(schemas.number()).every((value) => value % 10 === 0);

schema.validate(new Set([10, 20, 30, 40, 50]));
//     ^ Set([10, 20, 30, 40, 50])
schema.validate(new Set([10, 22, 30, 44, 50]));
//     ^ throws an error!
schema.validate(new Set([11, 22, 33, 44, 55]));
//     ^ throws an error!
```

- **`none`** - Checks that no element in the Set passes the validation function.

```typescript
const schema = schemas.set(schemas.number()).none((value) => value % 10 === 0);

schema.validate(new Set([10, 20, 30, 40, 50]));
//     ^ throws an error!
schema.validate(new Set([10, 22, 30, 44, 50]));
//     ^ throws an error!
schema.validate(new Set([11, 22, 33, 44, 55]));
//     ^ Set([11, 22, 33, 44, 55])
```

---

### `MapSchema`

- **`prune`** - Skips entries that do not match the schema, removing them from the output.

```typescript
const schema = schemas.map(schemas.string(), schemas.number()).prune();

schema.validate(new Map([['a', 1], ['b', '2'], ['c', 3]]));
//     ^ Map([['a', 1], ['c', 3]])
```

- **`size`** - Checks the size of the Map and throws an error if it does not match the expected size.

```typescript
const schema = schemas.map(schemas.string(), schemas.number()).size(3);

schema.validate(new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]));
//     ^ throws an error!
schema.validate(new Map([['a', 1], ['b', 2], ['c', 3]]));
//     ^ Map([['a', 1], ['b', 2], ['c', 3]])
schema.validate(new Map([['a', 1]]));
//     ^ throws an error!
```

- **`min`** - Checks the size of the Map and throws an error if it is less than the expected size.

```typescript
const schema = schemas.map(schemas.string(), schemas.number()).min(3);

schema.validate(new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]));
//     ^ Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
schema.validate(new Map([['a', 1], ['b', 2], ['c', 3]]));
//     ^ Map([['a', 1], ['b', 2], ['c', 3]])
schema.validate(new Map([['a', 1]]));
//     ^ throws an error!
```

- **`max`** - Checks the size of the Map and throws an error if it is greater than the expected size.

```typescript
const schema = schemas.map(schemas.string(), schemas.number()).max(3);

schema.validate(new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]));
//     ^ throws an error!
schema.validate(new Map([['a', 1], ['b', 2], ['c', 3]]));
//     ^ Map([['a', 1], ['b', 2], ['c', 3]])
schema.validate(new Map([['a', 1]]));
//     ^ Map([['a', 1]])
```

- **`filter`** - Filters the Map and removes entries that do not pass the validation function.

```typescript
const schema = schemas.map(schemas.string(), schemas.number()).filter((value, key) => value % 10 === 0);

schema.validate(new Map([['a', 10], ['b', 22], ['c', 30]]));
//     ^ Map([['a', 10], ['c', 30]])
```

- **`some`** - Checks if any entry in the Map passes the validation function.

```typescript
const schema = schemas.map(schemas.string(), schemas.number()).some((value, key) => value % 10 === 0);

schema.validate(new Map([['a', 10], ['b', 20], ['c', 30]]));
//     ^ Map([['a', 10], ['b', 20], ['c', 30]])
schema.validate(new Map([['a', 10], ['b', 22], ['c', 30]]));
//     ^ Map([['a', 10], ['b', 22], ['c', 30]])
schema.validate(new Map([['a', 11], ['b', 22], ['c', 33]]));
//     ^ throws an error!
```

- **`every`** - Checks if all entries in the Map pass the validation function.

```typescript
const schema = schemas.map(schemas.string(), schemas.number()).every((value, key) => value % 10 === 0);

schema.validate(new Map([['a', 10], ['b', 20], ['c', 30]]));
//     ^ Map([['a', 10], ['b', 20], ['c', 30]])
schema.validate(new Map([['a', 10], ['b', 22], ['c', 30]]));
//     ^ throws an error!
schema.validate(new Map([['a', 11], ['b', 22], ['c', 33]]));
//     ^ throws an error!
```

- **`none`** - Checks that no entry in the Map passes the validation function.

```typescript
const schema = schemas.map(schemas.string(), schemas.number()).none((value, key) => value % 10 === 0);

schema.validate(new Map([['a', 10], ['b', 20], ['c', 30]]));
//     ^ throws an error!
schema.validate(new Map([['a', 10], ['b', 22], ['c', 30]]));
//     ^ throws an error!
schema.validate(new Map([['a', 11], ['b', 22], ['c', 33]]));
//     ^ Map([['a', 11], ['b', 22], ['c', 33]])
```

---

### `NullableSchema`

- **`default`** - Provides a default value if the input is `null`.

```typescript
const schema = schemas.string().nullable().default('DEFAULT');

schema.validate('STRING'); // 'STRING'
schema.validate(null); // 'DEFAULT'
```

---

### `OptionalSchema`

- **`default`** - Provides a default value if the input is `undefined`.

```typescript
const schema = schemas.string().optional().default('DEFAULT');

schema.validate('STRING'); // 'STRING'
schema.validate(undefined); // 'DEFAULT'
```

## Errors

### `ValidationError`

This error is thrown when `validate()` fails, and contains the following properties:

- `value: unknown` - The value that caused the error.
- `message: string` - The error message.
- `index: ValidationErrorIndex | null` - A `Map` object with internal errors, if any.

### `ValidationErrorIndex`

This `Map` contains an index with internal errors that may have occurred during a validation. This index usually appears when using schemas with more complex structures, such as `ArraySchema`, `TupleSchema`, `RecordSchema`, `ObjectSchema`, `MapSchema`, and `SetSchema`.

The `Map` keys represent, depending on the schema that caused the error, the following:

- `ArraySchema`: The numeric index of the element.
- `TupleSchema`: The numeric index of the element.
- `RecordSchema`: The key corresponding to the entry.
- `ObjectSchema`: The key corresponding to the property.
- `MapSchema`: The key corresponding to the entry.
- `SetSchema`: The element in question.

Each entry in the `Map` is an object with the following properties:

- `value: unknown` - The value that caused the error.
- `message: string` - The error message.
- `index: ValidationErrorIndex | null` - A `Map` object with internal errors, if any.
