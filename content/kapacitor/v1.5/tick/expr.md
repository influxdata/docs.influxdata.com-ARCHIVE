---
title: Lambda expressions

menu:
  kapacitor_1_5:
    identifier: expr
    weight: 5
    parent: tick
---

# Overview

TICKscript uses lambda expressions  to define transformations on data points as
well as define Boolean conditions that act as filters.  Lambda expressions wrap
mathematical operations, Boolean operations, internal function calls or a
combination of all three. TICKscript tries to be similar to InfluxQL in that
most expressions that you would use in an InfluxQL `WHERE` clause will work as
expressions in TICKscript, but with its own syntax:

* All field or tag identifiers must be double quoted.
* The comparison operator for equality is `==` not `=`.

All lambda expressions in TICKscript begin with the `lambda:` keyword.

```js
.where(lambda: "host" == 'server001.example.com')
```

In some nodes the results of a lambda expression can be captured into a new
field as a named result using the property setter `.as()`.
In this way they can be used in other nodes further down the pipeline.

<!--
Stateful
--------
-->
The internal functions of lambda expressions can be either stateless or
stateful.  Stateful means that each time the function is evaluated the internal
state can change and will persist until the next evaluation.
<!-- This may seem odd as part of an expression language but it has a powerful use
case.  Within the language a function can be defined that is essentially an
on-line/streaming algorithm and with each call the function state is updated. -->
For example the built-in function `sigma` calculates a running mean and standard
deviation and returns the number of standard deviations the current data point
is away from the mean.

**Example 1 &ndash; the sigma function**

```js
sigma("value") > 3.0
```

Each time that the expression is evaluated it updates the running statistics and
then returns the deviation. The simple expression in Example 1 evaluates to
 `false` while the stream of data points it has received remains within `3.0`
 standard deviations of the running mean.  As soon as a value is processed that
 is more than `3.0` standard deviations from the mean it evaluates to `true`.
 Such an expression can be used inside of a TICKscript to define powerful
 alerts, as illustrated in Example 2 below.

**Example 2 &ndash; TICKscript with lambda expression**

```js
stream
    |from()
    ...
    |alert()
        // use an expression to define when an alert should go critical.
        .crit(lambda: sigma("value") > 3.0)
```

**Note on inadvertent type casting**

