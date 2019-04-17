---
title: Lexical elements
description: Descriptions of Flux comments, tokens, identifiers, keywords, and other lexical elements.
menu:
  flux_0_x:
    parent: Language reference
    name: Lexical elements
    weight: 50
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.
Any section that is not currently implemented is commented with a `[IMPL#XXX]` where `XXX` is an issue number tracking discussion and progress towards implementation.

## Comments

Comment serve as documentation.
Comments begin with the character sequence `//` and stop at the end of the line.

Comments cannot start inside string or regexp literals.
Comments act like newlines.

## Tokens

Flux is built up from tokens.
There are four classes of tokens:

* _identifiers_
* _keywords_
* _operators_
* _literals_


_White space_ formed from spaces, horizontal tabs, carriage returns, and newlines is ignored except as it separates tokens that would otherwise combine into a single token.
While breaking the input into tokens, the next token is the longest sequence of characters that form a valid token.

## Identifiers

Identifiers name entities within a program.
An _identifier_ is a sequence of one or more letters and digits.
An identifier must start with a letter.

```js
    identifier = letter { letter | unicode_digit } .
```

##### Examples of identifiers

```
a
_x
longIdentifierName
αβ
```

## Keywords

The following keywords are reserved and may not be used as identifiers:

```
and    import  not  return   option   test
empty  in      or   package  builtin
```

