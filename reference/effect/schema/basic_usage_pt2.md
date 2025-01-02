Records
The Schema module provides support for defining record types, which are collections of key-value pairs where the key can be a string, symbol, or other types, and the value has a defined schema.

String Keys
You can define a record with string keys and a specified type for the values.

Example (String Keys with Number Values)

import { Schema } from "effect"

// Define a record schema with string keys and number values
//
//      ┌─── Record$<typeof Schema.String, typeof Schema.Number>
//      ▼
const schema = Schema.Record({ key: Schema.String, value: Schema.Number })

//     ┌─── { readonly [x: string]: number; }
//     ▼
type Type = typeof schema.Type


Symbol Keys
Records can also use symbols as keys.

Example (Symbol Keys with Number Values)

import { Schema } from "effect"

// Define a record schema with symbol keys and number values
const schema = Schema.Record({
  key: Schema.SymbolFromSelf,
  value: Schema.Number
})

//     ┌─── { readonly [x: symbol]: number; }
//     ▼
type Type = typeof schema.Type


Union of Literal Keys
Use a union of literals to restrict keys to a specific set of values.

Example (Union of String Literals as Keys)

import { Schema } from "effect"

// Define a record schema where keys are limited
// to specific string literals ("a" or "b")
const schema = Schema.Record({
  key: Schema.Union(Schema.Literal("a"), Schema.Literal("b")),
  value: Schema.Number
})

//     ┌─── { readonly a: number; readonly b: number; }
//     ▼
type Type = typeof schema.Type


Template Literal Keys
Records can use template literals as keys, allowing for more complex key patterns.

Example (Template Literal Keys with Number Values)

import { Schema } from "effect"

// Define a record schema with keys that match
// the template literal pattern "a${string}"
const schema = Schema.Record({
  key: Schema.TemplateLiteral(Schema.Literal("a"), Schema.String),
  value: Schema.Number
})

//     ┌─── { readonly [x: `a${string}`]: number; }
//     ▼
type Type = typeof schema.Type


Refined Keys
You can refine the key type with additional constraints.

Example (Refined Keys with Minimum Length Constraint)

import { Schema } from "effect"

// Define a record schema where keys are strings with a minimum length of 2
const schema = Schema.Record({
  key: Schema.String.pipe(Schema.minLength(2)),
  value: Schema.Number
})

//     ┌─── { readonly [x: string]: number; }
//     ▼
type Type = typeof schema.Type


Mutable Records
By default, Schema.Record generates a type marked as readonly. To create a schema for a mutable record, you can use the Schema.mutable function, which makes the record type mutable in a shallow manner.

Example (Creating a Mutable Record Schema)

import { Schema } from "effect"

// Create a schema for a mutable record with string keys and number values
const schema = Schema.mutable(
  Schema.Record({ key: Schema.String, value: Schema.Number })
)

//     ┌─── { [x: string]: number; }
//     ▼
type Type = typeof schema.Type


Exposed Values
You can access the key and value types of a record schema using the key and value properties:

Example (Accessing Key and Value Types)

import { Schema } from "effect"

const schema = Schema.Record({ key: Schema.String, value: Schema.Number })

// Accesses the key
//
//     ┌─── typeof Schema.String
//     ▼
const key = schema.key

// Accesses the value
//
//      ┌─── typeof Schema.Number
//      ▼
const value = schema.value


Structs
The Schema.Struct constructor allows you to define a schema for an object with specific properties.

Example (Defining a Struct Schema)

import { Schema } from "effect"

// Define a struct schema for an object with properties:
// - "name" (string)
// - "age" (number)
//
//      ┌─── Schema.Struct<{
//      │      name: typeof Schema.String;
//      │      age: typeof Schema.Number;
//      │    }>
//      ▼
const schema = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

//     ┌─── { readonly name: string; readonly age: number; }
//     ▼
type Type = typeof schema.Type


Allows Any Data

Note that Schema.Struct({}) models the TypeScript type {}, which is similar to unknown. This means that the schema will allow any type of data to pass through without validation.

Index Signatures
The Schema.Struct constructor can optionally accept a list of key/value pairs representing index signatures, allowing you to define additional dynamic properties.

declare const Struct: (props, ...indexSignatures) => Struct<...>

