Effect Data Types
Interop With Data
The Data module in the Effect ecosystem simplifies value comparison by automatically implementing the Equal and Hash traits. This eliminates the need for manual implementations, making equality checks straightforward.

Example (Comparing Structs with Data)

import { Data, Equal } from "effect"

const person1 = Data.struct({ name: "Alice", age: 30 })
const person2 = Data.struct({ name: "Alice", age: 30 })

console.log(Equal.equals(person1, person2))
// Output: true


By default, schemas like Schema.Struct do not implement the Equal and Hash traits. This means that two decoded objects with identical values will not be considered equal.

Example (Default Behavior Without Equal and Hash)

import { Schema } from "effect"
import { Equal } from "effect"

const schema = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

const decode = Schema.decode(schema)

const person1 = decode({ name: "Alice", age: 30 })
const person2 = decode({ name: "Alice", age: 30 })

console.log(Equal.equals(person1, person2))
// Output: false


The Schema.Data function can be used to enhance a schema by including the Equal and Hash traits. This allows the resulting objects to support value-based equality.

Example (Using Schema.Data to Add Equality)

import { Schema } from "effect"
import { Equal } from "effect"

const schema = Schema.Data(
  Schema.Struct({
    name: Schema.String,
    age: Schema.Number
  })
)

const decode = Schema.decode(schema)

const person1 = decode({ name: "Alice", age: 30 })
const person2 = decode({ name: "Alice", age: 30 })

console.log(Equal.equals(person1, person2))
// Output: true


Config
The Schema.Config function allows you to validate and manage application configuration settings using structured schemas. It ensures consistency in configuration data and provides detailed feedback for validation errors.

Syntax

Config: <A>(name: string, schema: Schema<A, string>) => Config<A>

This function requires two parameters:

name: Identifier for the configuration setting.
schema: Schema describing the expected data type and structure.
The function returns a Config object that is directly integrated with your application’s configuration management system.

The Schema.Config function operates through the following steps:

Fetching Configuration: The configuration value is retrieved based on its name.
Validation: The value is then validated against the schema. If the value does not conform to the schema, the function formats and returns detailed validation errors.
Error Formatting: Errors are formatted using TreeFormatter.formatErrorSync to provide clear, actionable error messages.
Example (Validating Configuration Settings)

import { Schema } from "effect"
import { Effect } from "effect"

const myconfig = Schema.Config(
  "Foo",
  Schema.String.pipe(Schema.minLength(4))
)

const program = Effect.gen(function* () {
  const foo = yield* myconfig
  console.log(`ok: ${foo}`)
})

Effect.runSync(program)


To test the configuration, execute the following commands:

Test (with Missing Configuration Data)
Terminal window
npx tsx config.ts
# Output:
# [(Missing data at Foo: "Expected Foo to exist in the process context")]

Test (with Invalid Data)
Terminal window
Foo=bar npx tsx config.ts
# Output:
# [(Invalid data at Foo: "a string at least 4 character(s) long
# └─ Predicate refinement failure
#    └─ Expected a string at least 4 character(s) long, actual "bar"")]

Test (with Valid Data)
Terminal window
Foo=foobar npx tsx config.ts
# Output:
# ok: foobar

Option
Option
The Schema.Option function is useful for converting an Option into a JSON-serializable format.

Syntax

Schema.Option(schema: Schema<A, I, R>)

Decoding
Input	Output
{ _tag: "None" }	Converted to Option.none()
{ _tag: "Some", value: I }	Converted to Option.some(a), where I is decoded into A using the inner schema
Encoding
Input	Output
Option.none()	Converted to { _tag: "None" }
Option.some(A)	Converted to { _tag: "Some", value: I }, where A is encoded into I using the inner schema
Example

import { Schema } from "effect"
import { Option } from "effect"

const schema = Schema.Option(Schema.NumberFromString)

//     ┌─── OptionEncoded<string>
//     ▼
type Encoded = typeof schema.Encoded

//     ┌─── Option<number>
//     ▼
type Type = typeof schema.Type

