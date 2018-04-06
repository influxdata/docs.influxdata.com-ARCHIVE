---
title: Upgrading to Kapacitor v0.12
newversionredirect: administration/upgrading/
menu:
  kapacitor_012:
    weight: 30
    parent: introduction
---


There are a few breaking changes from v0.11 that may require some work
to upgrade from a v0.11 instance.  These changes are:

* [Changes to TICKscripts](#tickscript-chain-operator)

> NOTE: The old `.mapReduce` syntax has been removed in this release.

### TICKscript Chain Operator

To improve readability of TICKscripts we have added a new operator `|` to the language.
Now instead of using `.`'s for every function chain you use `|` for chaining methods
and `.` for property methods.

For example if before you had a script like:

```javascript
stream
    .from()
        .measurement('m')
    .window()
        .period(10s)
        .every(10s)
    .count('value')
    .alert()
        .cirt(lambda: "count" < 10)
        .sensu()
```

Change all `.` operators for chaining methods to `|`s.

```javascript
stream
    |from()
        .measurement('m')
    |window()
        .period(10s)
        .every(10s)
    |count('value')
    |alert()
        .cirt(lambda: "count" < 10)
        .sensu()
```

A special operator to call UDFs has also been added `@`.
Before if you had a TICKscript that used a UDF named `myCustomUDF` like:

```javascript
stream
    .from()
        .measurement('m')
    .window()
        .period(10s)
        .every(10s)
    .myCustomUDF()
        .field('value')
    .alert()
        .cirt(lambda: "count" < 10)
        .sensu()
```

Change it to:

```javascript
stream
    |from()
        .measurement('m')
    |window()
        .period(10s)
        .every(10s)
    @myCustomUDF()
        .field('value')
    |alert()
        .cirt(lambda: "count" < 10)
        .sensu()

```

Now if someone shares a TICKscript with you and you see an `@` operator you will know that you need their UDF as well to make it work.
These changes improve readability of TICKscripts as it is clear what methods are branching and adding new nodes to the pipeline and which set properties.

With this change it is now possible to programatically format TICKscripts with a new command [tickfmt](https://github.com/influxdata/kapacitor/tick/cmd/tickfmt).
If you are a vim user see this [plugin](https://github.com/nathanielc/vim-tickscript), for auto formatting and syntax highlighting.

> **Note: The old syntax will continue to function throughout the 0.12 release but will be removed for the 0.13 release.**
