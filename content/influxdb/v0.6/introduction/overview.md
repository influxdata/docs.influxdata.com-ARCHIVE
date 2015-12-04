# Overview

InfluxDB is a time series, events, and metrics database. It's written in Go and has no external dependencies. That means once you install it there's nothing else to manage (like Redis, HBase, or whatever). It's designed to be distributed and scale horizontally, but be useful even if you're only running it on a single box. There are three of us ([Paul Dix](https://twitter.com/pauldix), [Todd Persen](https://github.com/toddboom), and [John Shahid](https://github.com/jvshahid) working full time on the core of the database. We're a YC (W13) backed company.

## Design Goals

Here are some goals we're targeting while building InfluxDB.

* Stores metrics data (like response times and cpu load. e.g. what you'd put into Graphite).
* Stores events data (like exceptions, user analytics, or business analytics).
* HTTP(S) interface for reading and writing data. Shouldn't require additional server code to be useful directly from the browser.
* Security model that will enable user facing analytics dashboards connecting directly to the HTTP API.
* Horizontally scalable.
* On disk and in memory. It shouldn't require a cluster of machines keeping everything in memory since most analytics data is cold most of the time.
* Simple to install and manage. Shouldn't require setting up external dependencies like Zookeeper and Hadoop.
* Ability to compute percentiles and other functions on the fly.
* Ability to automatically downsample data on different windows of time.
* Can efficiently and automatically clear out raw data daily to free up space. However, some time series will keep data forever, while others will keep only a rolling window (like the last 30 days)
* Should be able to add on custom real-time and batch analytics processing.
* Pubsub interface
* Ability to automatically expand storage by adding nodes to a cluster. Should make node replacement quick and easy.
* Highly elastic to expand computing capacity (compute nodes should scale up and down quickly)