const decode = Schema.decodeUnknownSync(schema)
const encode = Schema.encodeSync(schema)

// Decoding examples

console.log(decode({ _tag: "None" }))
// Output: { _id: 'Option', _tag: 'None' }

console.log(decode({ _tag: "Some", value: "1" }))
// Output: { _id: 'Option', _tag: 'Some', value: 1 }

// Encoding examples

console.log(encode(Option.none()))
// Output: { _tag: 'None' }

console.log(encode(Option.some(1)))
// Output: { _tag: 'Some', value: '1' }


OptionFromSelf
The Schema.OptionFromSelf function is designed for scenarios where Option values are already in the Option format and need to be decoded or encoded while transforming the inner value according to the provided schema.

Syntax

Schema.OptionFromSelf(schema: Schema<A, I, R>)

Decoding
Input	Output
Option.none()	Remains as Option.none()
Option.some(I)	Converted to Option.some(A), where I is decoded into A using the inner schema
Encoding
Input	Output
Option.none()	Remains as Option.none()
Option.some(A)	Converted to Option.some(I), where A is encoded into I using the inner schema
Example

import { Schema } from "effect"
import { Option } from "effect"

const schema = Schema.OptionFromSelf(Schema.NumberFromString)

//     ┌─── Option<string>
//     ▼
type Encoded = typeof schema.Encoded

//     ┌─── Option<number>
//     ▼
type Type = typeof schema.Type

const decode = Schema.decodeUnknownSync(schema)
const encode = Schema.encodeSync(schema)

// Decoding examples

console.log(decode(Option.none()))
// Output: { _id: 'Option', _tag: 'None' }

console.log(decode(Option.some("1")))
// Output: { _id: 'Option', _tag: 'Some', value: 1 }

// Encoding examples

console.log(encode(Option.none()))
// Output: { _id: 'Option', _tag: 'None' }

console.log(encode(Option.some(1)))
// Output: { _id: 'Option', _tag: 'Some', value: '1' }


OptionFromUndefinedOr
The Schema.OptionFromUndefinedOr function handles cases where undefined is treated as Option.none(), and all other values are interpreted as Option.some() based on the provided schema.

Syntax

Schema.OptionFromUndefinedOr(schema: Schema<A, I, R>)

Decoding
Input	Output
undefined	Converted to Option.none()
I	Converted to Option.some(A), where I is decoded into A using the inner schema
Encoding
Input	Output
Option.none()	Converted to undefined
Option.some(A)	Converted to I, where A is encoded into I using the inner schema
Example

import { Schema } from "effect"
import { Option } from "effect"

const schema = Schema.OptionFromUndefinedOr(Schema.NumberFromString)

//     ┌─── string | undefined
//     ▼
type Encoded = typeof schema.Encoded

//     ┌─── Option<number>
//     ▼
type Type = typeof schema.Type

const decode = Schema.decodeUnknownSync(schema)
const encode = Schema.encodeSync(schema)

// Decoding examples

console.log(decode(undefined))
// Output: { _id: 'Option', _tag: 'None' }

console.log(decode("1"))
// Output: { _id: 'Option', _tag: 'Some', value: 1 }

// Encoding examples

console.log(encode(Option.none()))
// Output: undefined

console.log(encode(Option.some(1)))
// Output: "1"


OptionFromNullOr
The Schema.OptionFromUndefinedOr function handles cases where null is treated as Option.none(), and all other values are interpreted as Option.some() based on the provided schema.

Syntax

Schema.OptionFromNullOr(schema: Schema<A, I, R>)

Decoding
Input	Output
null	Converted to Option.none()
I	Converted to Option.some(A), where I is decoded into A using the inner schema
Encoding
Input	Output
Option.none()	Converted to null
Option.some(A)	Converted to I, where A is encoded into I using the inner schema
Example

import { Schema } from "effect"
import { Option } from "effect"

const schema = Schema.OptionFromNullOr(Schema.NumberFromString)

