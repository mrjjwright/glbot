Basic Usage
Primitives
The Schema module provides built-in schemas for common primitive types.

Schema	Equivalent TypeScript Type
Schema.String	string
Schema.Number	number
Schema.Boolean	boolean
Schema.BigIntFromSelf	BigInt
Schema.SymbolFromSelf	symbol
Schema.Object	object
Schema.Undefined	undefined
Schema.Void	void
Schema.Any	any
Schema.Unknown	unknown
Schema.Never	never
Example (Using a Primitive Schema)

import { Schema } from "effect"

const schema = Schema.String

// Infers the type as string
//
//     ┌─── string
//     ▼
type Type = typeof schema.Type

// Attempt to decode a null value, which will throw a parse error
Schema.decodeUnknownSync(schema)(null)
/*
throws:
ParseError: Expected string, actual null
*/


asSchema
To make it easier to work with schemas, built-in schemas are exposed with shorter, opaque types when possible.

The Schema.asSchema function allows you to view any schema as Schema<Type, Encoded, Context>.

Example (Expanding a Schema with asSchema)

For example, while Schema.String is defined as a class with a type of typeof Schema.String, using Schema.asSchema provides the schema in its extended form as Schema<string, string, never>.

import { Schema } from "effect"

//     ┌─── typeof Schema.String
//     ▼
const schema = Schema.String

//     ┌─── Schema<string, string, never>
//     ▼
const nomalized = Schema.asSchema(schema)


Unique Symbols
You can create a schema for unique symbols using Schema.UniqueSymbolFromSelf.

Example (Creating a Schema for a Unique Symbol)

import { Schema } from "effect"

const mySymbol = Symbol.for("mySymbol")

const schema = Schema.UniqueSymbolFromSelf(mySymbol)

//     ┌─── typeof mySymbol
//     ▼
type Type = typeof schema.Type

Schema.decodeUnknownSync(schema)(null)
/*
throws:
ParseError: Expected Symbol(mySymbol), actual null
*/


Literals
Literal schemas represent a literal type. You can use them to specify exact values that a type must have.

Literals can be of the following types:

string
number
boolean
null
bigint
Example (Defining Literal Schemas)

import { Schema } from "effect"

// Define various literal schemas
Schema.Null // Same as S.Literal(null)
Schema.Literal("a") // string literal
Schema.Literal(1) // number literal
Schema.Literal(true) // boolean literal
Schema.Literal(2n) // BigInt literal


Example (Defining a Literal Schema for "a")

import { Schema } from "effect"

//     ┌─── Literal<["a"]>
//     ▼
const schema = Schema.Literal("a")

//     ┌─── "a"
//     ▼
type Type = typeof schema.Type

console.log(Schema.decodeUnknownSync(schema)("a"))
// Output: "a"

console.log(Schema.decodeUnknownSync(schema)("b"))
/*
throws:
ParseError: Expected "a", actual "b"
*/


Union of Literals
You can create a union of multiple literals by passing them as arguments to the Schema.Literal constructor:

Example (Defining a Union of Literals)

import { Schema } from "effect"

//     ┌─── Literal<["a", "b", "c"]>
//     ▼
const schema = Schema.Literal("a", "b", "c")

//     ┌─── "a" | "b" | "c"
//     ▼
type Type = typeof schema.Type

Schema.decodeUnknownSync(schema)(null)
/*
throws:
ParseError: "a" | "b" | "c"
├─ Expected "a", actual null
├─ Expected "b", actual null
└─ Expected "c", actual null
*/


If you want to set a custom error message for the entire union of literals, you can use the override: true option (see Custom Error Messages for more details) to specify a unified message.

Example (Adding a Custom Message to a Union of Literals)

import { Schema } from "effect"

// Schema with individual messages for each literal
const individualMessages = Schema.Literal("a", "b", "c")

console.log(Schema.decodeUnknownSync(individualMessages)(null))
/*
throws:
ParseError: "a" | "b" | "c"
├─ Expected "a", actual null
├─ Expected "b", actual null
└─ Expected "c", actual null
*/