> [IMPL#256](https://github.com/influxdata/platform/issues/256) Add in and empty operator support.

## Operators

The following character sequences represent operators:

```
+   ==   !=   (   )
-   <    !~   [   ]
*   >    =~   {   }
/   <=   =    ,   :
%   >=   <-   .   |>
```

## Numeric literals

Numeric literals may be integers or floating point values.
Literals have arbitrary precision and are coerced to a specific type when used.

The following coercion rules apply to numeric literals:

* An integer literal can be coerced to an "int", "uint", or "float" type,
* A float literal can be coerced to a "float" type.
* An error will occur if the coerced type cannot represent the literal value.


> [IMPL#255](https://github.com/influxdata/platform/issues/255) Allow numeric literal coercion.

### Integer literals

An integer literal is a sequence of digits representing an integer value.
Only decimal integers are supported.

```js
    int_lit     = "0" | decimal_lit .
    decimal_lit = ( "1" … "9" ) { decimal_digit } .
```

##### Examples of integer literals

```
0
42
317316873
```

## Floating-point literals

A _floating-point literal_ is a decimal representation of a floating-point value.
It has an integer part, a decimal point, and a fractional part.
The integer and fractional part comprise decimal digits.
One of the integer part or the fractional part may be elided.

```js
float_lit = decimals "." [ decimals ]
    | "." decimals .
decimals  = decimal_digit { decimal_digit } .
```

##### Examples of floating-point literals

```js
0.
72.40
072.40  // == 72.40
2.71828
.26
```

> [IMPL#254](https://github.com/influxdata/platform/issues/254) Parse float literals.

### Duration literals

A _duration literal_ is a representation of a length of time.
It has an integer part and a duration unit part.
Multiple durations may be specified together and the resulting duration is the sum of each smaller part.
When several durations are specified together, larger units must appear before smaller ones, and there can be no repeated units.

```js
duration_lit  = { int_lit duration_unit } .
duration_unit = "y" | "mo" | "w" | "d" | "h" | "m" | "s" | "ms" | "us" | "µs" | "ns" .
```

| Units    | Meaning                                 |
| -----    | -------                                 |
| y        | year (12 months)                        |
| mo       | month                                   |
| w        | week (7 days)                           |
| d        | day                                     |
| h        | hour (60 minutes)                       |
| m        | minute (60 seconds)                     |
| s        | second                                  |
| ms       | milliseconds (1 thousandth of a second) |
| us or µs | microseconds (1 millionth of a second)  |
| ns       | nanoseconds (1 billionth of a second)   |

Durations represent a length of time.
Lengths of time are dependent on specific instants in time they occur and as such, durations do not represent a fixed amount of time.
No amount of seconds is equal to a day, as days vary in their number of seconds.
No amount of days is equal to a month, as months vary in their number of days.
A duration consists of three basic time units: seconds, days and months.

Durations can be combined via addition and subtraction.
Durations can be multiplied by an integer value.
These operations are performed on each time unit independently.

##### Examples of duration literals

```js
1s
10d
1h15m // 1 hour and 15 minutes
5w
1mo5d // 1 month and 5 days
```
Durations can be added to date times to produce a new date time.

Addition and subtraction of durations to date times do not commute and are left associative.
Addition and subtraction of durations to date times applies months, days and seconds in that order.
When months are added to a date times and the resulting date is past the end of the month, the day is rolled back to the last day of the month.

##### Examples of duration literals

```js
2018-01-01T00:00:00Z + 1d       // 2018-01-02T00:00:00Z
2018-01-01T00:00:00Z + 1mo      // 2018-02-01T00:00:00Z
2018-01-01T00:00:00Z + 2mo      // 2018-03-01T00:00:00Z
2018-01-31T00:00:00Z + 2mo      // 2018-03-31T00:00:00Z
2018-02-28T00:00:00Z + 2mo      // 2018-04-28T00:00:00Z
2018-01-31T00:00:00Z + 1mo      // 2018-02-28T00:00:00Z, February 31th is rolled back to the last day of the month, February 28th in 2018.

// Addition and subtraction of durations to date times does not commute
2018-02-28T00:00:00Z + 1mo + 1d // 2018-03-29T00:00:00Z
2018-02-28T00:00:00Z + 1d + 1mo // 2018-04-01T00:00:00Z
2018-01-01T00:00:00Z + 2mo - 1d // 2018-02-28T00:00:00Z
2018-01-01T00:00:00Z - 1d + 3mo // 2018-03-31T00:00:00Z

// Addition and subtraction of durations to date times applies months, days and seconds in that order.
2018-01-28T00:00:00Z + 1mo + 2d // 2018-03-02T00:00:00Z
2018-01-28T00:00:00Z + 1mo2d    // 2018-03-02T00:00:00Z
2018-01-28T00:00:00Z + 2d + 1mo // 2018-02-28T00:00:00Z, explicit left associative add of 2d first changes the result
2018-02-01T00:00:00Z + 2mo2d    // 2018-04-03T00:00:00Z
2018-01-01T00:00:00Z + 1mo30d   // 2018-03-02T00:00:00Z, Months are applied first to get February 1st, then days are added resulting in March 2 in 2018.
2018-01-31T00:00:00Z + 1mo1d    // 2018-03-01T00:00:00Z, Months are applied first to get February 28th, then days are added resulting in March 1 in 2018.
```

> To be added: [IMPL#657](https://github.com/influxdata/platform/issues/657) Implement Duration vectors.

## Date and time literals

A _date and time literal_ represents a specific moment in time.
It has a date part, a time part and a time offset part.
The format follows the [RFC 3339](https://tools.ietf.org/html/rfc3339) specification.
The time is optional.
When it is omitted, the time is assumed to be midnight for the default location.
The `time_offset` is optional.
When it is omitted, the location option is used to determine the offset.

```js
date_time_lit     = date [ "T" time ] .
date              = year_lit "-" month "-" day .
year              = decimal_digit decimal_digit decimal_digit decimal_digit .
month             = decimal_digit decimal_digit .
day               = decimal_digit decimal_digit .
time              = hour ":" minute ":" second [ fractional_second ] [ time_offset ] .
hour              = decimal_digit decimal_digit .
minute            = decimal_digit decimal_digit .
second            = decimal_digit decimal_digit .
fractional_second = "."  { decimal_digit } .
time_offset       = "Z" | ("+" | "-" ) hour ":" minute .
```

##### Examples of date and time literals

```js
1952-01-25T12:35:51Z
2018-08-15T13:36:23-07:00
2009-10-15T09:00:00       // October 15th 2009 at 9 AM in the default location
2018-01-01                // midnight on January 1st 2018 in the default location
```

> [IMPL#152](https://github.com/influxdata/flux/issues/152) Implement shorthand time literals.

### String literals

A _string literal_ represents a sequence of characters enclosed in double quotes.
Within the quotes any character may appear except an unescaped double quote.
String literals support several escape sequences.

```
\n   U+000A line feed or newline
\r   U+000D carriage return
\t   U+0009 horizontal tab
\"   U+0022 double quote
\\   U+005C backslash
\{   U+007B open curly bracket
\}   U+007D close curly bracket
```

Additionally, any byte value may be specified via a hex encoding using `\x` as the prefix.

```
string_lit       = `"` { unicode_value | byte_value | StringExpression | newline } `"` .
byte_value       = `\` "x" hex_digit hex_digit .
hex_digit        = "0" … "9" | "A" … "F" | "a" … "f" .
unicode_value    = unicode_char | escaped_char .
escaped_char     = `\` ( "n" | "r" | "t" | `\` | `"` ) .
StringExpression = "{" Expression "}" .
```

> To be added: TODO: With string interpolation `string_lit` is not longer a lexical token as part of a literal, but an entire expression in and of itself.

> [IMPL#252](https://github.com/influxdata/platform/issues/252) Parse string literals.


##### Examples of string literals

```js
"abc"
"string with double \" quote"
"string with backslash \\"
"日本語"
"\xe6\x97\xa5\xe6\x9c\xac\xe8\xaa\x9e" // the explicit UTF-8 encoding of the previous line
```

String literals are also interpolated for embedded expressions to be evaluated as strings.
Embedded expressions are enclosed in curly brackets (`{}`).
The expressions are evaluated in the scope containing the string literal.
The result of an expression is formatted as a string and replaces the string content between the brackets.
All types are formatted as strings according to their literal representation.
A function `printf` exists to allow more precise control over formatting of various types.
To include the literal curly brackets within a string they must be escaped.


> [IMPL#248](https://github.com/influxdata/platform/issues/248) Add printf function.

##### Example: Interpolation

```js
n = 42
"the answer is {n}" // the answer is 42
"the answer is not {n+1}" // the answer is not 43
"openinng curly bracket \{" // openinng curly bracket {
"closing curly bracket \}" // closing curly bracket }
```
[IMPL#251](https://github.com/influxdata/platform/issues/251) Add string interpolation support


### Regular expression literals

A _regular expression literal_ represents a regular expression pattern, enclosed in forward slashes.
Within the forward slashes, any unicode character may appear except for an unescaped forward slash.
The `\x` hex byte value representation from string literals may also be present.

Regular expression literals support only the following escape sequences:

```
  \/   U+002f forward slash
  \\   U+005c backslash
```

```
regexp_lit         = "/" { unicode_char | byte_value | regexp_escape_char } "/" .
regexp_escape_char = `\` (`/` | `\`)
```

##### Examples of regular expression literals

```js
/.*/
/http:\/\/localhost:9999/
/^\xe6\x97\xa5\xe6\x9c\xac\xe8\xaa\x9e(ZZ)?$/
/^日本語(ZZ)?$/ // the above two lines are equivalent
/\\xZZ/ // this becomes the literal pattern "\xZZ"
```

The regular expression syntax is defined by [RE2](https://github.com/google/re2/wiki/Syntax).
