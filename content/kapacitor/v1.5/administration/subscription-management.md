---
title: Manage Kapacitor subscriptions
description: Kapacitor subscribes to InfluxDB and receives all data as it is written to InfluxDB. This article walks through how Kapacitor subscriptions work, how to configure them, and how to manage them.
menu:
  kapacitor_1_5:
    name: Manage subscriptions
    parent: administration
    weight: 100
---

Kapacitor is tightly integrated with InfluxDB through the use of [InfluxDB subscriptions](/influxdb/latest/administration/subscription-management/),
local or remote endpoints to which all data written to InfluxDB is copied.
Kapacitor subscribes to InfluxDB allowing it to capture, manipulate, and act on your data.

## How Kapacitor subscriptions work
Kapacitor allows you to manipulate and act on data as it is written into InfluxDB.
Rather than querying InfluxDB for data *(except when using the [BatchNode](/kapacitor/v1.5/nodes/batch_node/))*,
all data is copied to your Kapacitor server or cluster through an InfluxDB subscription.
This reduces the query load on InfluxDB and isolates overhead associated with data
manipulation to your Kapacitor server or cluster.

On startup, Kapacitor will check for a subscription in InfluxDB with a name matching the Kapacitor server or cluster ID.
This ID is stored inside of `/var/lib/kapacitor/`.
If the ID file doesn't exist on startup, Kapacitor will create one.
If a subscription matching the Kapacitor ID doesn't exist in InfluxDB, Kapacitor
will create a new subscription in InfluxDB.
This process ensures that when Kapacitor stops, it will reconnect to the same subscription
on restart as long as the contents of `/var/lib/kapacitor/` remain intact.

_The directory in which Kapacitor stores its ID can be configured with the
[`data-dir` root configuration option](/kapacitor/v1.5/administration/configuration/#organization)
in the `kapacitor.conf`._

> #### Kapacitor IDs in containerized or ephemeral filesystems
> In containerized environments, filesystems are considered ephemeral and typically
> do not persist between container stops and restarts.
> If `/var/lib/kapacitor/` is not persisted, Kapacitor will create a new InfluxDB subscription
> on startup, resulting in unnecessary "duplicate" subscriptions.
> You will then need to manually [drop the unnecessary subscriptions](/influxdb/latest/administration/subscription-management/#remove-subscriptions).
>
> To avoid this, InfluxData recommends that you persist the `/var/lib/kapacitor` directory.
> Many persistence strategies are available and which to use depends on your
> specific architecture and containerization technology.


## Configure Kapacitor subscriptions
Kapacitor subscription configuration options are available under the `[[influxdb]]` section in the [`kapacitor.conf`](/kapacitor/v1.5/administration/configuration/).
Below is an example of subscription-specific configuration options followed by a description of each.

_**Example Kapacitor subscription configuration**_
```toml
[[influxdb]]

  # ...

  disable-subscriptions = false
  subscription-mode = "server"
  subscription-protocol = "http"
  subscriptions-sync-interval = "1m0s"

  # ...

  [influxdb.subscriptions]
    my_database1 = [ "default", "longterm" ]
  [influxdb.excluded-subscriptions]
    my_database2 = [ "default", "shortterm" ]
```

### `disable-subscriptions`
Set to `true` to disable all subscriptions.

### `subscription-mode`
Defines the subscription mode of Kapacitor.
Available options:

- `"server"`
- `"cluster"` _(Coming)_

<dt>
The `cluster` subscription-mode is planned for future versions of Kapacitor and [Kapacitor Enterprise](/enterprise_kapacitor/).
If used currently, subscription data will not be received.
</dt>

### `subscription-protocol`
Defines which protocol to use for subscriptions.
Available options:

- `"udp"`
- `"http"`
- `"https"`

### `[influxdb.subscriptions]`
Defines a set of databases and retention policies to subscribe to.
If empty, Kapacitor will subscribe to all databases and retention policies except for those listed in
[`[influxdb.excluded-subscriptions]`](#influxdb-excluded-subscriptions).

```toml
[influxdb.subscriptions]
  # Pattern:
  db_name = <list of retention policies>

  # Example:
  my_database = [ "default", "longterm" ]
```

### `[influxdb.excluded-subscriptions]`
Defines a set of databases and retention policies to exclude from subscriptions.

```toml
[influxdb.excluded-subscriptions]
  # Pattern:
  db_name = <list of retention policies>

  # Example:
  my_database = [ "default", "longterm" ]
```

> Only one of `[influxdb.subscriptions]` or `[influxdb.excluded-subscriptions]`
> need be defined. They essentially fulfill the same purpose in different ways,
> but specific use cases do lend themselves to one or the other.

## Troubleshooting

### View the Kapacitor server or cluster ID
There are two ways to view your Kapacitor server or cluster ID:

1. View the contents of `/var/lib/kapacitor/server.id` or `/var/lib/kapacitor/cluster.id`.

    _The location of ID files depends on your operating system and the
    [`data-dir`](/kapacitor/v1.5/administration/configuration/#organization)
    setting in your `kapacitor.conf`._

2. Run the following command:

    ```bash
    kapacitor stats general
    ```

    The server and cluster IDs are included in the output.

### Duplicate Kapacitor subscriptions
Duplicate Kapacitor subscriptions are often caused by the contents of `/var/lib/kapacitor`
not persisting between restarts as described [above](#kapacitor-ids-in-containerized-or-ephemeral-filesystems).
The solution is to ensure the contents of this director are persisted.
Any duplicate Kapacitor subscriptions already created will need to be [manually removed](/influxdb/latest/administration/subscription-management/#remove-subscriptions).