// Schema with a unified custom message for all literals
const unifiedMessage = Schema.Literal("a", "b", "c").annotations({
  message: () => ({ message: "Not a valid code", override: true })
})

console.log(Schema.decodeUnknownSync(unifiedMessage)(null))
/*
throws:
ParseError: Not a valid code
*/


Exposed Values
You can access the literals defined in a literal schema using the literals property:

import { Schema } from "effect"

const schema = Schema.Literal("a", "b", "c")

//      ┌─── readonly ["a", "b", "c"]
//      ▼
const literals = schema.literals


The pickLiteral Utility
You can use Schema.pickLiteral with a literal schema to narrow down its possible values.

Example (Using pickLiteral to Narrow Values)

import { Schema } from "effect"

// Create a schema for a subset of literals ("a" and "b") from a larger set
//
//      ┌─── Literal<["a", "b"]>
//      ▼
const schema = Schema.Literal("a", "b", "c").pipe(
  Schema.pickLiteral("a", "b")
)


Sometimes, you may need to reuse a literal schema in other parts of your code. Below is an example demonstrating how to do this:

Example (Creating a Subtype from a Literal Schema)

import { Schema } from "effect"

// Define the base set of fruit categories
const FruitCategory = Schema.Literal("sweet", "citrus", "tropical")

// Define a general Fruit schema with the base category set
const Fruit = Schema.Struct({
  id: Schema.Number,
  category: FruitCategory
})

// Define a specific Fruit schema for only "sweet" and "citrus" categories
const SweetAndCitrusFruit = Schema.Struct({
  id: Schema.Number,
  category: FruitCategory.pipe(Schema.pickLiteral("sweet", "citrus"))
})


In this example, FruitCategory serves as the source of truth for the different fruit categories. We reuse it to create a subtype of Fruit called SweetAndCitrusFruit, ensuring that only the specified categories ("sweet" and "citrus") are allowed. This approach helps maintain consistency throughout your code and provides type safety if the category definition changes.

Template literals
In TypeScript, template literals types allow you to embed expressions within string literals. The Schema.TemplateLiteral constructor allows you to create a schema for these template literal types.

Example (Defining Template Literals)

import { Schema } from "effect"

// This creates a schema for: `a${string}`
//
//      ┌─── TemplateLiteral<`a${string}`>
//      ▼
const schema1 = Schema.TemplateLiteral("a", Schema.String)

// This creates a schema for:
// `https://${string}.com` | `https://${string}.net`
const schema2 = Schema.TemplateLiteral(
  "https://",
  Schema.String,
  ".",
  Schema.Literal("com", "net")
)


Example (From template literals types Documentation)

Let’s look at a more complex example. Suppose you have two sets of locale IDs for emails and footers. You can use the Schema.TemplateLiteral constructor to create a schema that combines these IDs:

import { Schema } from "effect"

const EmailLocaleIDs = Schema.Literal("welcome_email", "email_heading")
const FooterLocaleIDs = Schema.Literal("footer_title", "footer_sendoff")

// This creates a schema for:
// "welcome_email_id" | "email_heading_id" |
// "footer_title_id" | "footer_sendoff_id"
const schema = Schema.TemplateLiteral(
  Schema.Union(EmailLocaleIDs, FooterLocaleIDs),
  "_id"
)


Supported Span Types
The Schema.TemplateLiteral constructor supports the following types of spans:

Schema.String
Schema.Number
Literals: string | number | boolean | null | bigint. These can be either wrapped by Schema.Literal or used directly
Unions of the above types
Brands of the above types
Example (Using a Branded String in a Template Literal)

import { Schema } from "effect"

// Create a branded string schema for an authorization token
const AuthorizationToken = Schema.String.pipe(
  Schema.brand("AuthorizationToken")
)

// This creates a schema for:
// `Bearer ${string & Brand<"AuthorizationToken">}`
const schema = Schema.TemplateLiteral("Bearer ", AuthorizationToken)