//     ┌─── string | null
//     ▼
type Encoded = typeof schema.Encoded

//     ┌─── Option<number>
//     ▼
type Type = typeof schema.Type

const decode = Schema.decodeUnknownSync(schema)
const encode = Schema.encodeSync(schema)

// Decoding examples

console.log(decode(null))
// Output: { _id: 'Option', _tag: 'None' }

console.log(decode("1"))
// Output: { _id: 'Option', _tag: 'Some', value: 1 }

// Encoding examples

console.log(encode(Option.none()))
// Output: null
console.log(encode(Option.some(1)))
// Output: "1"


OptionFromNullishOr
The Schema.OptionFromNullishOr function handles cases where null or undefined are treated as Option.none(), and all other values are interpreted as Option.some() based on the provided schema. Additionally, it allows customization of how Option.none() is encoded (null or undefined).

Syntax

Schema.OptionFromNullishOr(
  schema: Schema<A, I, R>,
  onNoneEncoding: null | undefined
)

Decoding
Input	Output
undefined	Converted to Option.none()
null	Converted to Option.none()
I	Converted to Option.some(A), where I is decoded into A using the inner schema
Encoding
Input	Output
Option.none()	Converted to undefined or null based on user choice (onNoneEncoding)
Option.some(A)	Converted to I, where A is encoded into I using the inner schema
Example

import { Schema } from "effect"
import { Option } from "effect"

const schema = Schema.OptionFromNullishOr(
  Schema.NumberFromString,
  undefined // Encode Option.none() as undefined
)

//     ┌─── string | null | undefined
//     ▼
type Encoded = typeof schema.Encoded

//     ┌─── Option<number>
//     ▼
type Type = typeof schema.Type

const decode = Schema.decodeUnknownSync(schema)
const encode = Schema.encodeSync(schema)

// Decoding examples

console.log(decode(null))
// Output: { _id: 'Option', _tag: 'None' }

console.log(decode(undefined))
// Output: { _id: 'Option', _tag: 'None' }

console.log(decode("1"))
// Output: { _id: 'Option', _tag: 'Some', value: 1 }

// Encoding examples

console.log(encode(Option.none()))
// Output: undefined

console.log(encode(Option.some(1)))
// Output: "1"


OptionFromNonEmptyTrimmedString
The Schema.OptionFromNonEmptyTrimmedString schema is designed for handling strings where trimmed empty strings are treated as Option.none(), and all other strings are converted to Option.some().

Decoding
Input	Output
s: string	Converted to Option.some(s), if s.trim().length > 0
Converted to Option.none() otherwise
Encoding
Input	Output
Option.none()	Converted to ""
Option.some(s: string)	Converted to s
Example

import { Schema, Option } from "effect"

//     ┌─── string
//     ▼
type Encoded = typeof Schema.OptionFromNonEmptyTrimmedString

//     ┌─── Option<string>
//     ▼
type Type = typeof Schema.OptionFromNonEmptyTrimmedString

const decode = Schema.decodeUnknownSync(
  Schema.OptionFromNonEmptyTrimmedString
)
const encode = Schema.encodeSync(Schema.OptionFromNonEmptyTrimmedString)

// Decoding examples

console.log(decode(""))
// Output: { _id: 'Option', _tag: 'None' }

console.log(decode(" a "))
// Output: { _id: 'Option', _tag: 'Some', value: 'a' }

console.log(decode("a"))
// Output: { _id: 'Option', _tag: 'Some', value: 'a' }

// Encoding examples

console.log(encode(Option.none()))
// Output: ""

console.log(encode(Option.some("example")))
// Output: "example"


Either
Either
The Schema.Either function is useful for converting an Either into a JSON-serializable format.

Syntax

Schema.Either(options: {
  left: Schema<LA, LI, LR>,
  right: Schema<RA, RI, RR>
})

