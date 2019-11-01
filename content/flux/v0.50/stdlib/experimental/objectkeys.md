---
title: experimental.objectKeys() function
description: >
  The `experimental.objectKeys()` function returns an array of keys in a specified object.
menu:
  flux_0_50:
    name: experimental.objectKeys
    parent: Experimental
weight: 1
---

The `experimental.objectKeys()` function returns an array of keys in a specified object.

_**Function type:** Transformation_

{{% warn %}}
The `experimental.objectKeys()` function is subject to change at any time.
By using this function, you accept the [risks of experimental functions](/flux/v0.50/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

```js
import "experimental"

experimental.objectKeys(
  o: {key1: "value1", key2: "value2"}
)

// Returns [key1, key2]
```

## Parameters

### o
The object to return keys from.

_**Data type:** Object_

## Examples

### Return all keys in an object
```js
import "experimental"

user = {
  firstName: "John",
  lastName: "Doe",
  age: 42
}

experimental.objectKeys(o: user)

// Returns [firstName, lastName, age]
```
