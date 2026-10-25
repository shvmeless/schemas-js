# Schemas JS

A TypeScript type-safe schema declaration library for data validation with a fluent chainable API.

## Installation

```bash
npm install @shvmeless/schemas
```

## Schema Functions

The package exports a `schemas` object with functions for creating schemas.

### Basic Types
- **`schemas.unknown()`** - Accepts any input and types it as `unknown`.
- **`schemas.any()`** - Accepts any input and types it as `any`.
- **`schemas.string()`** - Validates that the input is a string.
- **`schemas.number()`** - Validates that the input is a number.
- **`schemas.boolean()`** - Validates that the input is a boolean.

### Nullish Types
- **`schemas.null()`** - Validates that the input is `null`.
- **`schemas.undefined()`** - Validates that the input is `undefined`.

### Literals and Enums
- **`schemas.literal.string(literal)`** - Validates that the input matches a specific string literal.
- **`schemas.literal.number(literal)`** - Validates that the input matches a specific number literal.
- **`schemas.literal.boolean(literal)`** - Validates that the input matches a specific boolean literal.
- **`schemas.enum.string(...values)`** - Validates that the input matches one of the provided string literal values.
- **`schemas.enum.number(...values)`** - Validates that the input matches one of the provided number literal values.

### Structured Types
- **`schemas.array(schema)`** - Validates that the input is an array where each element matches the given schema.
- **`schemas.record(schema)`** - Validates that the input is an object where each value matches the given schema.
- **`schemas.tuple([schema1, schema2, ...])`** - Validates that the input is a fixed-length array where each position matches a specific schema.
- **`schemas.object({ key: schema, ... })`** - Validates that the input matches a specific object schema.
- **`schemas.set(schema)`** - Validates that the input is a `Set` where all items match the given schema.
- **`schemas.map(keySchema, valueSchema)`** - Validates that the input is a `Map` where keys and values match the given schemas.

### Special Types
- **`schemas.instanceOf(Class)`** - Validates that the input is an instance of a specific class.
- **`schemas.union(schema1, schema2, ...)`** - Validates that the input matches any of the provided schemas (requires at least two schemas).

## Usage

```typescript
import { schemas } from '@shvmeless/schemas';

const schema = schemas.object({
  name: schemas.string(),
  age: schemas.number(),
  active: schemas.boolean(),
});

const result = schema.validate({
  name: 'Jessica Álvarez',
  age: 33,
  active: true,
});

console.log(result); // { name: 'Jessica Álvarez', age: 33, active: true }
```

## Available Classes

Classes are also available from the `classes` module, though using the `schemas` object is recommended.

```typescript
import { ObjectSchema, StringSchema, NumberSchema, BooleanSchema } from '@shvmeless/schemas/classes';
```

Available classes: `AnySchema`, `UnknownSchema`, `StringSchema`, `NumberSchema`, `BooleanSchema`, `NullSchema`, `UndefinedSchema`, `LiteralSchema`, `EnumSchema`, `InstanceOfSchema`, `ArraySchema`, `RecordSchema`, `TupleSchema`, `ObjectSchema`, `SetSchema`, `MapSchema`, `UnionSchema`.

## Validation

- **`validate(input)`** - Returns the validated (and possibly transformed) input, or throws a `ValidationError` if validation fails.

## Common Schema Methods

All schemas inherit from `GenericSchema` and support the following methods.

### Configuration
- **`optional()`** - Allows `undefined` as input.
- **`nullable()`** - Allows `null` as input.
- **`default(value)`** - Provides a default value when the input is `null` (if nullable) or `undefined` (if optional).
- **`fallback(value)`** - Returns the fallback value if validation fails (doesn't throw).

### Pipeline
- **`parse(fn)`** - Transforms the input before validation.
- **`prepare(fn)`** - Transforms the validated value before tests.
- **`test(id, fn)`** - Adds a custom test with an identifier.
- **`refine(fn)`** - Transforms the value after tests.

## Schema-Specific Methods

### `StringSchema`
- **`length(length)`** - Requires exact string length.
- **`min(length)`** - Requires minimum string length.
- **`max(length)`** - Requires maximum string length.
- **`lowercase()`** - Requires string to be all lowercase.
- **`uppercase()`** - Requires string to be all uppercase.

### `NumberSchema`
- **`lessThan(target)`** - Requires number less than target.
- **`lessThanOrEqual(target)`** - Requires number less than or equal to target.
- **`greaterThan(target)`** - Requires number greater than target.
- **`greaterThanOrEqual(target)`** - Requires number greater than or equal to target.
- **`positive()`** - Requires positive number.
- **`negative()`** - Requires negative number.
- **`integer()`** - Requires integer value.
- **`finite()`** - Requires finite number.
- **`safe()`** - Requires safe integer number.

### `ArraySchema`
- **`prune()`** - Skips elements that don't match the schema, removing them from output.
- **`length(length)`** - Requires exact array length.
- **`min(length)`** - Requires minimum array length.
- **`max(length)`** - Requires maximum array length.
- **`filter(fn)`** - Filters array elements based on validation function.
- **`some(fn)`** - Requires at least one element to pass the validation function.
- **`every(fn)`** - Requires all elements to pass the validation function.
- **`none(fn)`** - Requires no elements to pass the validation function.

### `RecordSchema`
- **`prune()`** - Skips entries that don't match the schema, removing them from output.
- **`length(length)`** - Requires exact number of entries.
- **`min(length)`** - Requires minimum number of entries.
- **`max(length)`** - Requires maximum number of entries.
- **`filter(fn)`** - Filters record entries based on validation function.
- **`some(fn)`** - Requires at least one entry to pass the validation function.
- **`every(fn)`** - Requires all entries to pass the validation function.
- **`none(fn)`** - Requires no entries to pass the validation function.

### `TupleSchema`
- **`strip()`** - Ignores unexpected elements in the tuple, removing them from output.

### `ObjectSchema`
- **`strip()`** - Ignores unexpected properties in the object, removing them from output.

### `SetSchema`
- **`prune()`** - Skips elements that don't match the schema, removing them from output.
- **`size(size)`** - Requires exact set size.
- **`min(size)`** - Requires minimum set size.
- **`max(size)`** - Requires maximum set size.
- **`filter(fn)`** - Filters set elements based on validation function.
- **`some(fn)`** - Requires at least one element to pass the validation function.
- **`every(fn)`** - Requires all elements to pass the validation function.
- **`none(fn)`** - Requires no elements to pass the validation function.

### `MapSchema`
- **`prune()`** - Skips entries that don't match the schema, removing them from output.
- **`size(size)`** - Requires exact map size.
- **`min(size)`** - Requires minimum map size.
- **`max(size)`** - Requires maximum map size.
- **`filter(fn)`** - Filters map entries based on validation function.
- **`some(fn)`** - Requires at least one entry to pass the validation function.
- **`every(fn)`** - Requires all entries to pass the validation function.
- **`none(fn)`** - Requires no entries to pass the validation function.

## Errors

### `ValidationError`
Thrown when `validate()` fails. Properties:
- `value: unknown` - The value that caused the error.
- `message: string` - The error message.
- `location: ValidationErrorLocation | null` - A `Map` of nested errors for complex structures.

### `ValidationErrorLocation`
A `Map` where keys depend on the schema type:
- `ArraySchema`: numeric index.
- `TupleSchema`: numeric index.
- `RecordSchema`: key.
- `ObjectSchema`: property key.
- `MapSchema`: key.
- `SetSchema`: element.

Each entry contains `{ value: unknown, message: string, location: ValidationErrorLocation | null }`.