Decoding
Input	Output
{ _tag: "Left", left: LI }	Converted to Either.left(LA), where LI is decoded into LA using the inner left schema
{ _tag: "Right", right: RI }	Converted to Either.right(RA), where RI is decoded into RA using the inner right schema
Encoding
Input	Output
Either.left(LA)	Converted to { _tag: "Left", left: LI }, where LA is encoded into LI using the inner left schema
Either.right(RA)	Converted to { _tag: "Right", right: RI }, where RA is encoded into RI using the inner right schema
Example

import { Schema, Either } from "effect"

const schema = Schema.Either({
  left: Schema.Trim,
  right: Schema.NumberFromString
})

//     ┌─── EitherEncoded<string, string>
//     ▼
type Encoded = typeof schema.Encoded

//     ┌─── Either<number, string>
//     ▼
type Type = typeof schema.Type

const decode = Schema.decodeUnknownSync(schema)
const encode = Schema.encodeSync(schema)

// Decoding examples

console.log(decode({ _tag: "Left", left: " a " }))
// Output: { _id: 'Either', _tag: 'Left', left: 'a' }

console.log(decode({ _tag: "Right", right: "1" }))
// Output: { _id: 'Either', _tag: 'Right', right: 1 }

// Encoding examples

console.log(encode(Either.left("a")))
// Output: { _tag: 'Left', left: 'a' }

console.log(encode(Either.right(1)))
// Output: { _tag: 'Right', right: '1' }


EitherFromSelf
The Schema.EitherFromSelf function is designed for scenarios where Either values are already in the Either format and need to be decoded or encoded while transforming the inner valued according to the provided schemas.

Syntax

Schema.EitherFromSelf(options: {
  left: Schema<LA, LI, LR>,
  right: Schema<RA, RI, RR>
})

Decoding
Input	Output
Either.left(LI)	Converted to Either.left(LA), where LI is decoded into LA using the inner left schema
Either.right(RI)	Converted to Either.right(RA), where RI is decoded into RA using the inner right schema
Encoding
Input	Output
Either.left(LA)	Converted to Either.left(LI), where LA is encoded into LI using the inner left schema
Either.right(RA)	Converted to Either.right(RI), where RA is encoded into RI using the inner right schema
Example

import { Schema, Either } from "effect"

const schema = Schema.EitherFromSelf({
  left: Schema.Trim,
  right: Schema.NumberFromString
})

//     ┌─── Either<string, string>
//     ▼
type Encoded = typeof schema.Encoded

//     ┌─── Either<number, string>
//     ▼
type Type = typeof schema.Type

const decode = Schema.decodeUnknownSync(schema)
const encode = Schema.encodeSync(schema)

// Decoding examples

console.log(decode(Either.left(" a ")))
// Output: { _id: 'Either', _tag: 'Left', left: 'a' }

console.log(decode(Either.right("1")))
// Output: { _id: 'Either', _tag: 'Right', right: 1 }

// Encoding examples

console.log(encode(Either.left("a")))
// Output: { _id: 'Either', _tag: 'Left', left: 'a' }

console.log(encode(Either.right(1)))
// Output: { _id: 'Either', _tag: 'Right', right: '1' }


EitherFromUnion
The Schema.EitherFromUnion function is designed to decode and encode Either values where the left and right sides are represented as distinct types. This schema enables conversions between raw union types and structured Either types.

Syntax

Schema.EitherFromUnion(options: {
  left: Schema<LA, LI, LR>,
  right: Schema<RA, RI, RR>
})

Decoding
Input	Output
LI	Converted to Either.left(LA), where LI is decoded into LA using the inner left schema
RI	Converted to Either.right(RA), where RI is decoded into RA using the inner right schema
Encoding
Input	Output
Either.left(LA)	Converted to LI, where LA is encoded into LI using the inner left schema
Either.right(RA)	Converted to RI, where RA is encoded into RI using the inner right schema
Example

import { Schema, Either } from "effect"

const schema = Schema.EitherFromUnion({
  left: Schema.Boolean,
  right: Schema.NumberFromString
})

//     ┌─── string | boolean
//     ▼
type Encoded = typeof schema.Encoded