TemplateLiteralParser
The Schema.TemplateLiteral constructor, while useful as a simple validator, only verifies that an input conforms to a specific string pattern by converting template literal definitions into regular expressions. Similarly, Schema.pattern employs regular expressions directly for the same purpose. Post-validation, both methods require additional manual parsing to convert the validated string into a usable data format.

To address these limitations and eliminate the need for manual post-validation parsing, the Schema.TemplateLiteralParser API has been developed. It not only validates the input format but also automatically parses it into a more structured and type-safe output, specifically into a tuple format.

The Schema.TemplateLiteralParser constructor supports the same types of spans as Schema.TemplateLiteral.

Example (Using TemplateLiteralParser for Parsing and Encoding)

import { Schema } from "effect"

//      ┌─── Schema<readonly [number, "a", string], `${string}a${string}`>
//      ▼
const schema = Schema.TemplateLiteralParser(
  Schema.NumberFromString,
  "a",
  Schema.NonEmptyString
)

console.log(Schema.decodeSync(schema)("100afoo"))
// Output: [ 100, 'a', 'foo' ]

console.log(Schema.encodeSync(schema)([100, "a", "foo"]))
// Output: '100afoo'


Native enums
The Schema module provides support for native TypeScript enums. You can define a schema for an enum using Schema.Enums, allowing you to validate values that belong to the enum.

Example (Defining a Schema for an Enum)

import { Schema } from "effect"

enum Fruits {
  Apple,
  Banana
}

//      ┌─── Enums<typeof Fruits>
//      ▼
const schema = Schema.Enums(Fruits)

//
//     ┌─── Fruits
//     ▼
type Type = typeof schema.Type


Exposed Values
Enums are accessible through the enums property of the schema. You can use this property to retrieve individual members or the entire set of enum values.

import { Schema } from "effect"

enum Fruits {
  Apple,
  Banana
}

const schema = Schema.Enums(Fruits)

schema.enums // Returns all enum members
schema.enums.Apple // Access the Apple member
schema.enums.Banana // Access the Banana member


Unions
The Schema module includes a built-in Schema.Union constructor for creating “OR” types, allowing you to define schemas that can represent multiple types.

Example (Defining a Union Schema)

import { Schema } from "effect"

//      ┌─── Union<[typeof Schema.String, typeof Schema.Number]>
//      ▼
const schema = Schema.Union(Schema.String, Schema.Number)

//     ┌─── string | number
//     ▼
type Type = typeof schema.Type


Union of Literals
While you can create a union of literals by combining individual literal schemas:

Example (Using Individual Literal Schemas)

import { Schema } from "effect"

//      ┌─── Union<[Schema.Literal<["a"]>, Schema.Literal<["b"]>, Schema.Literal<["c"]>]>
//      ▼
const schema = Schema.Union(
  Schema.Literal("a"),
  Schema.Literal("b"),
  Schema.Literal("c")
)


You can simplify the process by passing multiple literals directly to the Schema.Literal constructor:

Example (Defining a Union of Literals)

import { Schema } from "effect"

//     ┌─── Literal<["a", "b", "c"]>
//     ▼
const schema = Schema.Literal("a", "b", "c")

//     ┌─── "a" | "b" | "c"
//     ▼
type Type = typeof schema.Type


If you want to set a custom error message for the entire union of literals, you can use the override: true option (see Custom Error Messages for more details) to specify a unified message.

Example (Adding a Custom Message to a Union of Literals)

import { Schema } from "effect"

// Schema with individual messages for each literal
const individualMessages = Schema.Literal("a", "b", "c")

console.log(Schema.decodeUnknownSync(individualMessages)(null))
/*
throws:
ParseError: "a" | "b" | "c"
├─ Expected "a", actual null
├─ Expected "b", actual null
└─ Expected "c", actual null
*/

// Schema with a unified custom message for all literals
const unifiedMessage = Schema.Literal("a", "b", "c").annotations({
  message: () => ({ message: "Not a valid code", override: true })
})

console.log(Schema.decodeUnknownSync(unifiedMessage)(null))
/*
throws:
ParseError: Not a valid code
*/


