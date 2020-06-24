---
title: Configure InfluxDB Enterprise meta modes
description: Covers the InfluxDB Enterprise meta node configuration settings and environmental variables
menu:
  enterprise_influxdb_1_8:
    name: Configure meta nodes
    weight: 30
    parent: Administration
---

* [Meta node configuration settings](#meta-node-configuration-settings)
  * [Global options](#global-options)
  * [Enterprise license `[enterprise]`](#enterprise)
  * [Meta node `[meta]`](#meta)

## Meta node configuration settings

### Global options

#### `reporting-disabled = false`

InfluxData, the company, relies on reported data from running nodes primarily to
track the adoption rates of different InfluxDB versions.
These data help InfluxData support the continuing development of InfluxDB.

The `reporting-disabled` option toggles the reporting of data every 24 hours to
`usage.influxdata.com`.
Each report includes a randomly-generated identifier, OS, architecture,
InfluxDB version, and the number of databases, measurements, and unique series.
To disable reporting, set this option to `true`.

> **Note:** No data from user databases are ever transmitted.

#### `bind-address = ""`

This setting is not intended for use.
It will be removed in future versions.

#### `hostname = ""`

The hostname of the [meta node](/enterprise_influxdb/v1.8/concepts/glossary/#meta-node).
This must be resolvable and reachable by all other members of the cluster.

Environment variable: `INFLUXDB_HOSTNAME`

-----

### Enterprise license settings

#### `[enterprise]`

The `[enterprise]` section contains the parameters for the meta node's
registration with the [InfluxData portal](https://portal.influxdata.com/).

#### `license-key = ""`

The license key created for you on [InfluxData portal](https://portal.influxdata.com).
The meta node transmits the license key to
[portal.influxdata.com](https://portal.influxdata.com) over port 80 or port 443
and receives a temporary JSON license file in return.
The server caches the license file locally.
If your server cannot communicate with [https://portal.influxdata.com](https://portal.influxdata.com), you must use the [`license-path` setting](#license-path).

Use the same key for all nodes in the same cluster.
{{% warn %}}The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
{{% /warn %}}

InfluxData recommends performing rolling restarts on the nodes after the license key update.
Restart one meta node or data node service at a time and wait for it to come back up successfully.
The cluster should remain unaffected as long as only one node is restarting at a
time as long as there are two or more data nodes.

Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_KEY`

#### `license-path = ""`

The local path to the permanent JSON license file that you received from InfluxData
for instances that do not have access to the internet.
To obtain a license file, contact [sales@influxdb.com](mailto:sales@influxdb.com).

The license file must be saved on every server in the cluster, including meta nodes
and data nodes.
The file contains the JSON-formatted license, and must be readable by the `influxdb` user.
Each server in the cluster independently verifies its license.

{{% warn %}}
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
{{% /warn %}}

InfluxData recommends performing rolling restarts on the nodes after the
license file update.
Restart one meta node or data node service at a time and wait for it to come back
up successfully.
The cluster should remain unaffected as long as only one node is restarting at a
time as long as there are two or more data nodes.

Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_PATH`

-----

### Meta node settings

#### `[meta]`

#### `dir = "/var/lib/influxdb/meta"`

The directory where cluster meta data is stored.

Environment variable: `INFLUXDB_META_DIR`

#### `bind-address = ":8089"`

The bind address(port) for meta node communication.
For simplicity, InfluxData recommends using the same port on all meta nodes,
but this is not necessary.

Environment variable: `INFLUXDB_META_BIND_ADDRESS`

#### `http-bind-address = ":8091"`

The default address to bind the API to.

Environment variable: `INFLUXDB_META_HTTP_BIND_ADDRESS`

#### `https-enabled = false`

Determines whether meta nodes use HTTPS to communicate with each other. By default, HTTPS is disabled. We strongly recommend enabling HTTPS.

To enable HTTPS, set https-enabled to `true`, specify the path to the SSL certificate `https-certificate = " "`, and specify the path to the SSL private key `https-private-key = ""`.

Environment variable: `INFLUXDB_META_HTTPS_ENABLED`

#### `https-certificate = ""`

If HTTPS is enabled, specify the path to the SSL certificate.  
Use either:

* PEM-encoded bundle with both the certificate and key (`[bundled-crt-and-key].pem`)
* Certificate only (`[certificate].crt`)

Environment variable: `INFLUXDB_META_HTTPS_CERTIFICATE`

#### `https-private-key = ""`

If HTTPS is enabled, specify the path to the SSL private key.
Use either:

* PEM-encoded bundle with both the certificate and key (`[bundled-crt-and-key].pem`)
* Private key only (`[private-key].key`)

Environment variable: `INFLUXDB_META_HTTPS_PRIVATE_KEY`

#### `https-insecure-tls = false`

Whether meta nodes will skip certificate validation communicating with each other over HTTPS.
This is useful when testing with self-signed certificates.

Environment variable: `INFLUXDB_META_HTTPS_INSECURE_TLS`

#### `data-use-tls = false`

Whether to use TLS to communicate with data nodes.

#### `data-insecure-tls = false`

Whether meta nodes will skip certificate validation communicating with data nodes over TLS.
This is useful when testing with self-signed certificates.

#### `gossip-frequency = "5s"`

The default frequency with which the node will gossip its known announcements.

#### `announcement-expiration = "30s"`

The default length of time an announcement is kept before it is considered too old.

#### `retention-autocreate = true`

Automatically create a default retention policy when creating a database.

#### `election-timeout = "1s"`

The amount of time in candidate state without a leader before we attempt an election.

#### `heartbeat-timeout = "1s"`

The amount of time in follower state without a leader before we attempt an election.

#### `leader-lease-timeout = "500ms"`

The leader lease timeout is the amount of time a Raft leader will remain leader
 if it does not hear from a majority of nodes.
After the timeout the leader steps down to the follower state.
Clusters with high latency between nodes may want to increase this parameter to
 avoid unnecessary Raft elections.

Environment variable: `INFLUXDB_META_LEADER_LEASE_TIMEOUT`

#### `commit-timeout = "50ms"`

The commit timeout is the amount of time a Raft node will tolerate between
commands before issuing a heartbeat to tell the leader it is alive.
The default setting should work for most systems.

Environment variable: `INFLUXDB_META_COMMIT_TIMEOUT`

#### `consensus-timeout = "30s"`

Timeout waiting for consensus before getting the latest Raft snapshot.

Environment variable: `INFLUXDB_META_CONSENSUS_TIMEOUT`

#### `cluster-tracing = false`

Cluster tracing toggles the logging of Raft logs on Raft nodes.
Enable this setting when debugging Raft consensus issues.

Environment variable: `INFLUXDB_META_CLUSTER_TRACING`

#### `logging-enabled = true`

Meta logging toggles the logging of messages from the meta service.

Environment variable: `INFLUXDB_META_LOGGING_ENABLED`

#### `pprof-enabled = true`

Enables the `/debug/pprof` endpoint for troubleshooting.
To disable, set the value to `false`.

Environment variable: `INFLUXDB_META_PPROF_ENABLED`

#### `lease-duration = "1m0s"`

The default duration of the leases that data nodes acquire from the meta nodes.
Leases automatically expire after the `lease-duration` is met.

Leases ensure that only one data node is running something at a given time.
For example, [continuous queries](/influxdb/v1.8/concepts/glossary/#continuous-query-cq)
(CQs) use a lease so that all data nodes aren't running the same CQs at once.

For more details about `lease-duration` and its impact on continuous queries, see
[Configuration and operational considerations on a cluster](/enterprise_influxdb/v1.8/features/clustering-features/#configuration-and-operational-considerations-on-a-cluster).

Environment variable: `INFLUXDB_META_LEASE_DURATION`

#### `auth-enabled = false`

If true, HTTP endpoints require authentication.
This setting must have the same value as the data nodes' meta.meta-auth-enabled configuration.

#### `ldap-allowed = false`

Whether LDAP is allowed to be set.
If true, you will need to use `influxd ldap set-config` and set enabled=true to use LDAP authentication.

#### `shared-secret = ""`

The shared secret to be used by the public API for creating custom JWT authentication.
If you use this setting, set [`auth-enabled`](#auth-enabled-false) to `true`.

Environment variable: `INFLUXDB_META_SHARED_SECRET`

#### `internal-shared-secret = ""`

The shared secret used by the internal API for JWT authentication for
inter-node communication within the cluster.
Set this to a long pass phrase.
This value must be the same value as the
[`[meta] meta-internal-shared-secret`](/enterprise_influxdb/v1.8/administration/config-data-nodes#meta-internal-shared-secret) in the data node configuration file.
To use this option, set [`auth-enabled`](#auth-enabled-false) to `true`.

Environment variable: `INFLUXDB_META_INTERNAL_SHARED_SECRET`