//     ┌─── Either<number, boolean>
//     ▼
type Type = typeof schema.Type

const decode = Schema.decodeUnknownSync(schema)
const encode = Schema.encodeSync(schema)

// Decoding examples

console.log(decode(true))
// Output: { _id: 'Either', _tag: 'Left', left: true }

console.log(decode("1"))
// Output: { _id: 'Either', _tag: 'Right', right: 1 }

// Encoding examples

console.log(encode(Either.left(true)))
// Output: true

console.log(encode(Either.right(1)))
// Output: "1"


Exit
Exit
The Schema.Exit function is useful for converting an Exit into a JSON-serializable format.

Syntax

Schema.Exit(options: {
  failure: Schema<FA, FI, FR>,
  success: Schema<SA, SI, SR>,
  defect: Schema<DA, DI, DR>
})

Decoding
Input	Output
{ _tag: "Failure", cause: CauseEncoded<FI, DI> }	Converted to Exit.failCause(Cause<FA>), where CauseEncoded<FI, DI> is decoded into Cause<FA> using the inner failure and defect schemas
{ _tag: "Success", value: SI }	Converted to Exit.succeed(SA), where SI is decoded into SA using the inner success schema
Encoding
Input	Output
Exit.failCause(Cause<FA>)	Converted to { _tag: "Failure", cause: CauseEncoded<FI, DI> }, where Cause<FA> is encoded into CauseEncoded<FI, DI> using the inner failure and defect schemas
Exit.succeed(SA)	Converted to { _tag: "Success", value: SI }, where SA is encoded into SI using the inner success schema
Example

import { Schema, Exit } from "effect"

const schema = Schema.Exit({
  failure: Schema.String,
  success: Schema.NumberFromString,
  defect: Schema.String
})

//     ┌─── ExitEncoded<string, string, string>
//     ▼
type Encoded = typeof schema.Encoded

//     ┌─── Exit<number, string>
//     ▼
type Type = typeof schema.Type

const decode = Schema.decodeUnknownSync(schema)
const encode = Schema.encodeSync(schema)

// Decoding examples

console.log(
  decode({ _tag: "Failure", cause: { _tag: "Fail", error: "a" } })
)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'a' }
}
*/

console.log(decode({ _tag: "Success", value: "1" }))
/*
Output:
{ _id: 'Exit', _tag: 'Success', value: 1 }
*/

// Encoding examples

console.log(encode(Exit.fail("a")))
/*
Output:
{ _tag: 'Failure', cause: { _tag: 'Fail', error: 'a' } }
 */

console.log(encode(Exit.succeed(1)))
/*
Output:
{ _tag: 'Success', value: '1' }
*/


ExitFromSelf
The Schema.ExitFromSelf function is designed for scenarios where Exit values are already in the Exit format and need to be decoded or encoded while transforming the inner valued according to the provided schemas.

Syntax

Schema.ExitFromSelf(options: {
  failure: Schema<FA, FI, FR>,
  success: Schema<SA, SI, SR>,
  defect: Schema<DA, DI, DR>
})

Decoding
Input	Output
Exit.failCause(Cause<FI>)	Converted to Exit.failCause(Cause<FA>), where Cause<FI> is decoded into Cause<FA> using the inner failure and defect schemas
Exit.succeed(SI)	Converted to Exit.succeed(SA), where SI is decoded into SA using the inner success schema
Encoding
Input	Output
Exit.failCause(Cause<FA>)	Converted to Exit.failCause(Cause<FI>), where Cause<FA> is decoded into Cause<FI> using the inner failure and defect schemas
Exit.succeed(SA)	Converted to Exit.succeed(SI), where SA is encoded into SI using the inner success schema
Example

import { Schema, Exit } from "effect"

const schema = Schema.ExitFromSelf({
  failure: Schema.String,
  success: Schema.NumberFromString,
  defect: Schema.String
})

//     ┌─── Exit<string, string>
//     ▼
type Encoded = typeof schema.Encoded

//     ┌─── Exit<number, string>
//     ▼