Nullables
The Schema module includes utility functions for defining schemas that allow nullable types, helping to handle values that may be null, undefined, or both.

Example (Creating Nullable Schemas)

import { Schema } from "effect"

// Represents a schema for a string or null value
Schema.NullOr(Schema.String)

// Represents a schema for a string, null, or undefined value
Schema.NullishOr(Schema.String)

// Represents a schema for a string or undefined value
Schema.UndefinedOr(Schema.String)


Discriminated unions
Discriminated unions in TypeScript are a way of modeling complex data structures that may take on different forms based on a specific set of conditions or properties. They allow you to define a type that represents multiple related shapes, where each shape is uniquely identified by a shared discriminant property.

In a discriminated union, each variant of the union has a common property, called the discriminant. The discriminant is a literal type, which means it can only have a finite set of possible values. Based on the value of the discriminant property, TypeScript can infer which variant of the union is currently in use.

Example (Defining a Discriminated Union in TypeScript)

type Circle = {
  readonly kind: "circle"
  readonly radius: number
}

type Square = {
  readonly kind: "square"
  readonly sideLength: number
}

type Shape = Circle | Square


In the Schema module, you can define a discriminated union similarly by specifying a literal field as the discriminant for each type.

Example (Defining a Discriminated Union Using Schema)

import { Schema } from "effect"

const Circle = Schema.Struct({
  kind: Schema.Literal("circle"),
  radius: Schema.Number
})

const Square = Schema.Struct({
  kind: Schema.Literal("square"),
  sideLength: Schema.Number
})

const Shape = Schema.Union(Circle, Square)


In this example, the Schema.Literal constructor sets up the kind property as the discriminant for both Circle and Square schemas. The Shape schema then represents a union of these two types, allowing TypeScript to infer the specific shape based on the kind value.

Transforming a Simple Union into a Discriminated Union
If you start with a simple union and want to transform it into a discriminated union, you can add a special property to each member. This allows TypeScript to automatically infer the correct type based on the value of the discriminant property.

Example (Initial Simple Union)

For example, let’s say you’ve defined a Shape union as a combination of Circle and Square without any special property:

import { Schema } from "effect"

const Circle = Schema.Struct({
  radius: Schema.Number
})

const Square = Schema.Struct({
  sideLength: Schema.Number
})

const Shape = Schema.Union(Circle, Square)


To make your code more manageable, you may want to transform the simple union into a discriminated union. This way, TypeScript will be able to automatically determine which member of the union you’re working with based on the value of a specific property.

To achieve this, you can add a special property to each member of the union, which will allow TypeScript to know which type it’s dealing with at runtime. Here’s how you can transform the Shape schema into another schema that represents a discriminated union:

Example (Adding Discriminant Property)

import { Schema } from "effect"

const Circle = Schema.Struct({
  radius: Schema.Number
})

const Square = Schema.Struct({
  sideLength: Schema.Number
})

const DiscriminatedShape = Schema.Union(
  Schema.transform(
    Circle,
    // Add a "kind" property with the literal value "circle" to Circle
    Schema.Struct({ ...Circle.fields, kind: Schema.Literal("circle") }),
    {
      strict: true,
      // Add the discriminant property to Circle
      decode: (circle) => ({ ...circle, kind: "circle" as const }),
      // Remove the discriminant property
      encode: ({ kind: _kind, ...rest }) => rest
    }
  ),

  Schema.transform(
    Square,
    // Add a "kind" property with the literal value "square" to Square
    Schema.Struct({ ...Square.fields, kind: Schema.Literal("square") }),
    {
      strict: true,
      // Add the discriminant property to Square
      decode: (square) => ({ ...square, kind: "square" as const }),
      // Remove the discriminant property
      encode: ({ kind: _kind, ...rest }) => rest
    }
  )
)

console.log(Schema.decodeUnknownSync(DiscriminatedShape)({ radius: 10 }))
// Output: { radius: 10, kind: 'circle' }

