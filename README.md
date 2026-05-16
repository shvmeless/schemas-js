# Schemas JS

Custom *TypeScript* schema builder library for data validation.

## Schema Functions

This package includes the following functions for creating schemas:

- **`any`** - Validates any type of input.
- **`unknown`** - Validates any type of input.
- **`string`** - Validates that the input is a string.
- **`number`** - Validates that the input is a number.
- **`boolean`** - Validates that the input is a boolean.
- **`literal`** - Validates that the input matches a specific literal value.
- **`enum`** - Validates that the input matches one of the provided literal values.
- **`null`** - Validates that the input is null.
- **`undefined`** - Validates that the input is undefined.
- **`instanceOf`** - Validates that the input is an instance of a specific class.
- **`array`** - Validates that each input item matches a specific schema.
- **`record`** - Validates that each input entry matches a specific schema.
- **`tuple`** - Validates that the input matches a specific tuple schema.
- **`object`** - Validates that the input matches a specific object schema.
- **`set`** - Validates that the input is a set of items matching a specific schema.
- **`map`** - Validates that the input is a map of items matching specific key and value schemas.

_**Note:** These functions are available in the `schemas` module, which can be imported directly from `@shvmeless/schemas`._

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

The `schemas` module also includes the following error class:

- **`ValidationError`** - Thrown when `validate()` fails.

## Usage

Import the `schemas` module and use the functions to create the schemas.

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
});
```

## Validation Methods

Currently, there are two methods to validate input against a schema:

- **`validate`** - Returns the validated input or throws an error if validation fails.

```typescript
const result = schema.validate({
  name: 'John Doe',
  age: 30,
  allowed: true,
});

console.log(result); // { name: 'John Doe', age: 30, allowed: true }
```

- **`isValid`** - Returns `true` if the input matches the schema; otherwise, returns `false`.

```typescript
const isValid = schema.isValid({
  name: 'John Doe',
  age: 30,
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

### `TupleSchema`

- **`strip`** - Ignores unexpected input items in the tuple and removes them from the output.

```typescript
const schema = schemas.tuple([
  schemas.string(),
  schemas.number(),
  schemas.boolean()
]).strip();

schema.validate(['STRING', 123, true, 'UNEXPECTED']); // ['STRING', 123, true]
```

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

### `NullableSchema`

- **`default`** - Provides a default value if the input is `null`.

```typescript
const schema = schemas.string().nullable().default('DEFAULT');

schema.validate('STRING'); // 'STRING'
schema.validate(null); // 'DEFAULT'
```

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