Beware that numerical values declared in the TICKscript follow the parsing rules
for literals introduced in the
[Syntax](/kapacitor/v1.5/tick/syntax/#literal-values) document.  They may not be
of a suitable type for the function or operation in which they will be used.
Numerical values that include a decimal will be interpreted as floats.
Numerical values without a decimal will be interpreted as integers.  When
integers and floats are used within the same expression the integer values need
to use the `float()` type conversion function if a float result is desired.
Failure to observe this rule can yield unexpected results.  For example, when
using a lambda expression to calculate a ratio between 0 and 1 of type float to
use in generating a percentage; and when the fields are of type integer, it might
be assumed that a subset field can be divided by the total field to get the
ratio( e.g. `subset/total * 100`).  Such an integer by integer division will
result in an integer value of 0.  Furthermore multiplication of the result of
such an operation by the literal `100` (an integer) will also result in 0.
Casting the integer values to float will result in a valid ratio in the range
between 0 and 1, and then multiplication by the literal `100.0` (a float) will
result in a valid percentage value.  Correctly written, such an operation should
look like this:

`eval(lambda: float("total_error_responses")/float("total_responses") * 100.0)`.

If in the logs an error appears of the type `E! mismatched type to binary
operator...`, check to ensure that the fields on both sides of the operator are
of the same and the desired type.

In short, to ensure that the type of a field value is correct, use the built-in
type conversion functions (see [below](#above-header-type-conversion)).

# Built-in functions

### Stateful functions

##### Count

Count takes no arguments but returns the number of times the expression has been
evaluated.

```js
count() int64
```

##### Sigma

Computes the number of standard deviations a given value is away from the
running mean.  Each time the expression is evaluated the running mean and
standard deviation are updated.

```js
sigma(value float64) float64
```

##### Spread

Computes the running range of all values passed into it.  The range is the
difference between the maximum and minimum values received.

```js
spread(value float64) float64
```
<a id="above-header-type-conversion"></a>
### Stateless functions

#### Type conversion functions

##### Bool

Converts a string into a Boolean via Golang's
[strconv.ParseBool](https://golang.org/pkg/strconv/#ParseBool) function. Numeric
types can also be converted to a bool where a 0 -> false and 1 -> true.

```js
bool(value) bool
```

##### Int

Converts a string or float64 into an int64 via Golang's
[strconv.ParseInt](https://golang.org/pkg/strconv/#ParseInt) or simple
`int64()` coercion.  Strings are assumed to be decimal numbers.  Durations are
converted into an int64 with nanoseconds units.  A Boolean is converted to an
int64 where false -> 0 and true -> 1.

```js
int(value) int64
```

##### Float

Converts a string or int64 into an float64 via Golang's
[strconv.ParseFloat](https://golang.org/pkg/strconv/#ParseInt) or simple
`float64()` coercion.
A Boolean is converted to a float64 where false -> 0.0 and true -> 1.0.

```js
float(value) float64
```

##### String

Converts a bool, int64 or float64 into an string via Golang's
[strconv.Format*](https://golang.org/pkg/strconv/#FormatBool) functions.
Durations are converted to a string representation of the duration.

```js
string(value) string
```

##### Duration

Converts an int64 or a float64 into an duration assuming nanoseconds units.
Strings are converted to duration of the form as duration literals in TICKscript.

```js
duration(value) duration
```

#### Existence

##### IsPresent

Returns a Boolean value based on whether the specified field or tag key is present.
Useful for filtering out data this is missing the specified field or tag.

```js
|where(lambda: isPresent("myfield"))
```

This returns `TRUE` if `myfield` is a valid identifier and `FALSE` otherwise.


#### Time functions

Within each expression the `time` field contains the time of the current data point.
The following functions can be used on the `time` field.
Each function returns an int64.

| Function                 | Description                                                             |
| ----------               | -------------                                                           |
| `unixNano(t time) int64` | the number of nanoseconds elapsed since January 1, 1970 UTC (Unix time) |
| `minute(t time) int64`   | the minute within the hour: range [0,59]                                |
| `hour(t time) int64`     | the hour within the day: range [0,23]                                   |
| `weekday(t time) int64`  | the weekday within the week: range [0,6], 0 is Sunday                   |
| `day(t time) int64`      | the day within the month: range [1,31]                                  |
| `month(t time) int64`    | the month within the year: range [1,12]                                 |
| `year(t time) int64`     | the year                                                                |

Example usage:

```js
lambda: hour("time") >= 9 AND hour("time") < 19
```

The above expression evaluates to `true` if the hour of the day for the data
point falls between 0900 hours and 1900 hours.


#### Math functions

The following mathematical functions are available.
Each function is implemented via the equivalent Go function.

| Function                                                          | Description                                                                                                                      |
| ----------                                                        | -------------                                                                                                                    |
| [abs(x float64) float64](https://golang.org/pkg/math/#Abs)        | Abs returns the absolute value of x.                                                                                             |
| [acos(x float64) float64](https://golang.org/pkg/math/#Acos)      | Acos returns the arccosine, in radians, of x.                                                                                    |
| [acosh(x float64) float64](https://golang.org/pkg/math/#Acosh)    | Acosh returns the inverse hyperbolic cosine of x.                                                                                |
| [asin(x float64) float64](https://golang.org/pkg/math/#Asin)      | Asin returns the arcsine, in radians, of x.                                                                                      |
| [asinh(x float64) float64](https://golang.org/pkg/math/#Asinh)    | Asinh returns the inverse hyperbolic sine of x.                                                                                  |
| [atan(x float64) float64](https://golang.org/pkg/math/#Atan)      | Atan returns the arctangent, in radians, of x.                                                                                   |
| [atan2(y, x float64) float64](https://golang.org/pkg/math/#Atan2) | Atan2 returns the arc tangent of y/x, using the signs of the two to determine the quadrant of the return value.                  |
| [atanh(x float64) float64](https://golang.org/pkg/math/#Atanh)    | Atanh returns the inverse hyperbolic tangent of x.                                                                               |
| [cbrt(x float64) float64](https://golang.org/pkg/math/#Cbrt)      | Cbrt returns the cube root of x.                                                                                                 |
| [ceil(x float64) float64](https://golang.org/pkg/math/#Ceil)      | Ceil returns the least integer value greater than or equal to x.                                                                 |
| [cos(x float64) float64](https://golang.org/pkg/math/#Cos)        | Cos returns the cosine of the radian argument x.                                                                                 |
| [cosh(x float64) float64](https://golang.org/pkg/math/#Cosh)      | Cosh returns the hyperbolic cosine of x.                                                                                         |
| [erf(x float64) float64](https://golang.org/pkg/math/#Erf)        | Erf returns the error function of x.                                                                                             |
| [erfc(x float64) float64](https://golang.org/pkg/math/#Erfc)      | Erfc returns the complementary error function of x.                                                                              |
| [exp(x float64) float64](https://golang.org/pkg/math/#Exp)        | Exp returns e**x, the base-e exponential of x.                                                                                   |
| [exp2(x float64) float64](https://golang.org/pkg/math/#Exp2)      | Exp2 returns 2**x, the base-2 exponential of x.                                                                                  |
| [expm1(x float64) float64](https://golang.org/pkg/math/#Expm1)    | Expm1 returns e**x - 1, the base-e exponential of x minus 1.  It is more accurate than Exp(x) - 1 when x is near zero.           |
| [floor(x float64) float64](https://golang.org/pkg/math/#Floor)    | Floor returns the greatest integer value less than or equal to x.                                                                |
| [gamma(x float64) float64](https://golang.org/pkg/math/#Gamma)    | Gamma returns the Gamma function of x.                                                                                           |
| [hypot(p, q float64) float64](https://golang.org/pkg/math/#Hypot) | Hypot returns Sqrt(p*p + q*q), taking care to avoid unnecessary overflow and underflow.                                          |
| [j0(x float64) float64](https://golang.org/pkg/math/#J0)          | J0 returns the order-zero Bessel function of the first kind.                                                                     |
| [j1(x float64) float64](https://golang.org/pkg/math/#J1)          | J1 returns the order-one Bessel function of the first kind.                                                                      |
| [jn(n int64, x float64) float64](https://golang.org/pkg/math/#Jn) | Jn returns the order-n Bessel function of the first kind.                                                                        |
| [log(x float64) float64](https://golang.org/pkg/math/#Log)        | Log returns the natural logarithm of x.                                                                                          |
| [log10(x float64) float64](https://golang.org/pkg/math/#Log10)    | Log10 returns the decimal logarithm of x.                                                                                        |
| [log1p(x float64) float64](https://golang.org/pkg/math/#Log1p)    | Log1p returns the natural logarithm of 1 plus its argument x.  It is more accurate than Log(1 + x) when x is near zero.          |
| [log2(x float64) float64](https://golang.org/pkg/math/#Log2)      | Log2 returns the binary logarithm of x.                                                                                          |
| [logb(x float64) float64](https://golang.org/pkg/math/#Logb)      | Logb returns the binary exponent of x.                                                                                           |
| [max(x, y float64) float64](https://golang.org/pkg/math/#Max)     | Max returns the larger of x or y.                                                                                                |
| [min(x, y float64) float64](https://golang.org/pkg/math/#Min)     | Min returns the smaller of x or y.                                                                                               |
| [mod(x, y float64) float64](https://golang.org/pkg/math/#Mod)     | Mod returns the floating-point remainder of x/y.  The magnitude of the result is less than y and its sign agrees with that of x. |
| [pow(x, y float64) float64](https://golang.org/pkg/math/#Pow)     | Pow returns x**y, the base-x exponential of y.                                                                                   |
| [pow10(x int64) float64](https://golang.org/pkg/math/#Pow10)      | Pow10 returns 10**e, the base-10 exponential of e.                                                                               |
| [sin(x float64) float64](https://golang.org/pkg/math/#Sin)        | Sin returns the sine of the radian argument x.                                                                                   |
| [sinh(x float64) float64](https://golang.org/pkg/math/#Sinh)      | Sinh returns the hyperbolic sine of x.                                                                                           |
| [sqrt(x float64) float64](https://golang.org/pkg/math/#Sqrt)      | Sqrt returns the square root of x.                                                                                               |
| [tan(x float64) float64](https://golang.org/pkg/math/#Tan)        | Tan returns the tangent of the radian argument x.                                                                                |
| [tanh(x float64) float64](https://golang.org/pkg/math/#Tanh)      | Tanh returns the hyperbolic tangent of x.                                                                                        |
| [trunc(x float64) float64](https://golang.org/pkg/math/#Trunc)    | Trunc returns the integer value of x.                                                                                            |
| [y0(x float64) float64](https://golang.org/pkg/math/#Y0)          | Y0 returns the order-zero Bessel function of the second kind.                                                                    |
| [y1(x float64) float64](https://golang.org/pkg/math/#Y1)          | Y1 returns the order-one Bessel function of the second kind.                                                                     |
| [yn(n int64, x float64) float64](https://golang.org/pkg/math/#Yn) | Yn returns the order-n Bessel function of the second kind.                                                                       |

#### String functions

The following string manipulation functions are available.
Each function is implemented via the equivalent Go function.

| Function                                                                                                  | Description                                                                                                                                                                                                                            |
| ----------                                                                                                | -------------                                                                                                                                                                                                                          |
| [strContains(s,&nbsp;substr&nbsp;string)&nbsp;bool](https://golang.org/pkg/strings/#Contains)                            | StrContains reports whether substr is within s.                                                                                                                                                                                        |
| [strContainsAny(s,&nbsp;chars&nbsp;string)&nbsp;bool](https://golang.org/pkg/strings/#ContainsAny)                       | StrContainsAny reports whether any Unicode code points in chars are within s.                                                                                                                                                          |
| [strCount(s,&nbsp;sep&nbsp;string)&nbsp;int64](https://golang.org/pkg/strings/#Count)                                    | StrCount counts the number of non-overlapping instances of sep in s. If sep is an empty string, Count returns 1 + the number of Unicode code points in s.                                                                              |
| [strHasPrefix(s,&nbsp;prefix&nbsp;string)&nbsp;bool](https://golang.org/pkg/strings/#HasPrefix)                          | StrHasPrefix tests whether the string s begins with prefix.                                                                                                                                                                            |
| [strHasSuffix(s,&nbsp;suffix&nbsp;string)&nbsp;bool](https://golang.org/pkg/strings/#HasSuffix)                          | StrHasSuffix tests whether the string s ends with suffix.                                                                                                                                                                              |
| [strIndex(s,&nbsp;sep&nbsp;string)&nbsp;int64](https://golang.org/pkg/strings/#Index)                                    | StrIndex returns the index of the first instance of sep in s, or -1 if sep is not present in s.                                                                                                                                        |
| [strIndexAny(s,&nbsp;chars&nbsp;string)&nbsp;int64](https://golang.org/pkg/strings/#IndexAny)                            | StrIndexAny returns the index of the first instance of any Unicode code point from chars in s, or -1 if no Unicode code point from chars is present in s.                                                                              |
| [strLastIndex(s,&nbsp;sep&nbsp;string)&nbsp;int64](https://golang.org/pkg/strings/#LastIndex)                            | StrLastIndex returns the index of the last instance of sep in s, or -1 if sep is not present in s.                                                                                                                                     |
| [strLastIndexAny(s,&nbsp;chars&nbsp;string)&nbsp;int64](https://golang.org/pkg/strings/#LastIndexAny)                    | StrLastIndexAny returns the index of the last instance of any Unicode code point from chars in s, or -1 if no Unicode code point from chars is present in s.                                                                           |
| [strLength(s string) int64](https://golang.org/ref/spec#Length_and_capacity)                              | StrLength returns the length of the string.                                                                                                                                                                                            |
| [strReplace(s,&nbsp;old,&nbsp;new&nbsp;string,&nbsp;n&nbsp;int64)&nbsp;string](https://golang.org/pkg/strings/#Replace)                 | StrReplace returns a copy of the string s with the first n non-overlapping instances of old replaced by new.                                                                                                                           |
| [strSubstring(s&nbsp;string,&nbsp;start,&nbsp;stop&nbsp;int64)&nbsp;string](https://golang.org/ref/spec#Index_expressions)         | StrSubstring returns a substring based on the given indexes, strSubstring(str, start, stop) is equivalent to str[start:stop] in Go.                                                                                                    |
| [strToLower(s&nbsp;string)&nbsp;string](https://golang.org/pkg/strings/#ToLower)                                    | StrToLower returns a copy of the string s with all Unicode letters mapped to their lower case.                                                                                                                                         |
| [strToUpper(s&nbsp;string)&nbsp;string](https://golang.org/pkg/strings/#ToUpper)                                    | StrToUpper returns a copy of the string s with all Unicode letters mapped to their upper case.                                                                                                                                         |
| [strTrim(s,&nbsp;cutset&nbsp;string)&nbsp;string](https://golang.org/pkg/strings/#Trim)                                  | StrTrim returns a slice of the string s with all leading and trailing Unicode code points contained in cutset removed.                                                                                                                 |
| [strTrimLeft(s,&nbsp;cutset&nbsp;string)&nbsp;string](https://golang.org/pkg/strings/#TrimLeft)                          | StrTrimLeft returns a slice of the string s with all leading Unicode code points contained in cutset removed.                                                                                                                          |
| [strTrimPrefix(s,&nbsp;prefix&nbsp;string)&nbsp;string](https://golang.org/pkg/strings/#TrimPrefix)                      | StrTrimPrefix returns s without the provided leading prefix string. If s doesn't start with prefix, s is returned unchanged.                                                                                                           |
| [strTrimRight(s,&nbsp;cutset&nbsp;string)&nbsp;string](https://golang.org/pkg/strings/#TrimRight)                        | StrTrimRight returns a slice of the string s, with all trailing Unicode code points contained in cutset removed.                                                                                                                       |
| [strTrimSpace(s&nbsp;string)&nbsp;string](https://golang.org/pkg/strings/#TrimSpace)                                | StrTrimSpace returns a slice of the string s, with all leading and trailing white space removed, as defined by Unicode.                                                                                                                |
| [strTrimSuffix(s,&nbsp;suffix&nbsp;string)&nbsp;string)](https://golang.org/pkg/strings/#TrimSuffix)                     | StrTrimSuffix returns s without the provided trailing suffix string. If s doesn't end with suffix, s is returned unchanged.                                                                                                            |
| [regexReplace(r&nbsp;regex,&nbsp;s,&nbsp;pattern&nbsp;string)&nbsp;string](https://golang.org/pkg/regexp/#Regexp.ReplaceAllString) | RegexReplace replaces matches of the regular expression in the input string with the output string. For example regexReplace(/a(b*)c/, 'abbbc', 'group is $1') -> 'group is bbb'. The original string is returned if no matches are found. |



#### Human string functions

##### HumanBytes

Converts an int64 or a float64 with units bytes into a human readable string representing the number of bytes.

```js
humanBytes(value) string
```


#### Conditional functions

##### If

Returns the result of its operands depending on the value of the first argument.
The second and third arguments must return the same type.

Example:

```js
|eval(lambda: if("field" > threshold AND "field" != 0, 'true', 'false'))
    .as('value')
```

The value of the field `value` in the above example will be the string `true` or `false`, depending on the condition passed as the first argument.

The `if` function's return type is the same type as its second and third arguments.


```js
if(condition, true expression, false expression)
```
