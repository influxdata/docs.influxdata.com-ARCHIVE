---
title: Lambda Expressions

menu:
  kapacitor_011:
    identifier: expr
    weight: 20
    parent: tick
---

TICKscript uses lambda expressions  to define transformations on data points as well as define boolean conditions that act as filters.
TICKscript tries to be similar to InfluxQL in that most expressions that you would use in an InfluxQL `WHERE` clause will work as expressions
in TICKscript.
There are few exceptions:

* All field or tag identifiers must be double quoted.
* The comparison operator for equality is `==` not `=`.

All expressions in TICKscript begin with the `lambda:` keyword.

```javascript
.where(lambda: "host" == 'server001.example.com')
```

Stateful
--------

These lambda expressions are stateful, meaning that each time they are evaluated internal state can change and will persist until the next evaluation.
This may seem odd as part of an expression language but it has a powerful use case.
You can define a function within the language that is essentially a online/streaming algorithm and with each call the function state is updated.
For example the built-in function `sigma` that calculates a running mean and standard deviation and returns the number of standard deviations the current data point is away from the mean.

Example:

```javascript
sigma("value") > 3
```

Each time that the expression is evaluated the new value it updates the running statistics and then returns the deviation.
This simple expression evaluates to `false` while the stream of data points it has received remains within `3` standard deviations of the running mean.
As soon as a value is processed that is more than 3 standard deviation it evaluates to `true`.
Now you can use that expression inside of a TICKscript to define powerful alerts.

TICKscript with lambda expression:

```javascript
stream
    .alert()
        // use an expression to define when an alert should go critical.
.crit(lambda: sigma("value") > 3)
```

Builtin Functions
-----------------

### Bool

Converts a string into a boolean via Go's [strconv.ParseBool](https://golang.org/pkg/strconv/#ParseBool)

```javascript
bool(value string) bool
```

### Int

Converts a string or float64 into an int64 via Go's [strconv.ParseInt](https://golang.org/pkg/strconv/#ParseInt) or simple `float64()` coercion.
Strings are assumed to be decimal numbers.

```javascript
int(value float64 or string) int64
```

### Float

Converts a string or int64 into an float64 via Go's [strconv.ParseFloat](https://golang.org/pkg/strconv/#ParseInt) or simple `int64()` coercion.

```javascript
float(value int64 or string) float64
```

### Sigma

Computes the number of standard deviations a given value is away from the running mean.
Each time the expression is evaluated the running mean and standard deviation are updated.

```javascript
sigma(value float64) float64
```

### Count

Count takes no arguments but returns the number of times the expression has been evaluated.

```javascript
count() int64
```


### Time functions

Within each expression the `time` field contains the time of the current data point.
The following functions can be used on the `time` field.
Each function returns an int64.

| Function | Description |
|----------|-------------|
| minute   | the minute within the hour: range [0,59] |
| hour     | the hour within the day: range [0,23] |
| weekday  | the weekday within the week: range [0,6] 0 is Sunday |
| day      | the day within the month: range [1,31] |
| month    | the month within the year: range [1,12] |
| year     | the year |

Example usage:

```javascript
lambda: hour("time") == 9
```

The above expression evaluates to `true` if the hour of the day for the data point is 9 AM, using local time.


### Math functions

