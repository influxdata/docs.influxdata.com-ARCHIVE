---
title: Expressions
---

Kapacitor uses an expression language apart from the TICKscript DSL.
These expressions are used to define transformations on data points as well as define boolean conditions that act as filters.
The expression language is a superset of the InfluxQL `WHERE` clause expressions.
As such any expression that works as a `WHERE` clause in InfluxQL works in the Kapacitor expression language.
In addition to InfluxQL syntax the expressions can have function calls that operate on the fields of a data point.


Stateful
--------

Expressions are stateful, meaning that each time they are evaluated internal state can change and will persist until the next evaluation.
This may seem odd as part of an expression language but it has a powerful use case.
You can define a function within the language that is essentially a online/streaming algorithm and with each call to the function update the state.
For example the built-in function `sigma` that calculates a running mean and standard deviation and returns the number of standard deviations the current data point is away from the mean.

Example:

```javascript
sigma(value) > 3
```

Each time that the expression is evaluated with a new value it updates its running statistics and then returns the deviation.
This simple expression evaluates to `false` while the stream of data points it has received remains within `3` standard deviations of the running mean.
As soon as a value is processed that is more than `3` standard deviation it evaluates to `true`.
Now you can use that expression inside of a TICKscript to define powerful alerts.

TICKscript:

```javascript
stream
    .alert()
        // use an expression to define when an alert should go critical.
        .crit("sigma(value) > 3")
```