Example (Adding an Index Signature)

import { Schema } from "effect"

// Define a struct with a specific property "a"
// and an index signature for other properties
const schema = Schema.Struct(
  {
    a: Schema.Number
  },
  { key: Schema.String, value: Schema.Number }
)

//     ┌─── { readonly [x: string]: number; readonly a: number; }
//     ▼
type Type = typeof schema.Type


Since the Schema.Record constructor returns a schema that exposes both the key and value, you can simplify the above code by using the Schema.Record constructor:

Example (Simplifying with Schema.Record)

import { Schema } from "effect"

const schema = Schema.Struct(
  { a: Schema.Number },
  Schema.Record({ key: Schema.String, value: Schema.Number })
)

//     ┌─── { readonly [x: string]: number; readonly a: number; }
//     ▼
type Type = typeof schema.Type


Mutable Structs
By default, Schema.Struct generates a type with properties marked as readonly. To create a mutable version of the struct, use the Schema.mutable function, which makes the properties mutable in a shallow manner.

Example (Creating a Mutable Struct Schema)

import { Schema } from "effect"

const schema = Schema.mutable(
  Schema.Struct({ a: Schema.String, b: Schema.Number })
)

//     ┌─── { a: string; b: number; }
//     ▼
type Type = typeof schema.Type


Exposed Values
You can access the fields and records of a struct schema using the fields and records properties:

Example (Accessing Fields and Records)

import { Schema } from "effect"

const schema = Schema.Struct(
  { a: Schema.Number },
  Schema.Record({ key: Schema.String, value: Schema.Number })
)

// Accesses the fields
//
//      ┌─── { readonly a: typeof Schema.Number; }
//      ▼
const fields = schema.fields

// Accesses the records
//
//      ┌─── readonly [Schema.Record$<typeof Schema.String, typeof Schema.Number>]
//      ▼
const records = schema.records


Tagged Structs
In TypeScript tags help to enhance type discrimination and pattern matching by providing a simple yet powerful way to define and recognize different data types.

What is a Tag?
A tag is a literal value added to data structures, commonly used in structs, to distinguish between various object types or variants within tagged unions. This literal acts as a discriminator, making it easier to handle and process different types of data correctly and efficiently.

Using the tag Constructor
The Schema.tag constructor is specifically designed to create a property signature that holds a specific literal value, serving as the discriminator for object types.

Example (Defining a Tagged Struct)

import { Schema } from "effect"

const User = Schema.Struct({
  _tag: Schema.tag("User"),
  name: Schema.String,
  age: Schema.Number
})

//     ┌─── { readonly _tag: "User"; readonly name: string; readonly age: number; }
//     ▼
type Type = typeof User.Type

console.log(User.make({ name: "John", age: 44 }))
/*
Output:
{ _tag: 'User', name: 'John', age: 44 }
*/


In the example above, Schema.tag("User") attaches a _tag property to the User struct schema, effectively labeling objects of this struct type as “User”. This label is automatically applied when using the make method to create new instances, simplifying object creation and ensuring consistent tagging.

Simplifying Tagged Structs with TaggedStruct
The Schema.TaggedStruct constructor streamlines the process of creating tagged structs by directly integrating the tag into the struct definition. This method provides a clearer and more declarative approach to building data structures with embedded discriminators.

Example (Using TaggedStruct for a Simplified Tagged Struct)

import { Schema } from "effect"

const User = Schema.TaggedStruct("User", {
  name: Schema.String,
  age: Schema.Number
})

// `_tag` is automatically applied when constructing an instance
console.log(User.make({ name: "John", age: 44 }))
// Output: { _tag: 'User', name: 'John', age: 44 }

// `_tag` is required when decoding from an unknown source
console.log(Schema.decodeUnknownSync(User)({ name: "John", age: 44 }))
/*
throws:
ParseError: { readonly _tag: "User"; readonly name: string; readonly age: number }
└─ ["_tag"]
   └─ is missing
*/


In this example:

The _tag property is optional when constructing an instance with make, allowing the schema to automatically apply it.
When decoding unknown data, _tag is required to ensure correct type identification. This distinction between instance construction and decoding is useful for preserving the tag’s role as a type discriminator while simplifying instance creation.
If you need _tag to be applied automatically during decoding as well, you can create a customized version of Schema.TaggedStruct:

Example (Custom TaggedStruct with _tag Applied during Decoding)

import type { SchemaAST } from "effect"
import { Schema } from "effect"

const TaggedStruct = <
  Tag extends SchemaAST.LiteralValue,
  Fields extends Schema.Struct.Fields
>(
  tag: Tag,
  fields: Fields
) =>
  Schema.Struct({
    _tag: Schema.Literal(tag).pipe(
      Schema.optional,
      Schema.withDefaults({
        constructor: () => tag, // Apply _tag during instance construction
        decoding: () => tag // Apply _tag during decoding
      })
    ),
    ...fields
  })

const User = TaggedStruct("User", {
  name: Schema.String,
  age: Schema.Number
})

console.log(User.make({ name: "John", age: 44 }))
// Output: { _tag: 'User', name: 'John', age: 44 }

console.log(Schema.decodeUnknownSync(User)({ name: "John", age: 44 }))
// Output: { _tag: 'User', name: 'John', age: 44 }


Multiple Tags
While a primary tag is often sufficient, TypeScript allows you to define multiple tags for more complex data structuring needs. Here’s an example demonstrating the use of multiple tags within a single struct:

Example (Adding Multiple Tags to a Struct)

This example defines a product schema with a primary tag ("Product") and an additional category tag ("Electronics"), adding further specificity to the data structure.

import { Schema } from "effect"

const Product = Schema.TaggedStruct("Product", {
  category: Schema.tag("Electronics"),
  name: Schema.String,
  price: Schema.Number
})

// `_tag` and `category` are optional when creating an instance
console.log(Product.make({ name: "Smartphone", price: 999 }))
/*
Output:
{
  _tag: 'Product',
  category: 'Electronics',
  name: 'Smartphone',
  price: 999
}
*/


instanceOf
When you need to define a schema for your custom data type defined through a class, the most convenient and fast way is to use the Schema.instanceOf constructor.

Example (Defining a Schema with instanceOf)

import { Schema } from "effect"

class MyData {
  constructor(readonly name: string) {}
}

const MyDataSchema = Schema.instanceOf(MyData)

//     ┌─── MyData
//     ▼
type Type = typeof MyDataSchema.Type

console.log(Schema.decodeUnknownSync(MyDataSchema)(new MyData("name")))
// Output: MyData { name: 'name' }

console.log(Schema.decodeUnknownSync(MyDataSchema)({ name: "name" }))
/*
throws
ParseError: Expected MyData, actual {"name":"name"}
*/


The Schema.instanceOf constructor is just a lightweight wrapper of the Schema.declare API, which is the primitive in effect/Schema for declaring new custom data types.

However, note that Schema.instanceOf can only be used for classes that expose a public constructor. If you try to use it with classes that, for some reason, have marked the constructor as private, you’ll receive a TypeScript error:

Example (Error With Private Constructors)

import { Schema } from "effect"

class MyData {
  static make = (name: string) => new MyData(name)
  private constructor(readonly name: string) {}
}

// @ts-expect-error
const MyDataSchema = Schema.instanceOf(MyData)
/*
Argument of type 'typeof MyData' is not assignable to parameter of type 'abstract new (...args: any) => any'.
  Cannot assign a 'private' constructor type to a 'public' constructor type.ts(2345)
*/


In such cases, you cannot use Schema.instanceOf, and you must rely on Schema.declare like this:

Example (Using Schema.declare With Private Constructors)

import { Schema } from "effect"

class MyData {
  static make = (name: string) => new MyData(name)
  private constructor(readonly name: string) {}
}

const MyDataSchema = Schema.declare(
  (input: unknown): input is MyData => input instanceof MyData
).annotations({ identifier: "MyData" })

console.log(Schema.decodeUnknownSync(MyDataSchema)(MyData.make("name")))
// Output: MyData { name: 'name' }

console.log(Schema.decodeUnknownSync(MyDataSchema)({ name: "name" }))
/*
throws
ParseError: Expected MyData, actual {"name":"name"}
*/


Picking
The pick static function available on each struct schema can be used to create a new Struct by selecting specific properties from an existing Struct.

Example (Picking Properties from a Struct)

import { Schema } from "effect"