console.log(
  Schema.decodeUnknownSync(DiscriminatedShape)({ sideLength: 10 })
)
// Output: { sideLength: 10, kind: 'square' }


The previous solution works perfectly and shows how we can add properties to our schema at will, making it easier to consume the result within our domain model. However, it requires a lot of boilerplate. Fortunately, there is an API called Schema.attachPropertySignature designed specifically for this use case, which allows us to achieve the same result with much less effort:

Example (Using Schema.attachPropertySignature for Less Code)

import { Schema } from "effect"

const Circle = Schema.Struct({
  radius: Schema.Number
})

const Square = Schema.Struct({
  sideLength: Schema.Number
})

const DiscriminatedShape = Schema.Union(
  Circle.pipe(Schema.attachPropertySignature("kind", "circle")),
  Square.pipe(Schema.attachPropertySignature("kind", "square"))
)

// decoding
console.log(Schema.decodeUnknownSync(DiscriminatedShape)({ radius: 10 }))
// Output: { radius: 10, kind: 'circle' }

// encoding
console.log(
  Schema.encodeSync(DiscriminatedShape)({
    kind: "circle",
    radius: 10
  })
)
// Output: { radius: 10 }


Property Addition Only

Please note that with Schema.attachPropertySignature, you can only add a property, it cannot replace or override an existing one.

Exposed Values
You can access the individual members of a union schema represented as a tuple:

import { Schema } from "effect"

const schema = Schema.Union(Schema.String, Schema.Number)

// Accesses the members of the union
const members = schema.members

//      ┌─── typeof Schema.String
//      ▼
const firstMember = members[0]

//      ┌─── typeof Schema.Number
//      ▼
const secondMember = members[1]


Tuples
The Schema module allows you to define tuples, which are ordered collections of elements that may have different types. You can define tuples with required, optional, or rest elements.

Required Elements
To define a tuple with required elements, you can use the Schema.Tuple constructor and simply list the element schemas in order:

Example (Defining a Tuple with Required Elements)

import { Schema } from "effect"

// Define a tuple with a string and a number as required elements
//
//      ┌─── Tuple<[typeof Schema.String, typeof Schema.Number]>
//      ▼
const schema = Schema.Tuple(Schema.String, Schema.Number)

//     ┌─── readonly [string, number]
//     ▼
type Type = typeof schema.Type


Append a Required Element
You can append additional required elements to an existing tuple by using the spread operator:

Example (Adding an Element to an Existing Tuple)

import { Schema } from "effect"

const tuple1 = Schema.Tuple(Schema.String, Schema.Number)

// Append a boolean to the existing tuple
const tuple2 = Schema.Tuple(...tuple1.elements, Schema.Boolean)

//     ┌─── readonly [string, number, boolean]
//     ▼
type Type = typeof tuple2.Type


Optional Elements
To define an optional element, use the Schema.optionalElement constructor.

Example (Defining a Tuple with Optional Elements)

import { Schema } from "effect"

// Define a tuple with a required string and an optional number
const schema = Schema.Tuple(
  Schema.String, // required element
  Schema.optionalElement(Schema.Number) // optional element
)

//     ┌─── readonly [string, number?]
//     ▼
type Type = typeof schema.Type


Rest Element
To define a rest element, add it after the list of required or optional elements. The rest element allows the tuple to accept additional elements of a specific type.

Example (Using a Rest Element)

import { Schema } from "effect"

// Define a tuple with required elements and a rest element of type boolean
const schema = Schema.Tuple(
  [Schema.String, Schema.optionalElement(Schema.Number)], // elements
  Schema.Boolean // rest element
)

//     ┌─── readonly [string, number?, ...boolean[]]
//     ▼
type Type = typeof schema.Type


You can also include other elements after the rest:

Example (Including Additional Elements After a Rest Element)

import { Schema } from "effect"

// Define a tuple with required elements, a rest element,
// and an additional element
const schema = Schema.Tuple(
  [Schema.String, Schema.optionalElement(Schema.Number)], // elements
  Schema.Boolean, // rest element
  Schema.String // additional element
)

