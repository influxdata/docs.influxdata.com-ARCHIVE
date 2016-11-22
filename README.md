# InfluxData Documentation

This repository powers [docs.influxdata.com](https://docs.influxdata.com), which
includes documentation for the following InfluxData projects:

* [Telegraf](https://docs.influxdata.com/telegraf/latest/)
* [InfluxDB](https://docs.influxdata.com/influxdb/latest/)
* [Chronograf](https://docs.influxdata.com/chronograf/latest/)
* [Kapacitor](https://docs.influxdata.com/kapacitor/latest/)
* [Enterprise](https://docs.influxdata.com/enterprise/latest/)

## Contributing

InfluxData's documentation is open source.
We strongly encourage (and value!) any contributions from the community.

Contributions include:

* General content improvement: typo fixes and sentence clarifications
* New content: documentation for new features and guides for common use cases

Please feel free to open
[an issue](https://github.com/influxdata/docs.influxdata.com/issues/new) or a
pull request.
See the
[Contributing Guide](https://github.com/influxdata/docs.influxdata.com/blob/master/CONTRIBUTING.md)
for more information.

## Requirements

### Hugo

We use [Hugo](http://gohugo.io/), an open source static site generator, to
build our documentation.
Check out the Hugo website for [installation instructions](http://gohugo.io/overview/installing/).

### Style Requirements

#### Markdown
All of our documentation is written in
[Markdown](https://en.wikipedia.org/wiki/Markdown).
If you're not a Markdown expert but you have content to contribute, feel free to
submit a PR and we'll help you out with the formatting.

#### Semantic Linefeeds
We use [semantic linefeeds](http://rhodesmill.org/brandon/2012/one-sentence-per-line/).
Separating each sentence with a new line makes it easy to parse diffs with the human eye.

Diff without semantic linefeeds:
``` diff
-Data are taking off. Those data are time series. You need a database that specializes in time series. You should check out InfluxDB.
+Data are taking off. Those data are time series. You need a database that specializes in time series. You need InfluxDB.
```

Diff with semantic linefeeds:
``` diff
Data are taking off.
Those data are time series.
You need a database that specializes in time series.
-You should check out InfluxDB.
+You need InfluxDB.
```

#### Writing Style
In general, we try to keep our writing style approachable and easy to understand.