// Define a struct schema with properties "a", "b", and "c"
const MyStruct = Schema.Struct({
  a: Schema.String,
  b: Schema.Number,
  c: Schema.Boolean
})

// Create a new schema that picks properties "a" and "c"
//
//      ┌─── Struct<{
//      |      a: typeof Schema.String;
//      |      c: typeof Schema.Boolean;
//      |    }>
//      ▼
const PickedSchema = MyStruct.pick("a", "c")


The Schema.pick function can be applied more broadly beyond just Struct types, such as with unions of schemas. However it returns a generic SchemaClass.

Example (Picking Properties from a Union)

import { Schema } from "effect"

// Define a union of two struct schemas
const MyUnion = Schema.Union(
  Schema.Struct({ a: Schema.String, b: Schema.String, c: Schema.String }),
  Schema.Struct({ a: Schema.Number, b: Schema.Number, d: Schema.Number })
)

// Create a new schema that picks properties "a" and "b"
//
//      ┌─── SchemaClass<{
//      |      readonly a: string | number;
//      |      readonly b: string | number;
//      |    }>
//      ▼
const PickedSchema = MyUnion.pipe(Schema.pick("a", "b"))


Omitting
The omit static function available in each struct schema can be used to create a new Struct by excluding particular properties from an existing Struct.

Example (Omitting Properties from a Struct)

import { Schema } from "effect"

// Define a struct schema with properties "a", "b", and "c"
const MyStruct = Schema.Struct({
  a: Schema.String,
  b: Schema.Number,
  c: Schema.Boolean
})

// Create a new schema that omits property "b"
//
//      ┌─── Schema.Struct<{
//      |      a: typeof Schema.String;
//      |      c: typeof Schema.Boolean;
//      |    }>
//      ▼
const PickedSchema = MyStruct.omit("b")


The Schema.omit function can be applied more broadly beyond just Struct types, such as with unions of schemas. However it returns a generic Schema.

Example (Omitting Properties from a Union)

import { Schema } from "effect"

// Define a union of two struct schemas
const MyUnion = Schema.Union(
  Schema.Struct({ a: Schema.String, b: Schema.String, c: Schema.String }),
  Schema.Struct({ a: Schema.Number, b: Schema.Number, d: Schema.Number })
)

// Create a new schema that omits property "b"
//
//      ┌─── SchemaClass<{
//      |      readonly a: string | number;
//      |    }>
//      ▼
const PickedSchema = MyUnion.pipe(Schema.omit("b"))


partial
The Schema.partial function makes all properties within a schema optional.

Example (Making All Properties Optional)

import { Schema } from "effect"

// Create a schema with an optional property "a"
const schema = Schema.partial(Schema.Struct({ a: Schema.String }))

//     ┌─── { readonly a?: string | undefined; }
//     ▼
type Type = typeof schema.Type


By default, the Schema.partial operation adds undefined to the type of each property. If you want to avoid this, you can use Schema.partialWith and pass { exact: true } as an argument.

Example (Defining an Exact Partial Schema)

import { Schema } from "effect"

// Create a schema with an optional property "a" without allowing undefined
const schema = Schema.partialWith(
  Schema.Struct({
    a: Schema.String
  }),
  { exact: true }
)

//     ┌─── { readonly a?: string; }
//     ▼
type Type = typeof schema.Type


required
The Schema.required function ensures that all properties in a schema are mandatory.

Example (Making All Properties Required)

import { Schema } from "effect"

// Create a schema and make all properties required
const schema = Schema.required(
  Schema.Struct({
    a: Schema.optionalWith(Schema.String, { exact: true }),
    b: Schema.optionalWith(Schema.Number, { exact: true })
  })
)

//     ┌─── { readonly a: string; readonly b: number; }
//     ▼
type Type = typeof schema.Type


In this example, both a and b are made required, even though they were initially defined as optional.

keyof
The Schema.keyof operation creates a schema that represents the keys of a given object schema.

Example (Extracting Keys from an Object Schema)

import { Schema } from "effect"

const schema = Schema.Struct({
  a: Schema.String,
  b: Schema.Number
})

const keys = Schema.keyof(schema)

//     ┌─── "a" | "b"
//     ▼
type Type = typeof keys.Type


Edit page
Previous
Getting Started