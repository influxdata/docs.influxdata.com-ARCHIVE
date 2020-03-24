---
title: bigtable.from() function
description: >
  The `bigtable.from()` function retrieves data from a Google Cloud Bigtable data source.
menu:
  flux_0_64:
    name: bigtable.from
    parent: Bigtable
weight: 1
---

The `bigtable.from()` function retrieves data from a [Google Cloud Bigtable](https://cloud.google.com/bigtable/)
data source.

_**Function type:** Input_

```js
import "experimental/bigtable"

bigtable.from(
  token: "mySuPeRseCretTokEn",
  project: "exampleProjectID",
  instance: "exampleInstanceID",
  table: "example-table"
)
```

## Parameters

### token
The Google Cloud IAM token to use to access the Cloud Bigtable database.

_For more information, see the following:_

- [Cloud Bigtable Access Control](https://cloud.google.com/bigtable/docs/access-control)
- [Google Cloud IAM How-to guides](https://cloud.google.com/iam/docs/how-to)
- [Setting Up Authentication for Server to Server Production Applications on Google Cloud](https://cloud.google.com/docs/authentication/production)

_**Data type:** String_

### project
The project ID of the Cloud Bigtable project to retrieve data from.

_**Data type:** String_

### instance
The instance ID of the Cloud Bigtable instance to retrieve data from.

_**Data type:** String_

### table
The name of the Cloud Bigtable table to retrieve data from.

_**Data type:** String_
