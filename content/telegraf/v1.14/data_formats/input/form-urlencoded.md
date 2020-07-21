---
title: Form Urlencoded input data format
description: Use the Form Urlencoded input data format to parse `application/x-www-form-urlencoded` data, commonly used in the query string.
menu:
  telegraf_1_14:
    name: Form Urlencoded
    weight: 20
    parent: Input data formats (parsers)
---

The `form-urlencoded` data format parses `application/x-www-form-urlencoded` data, commonly used in the query string.

A common use case is to pair it with [`http_listener_v2` input](/telegraf/v1.14/plugins/plugin-list/#http_listener) plugin to parse request body or query parameters.

## Configuration

```toml
[[inputs.http_listener_v2]]
  ## Address and port to host HTTP listener on
  service_address = ":8080"

  ## Part of the request to consume.  Available options are "body" and
  ## "query".
  data_source = "body"

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "form_urlencoded"

  ## Array of key names which should be collected as tags.
  ## By default, keys with string value are ignored if not marked as tags.
  form_urlencoded_tag_keys = ["tag1"]
  ```

## Examples - basic parsing

### Example config:

```sh
[[inputs.http_listener_v2]]
  name_override = "mymetric"
  service_address = ":8080"
  data_source = "query"
  data_format = "form_urlencoded"
  form_urlencoded_tag_keys = ["tag1"]
```

### Example request:

```sh
curl -i -XGET 'http://localhost:8080/telegraf?tag1=foo&field1=0.42&field2=42'
```

### Example output:

```sh
mymetric,tag1=foo field1=0.42,field2=42
```