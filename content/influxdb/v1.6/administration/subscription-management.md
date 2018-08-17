---
title: Manage Subscriptions in InfluxDB
description: placholder
menu:
  influxdb_1_6:
    parent: Administration
    name: Manage subscriptions
    weight: 100
---

InfluxDB subscriptions are remote endpoints to which all data written to InfluxDB is copied.
Subscriptions are primarily used with [Kapacitor](/kapacitor/), but any remote endpoint
able to accept UDP, HTTP, or HTTPS connections can subscribe to InfluxDB.
All InfluxDB writes are sent to subscription endpoints using [line protocol](/influxdb/v1.6/write_protocols/line_protocol_tutorial/).

## InfluxQL subscription statements
The following InfluxQL statements are available for managing subscriptions:

[`CREATE SUBSCRIPTION`](#create-subscriptions)  
[`SHOW SUBSCRIPTIONS`](#show-subscriptions)  
[`DROP SUBSCRIPTION`](#remove-subscriptions)  

## Create subscriptions
Subscriptions are created using the `CREATE SUBSCRIPTION` InfluxQL statement.

```sql
-- Pattern:
CREATE SUBSCRIPTION "<subscription_name>" ON "<db_name>"."<retention_policy>" DESTINATIONS <ALL|ANY> "<subscription_endpoint_host>"

-- Examples:
-- Create a SUBSCRIPTION on database 'mydb' and retention policy 'autogen' that send data to 'example.com:9090' via HTTP.
CREATE SUBSCRIPTION "sub0" ON "mydb"."autogen" DESTINATIONS ALL 'http://example.com:9090'

-- Create a SUBSCRIPTION on database 'mydb' and retention policy 'autogen' that round-robins the data to 'h1.example.com:9090' and 'h2.example.com:9090' via UDP.
CREATE SUBSCRIPTION "sub0" ON "mydb"."autogen" DESTINATIONS ANY 'udp://h1.example.com:9090', 'udp://h2.example.com:9090'
```

### Sending subscription data to multiple hosts
The `CREATE SUBSCRIPTION` statement allows you to specify multiple hosts as endpoints for the subscription.
In your `DESTINATIONS` clause, you cast pass multiple host strings separated by commas.
`ALL` or `ANY` in the `DESTINATIONS` clause determine how InfluxDB writes data to each endpoint:

`ALL`: Writes data to all specified hosts.

`ANY`: Round-robins writes between the specified hosts.

_**Subscriptions with multiple hosts**_
```sql
-- Write all data to multiple hosts
CREATE SUBSCRIPTION "mysub" ON "mydb"."autogen" DESTINATIONS ALL 'http://host1.example.com:9090', 'http://host2.example.com:9090'

-- Round-robin writes between multiple hosts
CREATE SUBSCRIPTION "mysub" ON "mydb"."autogen" DESTINATIONS ANY 'http://host1.example.com:9090', 'http://host2.example.com:9090'
```

### Subscription protocols
Subscriptions can us HTTP, HTTPS, or UDP transport protocols.
Which one to use is determined by the subscription endpoint.
If creating a Kapacitor subscription, this is defined by the `subscription-protocol`
option in the `[[influxdb]]` section of your [`kapacitor.conf`](/kapacitor/v1.5/administration/configuration/#influxdb).

_**kapacitor.conf**_
```toml
[[influxdb]]

  # ...

  # Which protocol to use for subscriptions
  # one of 'udp', 'http', or 'https'.
  subscription-protocol = "http"

  # ...

```

_For information regarding HTTPS connections and secure communication between InfluxDB and Kapacitor,
view the [Kapacitor security](/kapacitor/v1.5/administration/security/#secure-influxdb-and-kapacitor) documentation._


## Show subscriptions
The `SHOW SUBSCRIPTIONS` InfluxQL statement returns a list of all subscriptions registered in InfluxDB.

```sql
SHOW SUBSCRIPTIONS
```

_**Example output:**_
```
name: _internal
retention_policy name                                           mode destinations
---------------- ----                                           ---- ------------
monitor          kapacitor-39545771-7b64-4692-ab8f-1796c07f3314 ANY  [http://localhost:9092]
```

## Remove subscriptions
Subscriptions are removed using the `DROP SUBSCRIPTION` InfluxQL statement.

```sql
-- Pattern:
DROP SUBSCRIPTION "<subscription_name>" ON "<db_name>"."<retention_policy>"

-- Example:
DROP SUBSCRIPTION "sub0" ON "mydb"."autogen"
```

### Drop all subscriptions
In some cases, it may be necessary to remove all subscriptions.
Run the following bash script that utilizes the `influx` CLI, loops through all subscriptions, and removes them.
It depends on the `$INFLUXUSER` and `$INFLUXPASS` environment variables.
If these are not set, export them as part of the script.

```bash
# Optional environment variable exports
# export INFLUXUSER=influxdb-username
# export INFLUXPASS=influxdb-password

IFS=$'\n'; for i in $(influx -format csv -username $INFLUXUSER -password $INFLUXPASS -database _internal -execute 'show subscriptions' | tail -n +2 | grep -v name); do influx -format csv -username $INFLUXUSER -password $INFLUXPASS -database _internal -execute "drop subscription \"$(echo "$i" | cut -f 3 -d ',')\" ON \"$(echo "$i" | cut -f 1 -d ',')\".\"$(echo "$i" | cut -f 2 -d ',')\""; done
```

## How subscriptions work
As data is written to InfluxDB, writes are duplicated to subscriber endpoints via
HTTP, HTTPS, or UDP in [line protocol](/influxdb/v1.6/write_protocols/line_protocol_tutorial/).
InfluxDB subscriber service creates multiple "writers" ([goroutines](https://golangbot.com/goroutines/))
which send writes to the subscription endpoint(s).

_The number of writer goroutines is defined by the [`write-concurrency`](/influxdb/v1.6/administration/config/#write-concurrency-40) configuration.
If using Kapacitor, this setting also defines how many "readers" Kapacitor spins up to receive the writes._

As writes occur in InfluxDB, each subscription writer sends the write data to the specified subscription endpoint(s). each reader handles them as they are recieved.
However, with a high `write-concurrency` (multiple writers and readers) and a high ingest rate,
nanosecond differences in writer and reader processes and the transport layer can result
in writes being received out of order.

> #### Important information about high write loads
> While setting the subscriber `write-concurrency` to greater than 1 does increase your
> subscriber write throughput, it can result in out-of-order writes under high ingest rates.
> Setting `write-concurrency` to 1 ensures writes are passed to subscriber endpoints sequentially,
> but can create a bottleneck under high ingest rates.
>
> What `write-concurrency` should be set to depends on your specific workload
> and need for in-order writes to your subscription endpoint.

## Configure InfluxDB subscriptions
InfluxDB subscription configuration options are available in the `[subscriber]`
section of the `influxdb.conf`.
In order to use subcriptions, the `enabled` option in the `[subscriber]` section must be set to `true`.
Below is an example `influxdb.conf` subscriber configuration:

```toml
[subscriber]
  enabled = true
  http-timeout = "30s"
  insecure-skip-verify = false
  ca-certs = ""
  write-concurrency = 40
  write-buffer-size = 1000
```

_**Descriptions of `[subscriber]` configuration options are available in the [Configuring InfluxDB](/influxdb/v1.6/administration/config/#subscription-settings-subscriber) documentation.**_

## Troubleshooting

### Inaccessible or decommissioned subscription endpoints
Unless a subscription is [dropped](#remove-subscriptions), InfluxDB assumes the endpoint
should always receive data and will continue to attempt to send data.
If an endpoint host is inaccessible or has been decommissioned, you will see errors
similar to the following:

```bash
"Post http://x.y.z.a:9092/write?consistency=...: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)" ... service=subscriber
"Post http://x.y.z.a:9092/write?consistency=...: dial tcp x.y.z.a:9092: getsockopt: connection refused" ... service=subscriber
"Post http://x.y.z.a:9092/write?consistency=...: dial tcp 172.31.36.5:9092: getsockopt: no route to host" ... service=subscriber
```

In some cases, this may be caused by a networking error or something similar
preventing a successful connection to the subscription endpoint.
In other cases, it's because subscription endpoint no longer exists and the subscription hasn't been dropped from InfluxDB.
Subscriptions aren't automatically removed from InfluxDB when an endpoint becomes inaccessible,
simply because InfluxDB does not know if it should not or will not come back.
If a subscription endpoint is removed, you must manually [drop the subscription](#remove-subscriptions) from InfluxDB.