The following mathematical functions are available.
Each function is implemented via the equivalent Go function.
Short descriptions are provided here but see the Go [docs](https://golang.org/pkg/math/)
for more details.

| Function | Description |
|----------|-------------|
| [abs](https://golang.org/pkg/math/#Abs) | Abs returns the absolute value of x.  |
| [acos](https://golang.org/pkg/math/#Acos) | Acos returns the arccosine, in radians, of x.  |
| [acosh](https://golang.org/pkg/math/#Acosh) | Acosh returns the inverse hyperbolic cosine of x.  |
| [asin](https://golang.org/pkg/math/#Asin) | Asin returns the arcsine, in radians, of x.  |
| [asinh](https://golang.org/pkg/math/#Asinh) | Asinh returns the inverse hyperbolic sine of x.  |
| [atan](https://golang.org/pkg/math/#Atan) | Atan returns the arctangent, in radians, of x.  |
| [atan2](https://golang.org/pkg/math/#Atan2) | Atan2 returns the arc tangent of y/x, using the signs of the two to determine the quadrant of the return value.  |
| [atanh](https://golang.org/pkg/math/#Atanh) | Atanh returns the inverse hyperbolic tangent of x.  |
| [cbrt](https://golang.org/pkg/math/#Cbrt) | Cbrt returns the cube root of x.  |
| [ceil](https://golang.org/pkg/math/#Ceil) | Ceil returns the least integer value greater than or equal to x.  |
| [cos](https://golang.org/pkg/math/#Cos) | Cos returns the cosine of the radian argument x.  |
| [cosh](https://golang.org/pkg/math/#Cosh) | Cosh returns the hyperbolic cosine of x.  |
| [erf](https://golang.org/pkg/math/#Erf) | Erf returns the error function of x.  |
| [erfc](https://golang.org/pkg/math/#Erfc) | Erfc returns the complementary error function of x.  |
| [exp](https://golang.org/pkg/math/#Exp) | Exp returns e**x, the base-e exponential of x.  |
| [exp2](https://golang.org/pkg/math/#Exp2) | Exp2 returns 2**x, the base-2 exponential of x.  |
| [expm1](https://golang.org/pkg/math/#Expm1) | Expm1 returns e**x - 1, the base-e exponential of x minus 1.  It is more accurate than Exp(x) - 1 when x is near zero.  |
| [floor](https://golang.org/pkg/math/#Floor) | Floor returns the greatest integer value less than or equal to x.  |
| [gamma](https://golang.org/pkg/math/#Gamma) | Gamma returns the Gamma function of x.  |
| [hypot](https://golang.org/pkg/math/#Hypot) | Hypot returns Sqrt(p*p + q*q), taking care to avoid unnecessary overflow and underflow.  |
| [j0](https://golang.org/pkg/math/#J0) | J0 returns the order-zero Bessel function of the first kind.  |
| [j1](https://golang.org/pkg/math/#J1) | J1 returns the order-one Bessel function of the first kind.  |
| [jn](https://golang.org/pkg/math/#Jn) | Jn returns the order-n Bessel function of the first kind.  |
| [log](https://golang.org/pkg/math/#Log) | Log returns the natural logarithm of x.  |
| [log10](https://golang.org/pkg/math/#Log10) | Log10 returns the decimal logarithm of x.  |
| [log1p](https://golang.org/pkg/math/#Log1p) | Log1p returns the natural logarithm of 1 plus its argument x.  It is more accurate than Log(1 + x) when x is near zero.  |
| [log2](https://golang.org/pkg/math/#Log2) | Log2 returns the binary logarithm of x.  |
| [logb](https://golang.org/pkg/math/#Logb) | Logb returns the binary exponent of x.  |
| [max](https://golang.org/pkg/math/#Max) | Max returns the larger of x or y.  |
| [min](https://golang.org/pkg/math/#Min) | Min returns the smaller of x or y.  |
| [mod](https://golang.org/pkg/math/#Mod) | Mod returns the floating-point remainder of x/y.  The magnitude of the result is less than y and its sign agrees with that of x.  |
| [pow](https://golang.org/pkg/math/#Pow) | Pow returns x**y, the base-x exponential of y.  |
| [pow10](https://golang.org/pkg/math/#Pow10) | Pow10 returns 10**e, the base-10 exponential of e.  |
| [sin](https://golang.org/pkg/math/#Sin) | Sin returns the sine of the radian argument x.  |
| [sinh](https://golang.org/pkg/math/#Sinh) | Sinh returns the hyperbolic sine of x.  |
| [sqrt](https://golang.org/pkg/math/#Sqrt) | Sqrt returns the square root of x.  |
| [tan](https://golang.org/pkg/math/#Tan) | Tan returns the tangent of the radian argument x.  |
| [tanh](https://golang.org/pkg/math/#Tanh) | Tanh returns the hyperbolic tangent of x.  |
| [trunc](https://golang.org/pkg/math/#Trunc) | Trunc returns the integer value of x.  |
| [y0](https://golang.org/pkg/math/#Y0) | Y0 returns the order-zero Bessel function of the second kind.  |
| [y1](https://golang.org/pkg/math/#Y1) | Y1 returns the order-one Bessel function of the second kind.  |
| [yn](https://golang.org/pkg/math/#Yn) | Yn returns the order-n Bessel function of the second kind.  |