//     ┌─── readonly [string, number | undefined, ...boolean[], string]
//     ▼
type Type = typeof schema.Type


Annotations
Annotations are useful for adding metadata to tuple elements, making it easier to describe their purpose or requirements. This is especially helpful for generating documentation or JSON schemas.

Example (Adding Annotations to Tuple Elements)

import { JSONSchema, Schema } from "effect"

// Define a tuple representing a point with annotations for each coordinate
const Point = Schema.Tuple(
  Schema.element(Schema.Number).annotations({
    title: "X",
    description: "X coordinate"
  }),
  Schema.optionalElement(Schema.Number).annotations({
    title: "Y",
    description: "optional Y coordinate"
  })
)

// Generate a JSON Schema from the tuple
console.log(JSONSchema.make(Point))
/*
Output:
{
  '$schema': 'http://json-schema.org/draft-07/schema#',
  type: 'array',
  minItems: 1,
  items: [
    { type: 'number', description: 'X coordinate', title: 'X' },
    {
      type: 'number',
      description: 'optional Y coordinate',
      title: 'Y'
    }
  ],
  additionalItems: false
}
*/


Exposed Values
You can access the elements and rest elements of a tuple schema using the elements and rest properties:

Example (Accessing Elements and Rest Element in a Tuple Schema)

import { Schema } from "effect"

// Define a tuple with required, optional, and rest elements
const schema = Schema.Tuple(
  [Schema.String, Schema.optionalElement(Schema.Number)], // elements
  Schema.Boolean, // rest element
  Schema.String // additional element
)

// Access the required and optional elements of the tuple
//
//      ┌─── readonly [typeof Schema.String, Schema.Element<typeof Schema.Number, "?">]
//      ▼
const tupleElements = schema.elements

// Access the rest element of the tuple
//
//      ┌─── readonly [typeof Schema.Boolean, typeof Schema.String]
//      ▼
const restElement = schema.rest


Arrays
The Schema module allows you to define schemas for arrays, making it easy to validate collections of elements of a specific type.

Example (Defining an Array Schema)

import { Schema } from "effect"

// Define a schema for an array of numbers
//
//      ┌─── Array$<typeof Schema.Number>
//      ▼
const schema = Schema.Array(Schema.Number)

//     ┌─── readonly number[]
//     ▼
type Type = typeof schema.Type


Mutable Arrays
By default, Schema.Array generates a type marked as readonly. To create a schema for a mutable array, you can use the Schema.mutable function, which makes the array type mutable in a shallow manner.

Example (Creating a Mutable Array Schema)

import { Schema } from "effect"

// Define a schema for a mutable array of numbers
//
//      ┌─── mutable<Schema.Array$<typeof Schema.Number>>
//      ▼
const schema = Schema.mutable(Schema.Array(Schema.Number))

//     ┌─── number[]
//     ▼
type Type = typeof schema.Type


Exposed Values
You can access the value type of an array schema using the value property:

Example (Accessing the Value Type of an Array Schema)

import { Schema } from "effect"

const schema = Schema.Array(Schema.Number)

// Access the value type of the array schema
//
//      ┌─── typeof Schema.Number
//      ▼
const value = schema.value


Non Empty Arrays
The Schema module also provides a way to define schemas for non-empty arrays, ensuring that the array always contains at least one element.

Example (Defining a Non-Empty Array Schema)

import { Schema } from "effect"

// Define a schema for a non-empty array of numbers
//
//      ┌─── NonEmptyArray<typeof Schema.Number>
//      ▼
const schema = Schema.NonEmptyArray(Schema.Number)

//     ┌─── readonly [number, ...number[]]
//     ▼
type Type = typeof schema.Type


Exposed Values
You can access the value type of a non-empty array schema using the value property:

Example (Accessing the Value Type of a Non-Empty Array Schema)

import { Schema } from "effect"

// Define a schema for a non-empty array of numbers
const schema = Schema.NonEmptyArray(Schema.Number)

// Access the value type of the non-empty array schema
//
//      ┌─── typeof Schema.Number
//      ▼
const value = schema.value