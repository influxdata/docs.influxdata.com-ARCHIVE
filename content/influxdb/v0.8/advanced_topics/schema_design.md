---
title: Schema Design Guidelines
---

## Schema Design

In the 0.8.x versions of InfluxDB, it is recommended that you encode most metadata into the series names. This is similar to what you'd do in Graphite. A good way to do it is:

```
<tagName>.<tagValue>.<tagName>.<tagValue>.<measurement>
# for example
az.us-west-1.host.serverA.cpu
# or any number of tags
building.2.temperature
```

You can still use the columns, but if you do queries with a `where someColumn = 'someValue'` you should know that those queries do a range scan over the entire time range of those values. This is because columns aren't indexed.

The way to index data is by creating many series. InfluxDB can handle tens of thousands or even hundreds of thousands of different series names.

## Migration to 0.9.0

In the 0.9.0 release there will be support for tags. There will be a migration tool to move from the above schema type, to a tagged representation. Read more about the [InfluxDB 0.9.0 release here](/blog/2014/12/08/clustering_tags_and_enhancements_in_0_9_0.html).

The best way to structure things is to have many series and a single column named `value` or something consistent across all series. For the names, encode like above with a consistent separator like `.` or `_`. You should ensure that your __tag name__, __tag value__ and __measurement name__ do not include the separator. It's also a good idea to start the __tag names__ and __measurement names__ with a character in [a-z] or [A-Z], but not a requirement. It will just make writing queries easier later since you won't have to wrap the names in double quotes.

If you have a measurement like `network` that can have multiple values like `in_bytes` and `out_bytes`, you should split them into two measurements. For instance:

```
region.us.data_center.1.host.serverA.network_in
region.us.data_center.1.host.serverA.network_out
```

And each of those example measurements would have a single column named `value` that stored the value of the associated measurement.
