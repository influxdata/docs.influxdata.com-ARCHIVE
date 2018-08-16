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

## InfluxQL subscription statements
- InfluxQL commands for managing subscriptions:

- `CREATE SUBSCRIPTION`
- `SHOW SUBSCRIPTIONS`
- `DROP SUBSCRIPTION`

## Configure InfluxDB subscriptions
InfluxDB subscription configuration options are available in the `[subscriber]`
section of the `influxdb.conf`.
In order to use subcriptions, the `[subscriber] -> enabled` option must be set to `true`.
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

_Descriptions of `[subscriber]` configuration options are available in the [Configuring InfluxDB](/influxdb/v1.6/administration/config/#subscription-settings-subscriber) documentation._

## Create Subscriptions
- Data sent to subscription endpoints is sent in the InfluxDB API format ??? What is this?
-
- Can be http or udp. Which one to use is determined by the subscription endpoint. If creating a Kapacitor subscription, this is defined by the `subscription.protocol` option in the `[[influxdb]]` section of your `kapacitor.conf`.


## Show Subscriptions

## Remove Subscriptions
- When a subscription endpoint is no longer accessible, you will see error messages in your logs similar to the following:

```bash
influxd: ts=2018-07-29T20:09:41.560774Z lvl=info msg="Post http://x.y.z.a:9092/write?consistency=&db=telegraf&precision=ns&rp=autogen: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)" log_id=09H4f9iW000 service=subscriber

# OR

influxd: ts=2018-07-30T21:20:53.588977Z lvl=info msg="Post http://x.y.z.a:9092/write?consistency=&db=RangerConnect&precision=ns&rp=autogen: dial tcp x.y.z.a:9092: getsockopt: connection refused" log_id=09YsXgEl000 service=subscriber
```


### Drop all subscriptions
Run the following bash script that utilizes the `influx` CLI and loops through all subscriptions and removes them.
It depends on the `$INFLUXUSER` and `$INFLUXPASS` environment variables.
If these are not set, export them as part of the script.

```bash
# Optional environment variable exports
# export INFLUXUSER=influx-username
# export INFLUXPASS=influx-password

IFS=$'\n'; for i in $(influx -format csv -username $INFLUXUSER -password $INFLUXPASS -database _internal -execute 'show subscriptions' | tail -n +2 | grep -v name); do influx -format csv -username $INFLUXUSER -password $INFLUXPASS -database _internal -execute "drop subscription \"$(echo "$i" | cut -f 3 -d ',')\" ON \"$(echo "$i" | cut -f 1 -d ',')\".\"$(echo "$i" | cut -f 2 -d ',')\""; done
```
