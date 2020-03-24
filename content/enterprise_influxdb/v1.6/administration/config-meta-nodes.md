---
title: InfluxDB Enterprise mode configurations
description: Covers the InfluxDB Enterprise meta node configuration settings and environmental variables
menu:
  enterprise_influxdb_1_6:
    name: Meta node configurations
    weight: 16
    parent: Administration
---

* [Meta node configurations](#meta-node-configurations)
    * [Global options](#global-options)
    * [[enterprise]](#enterprise)
    * [[meta]](#meta)

    ## Meta node configurations

    ### Global options

    #### `reporting-disabled = false`

    InfluxData, the company, relies on reported data from running nodes primarily to
    track the adoption rates of different InfluxDB versions.
    These data help InfluxData support the continuing development of InfluxDB.

    The `reporting-disabled` option toggles the reporting of data every 24 hours to
    `usage.influxdata.com`.
    Each report includes a randomly-generated identifier, OS, architecture,
    InfluxDB version, and the number of databases, measurements, and unique series.
    Setting this option to `true` will disable reporting.

    > **Note:** No data from user databases are ever transmitted.

    #### `bind-address = ""`
    This setting is not intended for use.
    It will be removed in future versions.

    #### `hostname = ""`

    The hostname of the [meta node](/enterprise_influxdb/v1.6/concepts/glossary/#meta-node).
    This must be resolvable and reachable by all other members of the cluster.

    Environment variable: `INFLUXDB_HOSTNAME`

    ### `[enterprise]`

    The `[enterprise]` section contains the parameters for the meta node's
    registration with the [InfluxDB Enterprise License Portal](https://portal.influxdata.com/).

    #### `license-key = ""`

    The license key created for you on [InfluxPortal](https://portal.influxdata.com).
    The meta node transmits the license key to [portal.influxdata.com](https://portal.influxdata.com) over port 80 or port 443 and receives a temporary JSON license file in return.
    The server caches the license file locally.
    You must use the [`license-path` setting](#license-path) if your server cannot communicate with [https://portal.influxdata.com](https://portal.influxdata.com).

    Use the same key for all nodes in the same cluster.
    {{% warn %}}The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
    {{% /warn %}}

    We recommended performing rolling restarts on the nodes after the
    license key update. Restart one Meta, Data, or Enterprise service at a time and
    wait for it to come back up successfully. The cluster should remain unaffected
    as long as only one node is restarting at a time as long as there are two or more
    data nodes.

    Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_KEY`

    #### `license-path = ""`

    The local path to the permanent JSON license file that you received from InfluxData
    for instances that do not have access to the internet.
    Contact [sales@influxdb.com](mailto:sales@influxdb.com) if a licence file is required.

    The license file should be saved on every server in the cluster, including Meta,
    Data, and Enterprise nodes. The file contains the JSON-formatted license, and must
    be readable by the influxdb user. Each server in the cluster independently verifies
    its license.

    {{% warn %}}
    The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
    {{% /warn %}}

    We recommended performing rolling restarts on the nodes after the
    license file update. Restart one Meta, Data, or Enterprise service at a time and
    wait for it to come back up successfully. The cluster should remain unaffected
    as long as only one node is restarting at a time as long as there are two or more
    data nodes.

    Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_PATH`

    ### `[meta]`

    ####  `dir = "/var/lib/influxdb/meta"`

    The location of the meta directory which stores the [metastore](/influxdb/v1.6/concepts/glossary/#metastore).

    Environment variable: `INFLUXDB_META_DIR`

    ####  `bind-address = ":8089"`

    The bind address(port) for meta node communication.
    For simplicity, we recommend using the same port on all meta nodes, but this
    is not necessary.

    Environment variable: `INFLUXDB_META_BIND_ADDRESS`

    #### `auth-enabled = false`

    Set to `true` to enable authentication.
    Meta nodes support JWT authentication and Basic authentication.
    For JWT authentication, also see the [`shared-secret`](#shared-secret) and [`internal-shared-secret`](#internal-shared-secret) configuration options.

    If set to `true`, also set the [`meta-auth-enabled` option](/enterprise_influxdb/v1.6/administration/config-data-nodes#meta-auth-enabled-false) to `true` in the `[meta]` section of the data node configuration file.

    Environment variable: `INFLUXDB_META_AUTH_ENABLED`

    ####  `http-bind-address = ":8091"`

    The port used by the [`influxd-ctl` tool](/enterprise_influxdb/v1.6/administration/cluster-commands/) and by data nodes to access the meta APIs.
    For simplicity we recommend using the same port on all meta nodes, but this
    is not necessary.

    Environment variable: `INFLUXDB_META_HTTP_BIND_ADDRESS`

    ####  `https-enabled = false`

    Set to `true` to if using HTTPS over the `8091` API port.
    Currently, the `8089` and `8088` ports do not support TLS.

    Environment variable: `INFLUXDB_META_HTTPS_ENABLED`

    ####  `https-certificate = ""`

    The path of the certificate file.
    This is required if [`https-enabled`](#https-enabled-false) is set to `true`.

    Environment variable: `INFLUXDB_META_HTTPS_CERTIFICATE`

    #### `https-private-key = ""`

    The path of the private key file.

    Environment variable: `INFLUXDB_META_HTTPS_PRIVATE_KEY`

    #### `https-insecure-tls = false`

    Set to `true` to allow insecure HTTPS connections to meta nodes.
    Use this setting when testing with self-signed certificates.

    Environment variable: `INFLUXDB_META_HTTPS_INSECURE_TLS`

    #### `gossip-frequency = "5s"`

    The frequency at which meta nodes communicate the cluster membership state.

    Environment variable: `INFLUXDB_META_GOSSIP_FREQUENCY`

    #### `announcement-expiration = "30s"`

    The rate at which the results of `influxd-ctl show` are updated when a meta
    node leaves the cluster.
    Note that in version 1.0, configuring this setting provides no change from the
    user's perspective.

    Environment variable: `INFLUXDB_META_ANNOUNCEMENT_EXPIRATION`

    #### `retention-autocreate = true`

    Automatically creates a default [retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp) (RP) when the system creates a database.
    The default RP (`autogen`) has an infinite duration, a shard group duration of seven days, and a replication factor set to the number of data nodes in the cluster.
    The system targets the `autogen` RP when a write or query does not specify an RP.
    Set this option to `false` to prevent the system from creating the `autogen` RP when the system creates a database.

    Environment variable: `INFLUXDB_META_RETENTION_AUTOCREATE`

    #### `election-timeout = "1s"`

    The duration a Raft candidate spends in the candidate state without a leader
    before it starts an election.
    The election timeout is slightly randomized on each Raft node each time it is called.
    An additional jitter is added to the `election-timeout` duration of between zero and the `election-timeout`.
    The default setting should work for most systems.

    Environment variable: `INFLUXDB_META_ELECTION_TIMEOUT`

    #### `heartbeat-timeout = "1s"`

    The heartbeat timeout is the amount of time a Raft follower remains in the
    follower state without a leader before it starts an election.
    Clusters with high latency between nodes may want to increase this parameter to
    avoid unnecessary Raft elections.

    Environment variable: `INFLUXDB_META_HEARTBEAT_TIMEOUT`

    #### `leader-lease-timeout = "500ms"`

    The leader lease timeout is the amount of time a Raft leader will remain leader
    if it does not hear from a majority of nodes.
    After the timeout the leader steps down to the follower state.
    Clusters with high latency between nodes may want to increase this parameter to
    avoid unnecessary Raft elections.

    Environment variable: `INFLUXDB_META_LEADER_LEASE_TIMEOUT`

    #### `consensus-timeout = "30s`"

    Environment variable: `INFLUXDB_META_CONSENSUS_TIMEOUT`

    #### `commit-timeout = "50ms"`

    The commit timeout is the amount of time a Raft node will tolerate between
    commands before issuing a heartbeat to tell the leader it is alive.
    The default setting should work for most systems.

    Environment variable: `INFLUXDB_META_COMMIT_TIMEOUT`

    #### `cluster-tracing = false`

    Cluster tracing toggles the logging of Raft logs on Raft nodes.
    Enable this setting when debugging Raft consensus issues.

    Environment variable: `INFLUXDB_META_CLUSTER_TRACING`

    #### `logging-enabled = true`

    Meta logging toggles the logging of messages from the meta service.

    Environment variable: `INFLUXDB_META_LOGGING_ENABLED`

    #### `pprof-enabled = true`

    Set to `false` to disable the `/debug/pprof` endpoint for troubleshooting.

    Environment variable: `INFLUXDB_META_PPROF_ENABLED`

    #### `lease-duration = "1m0s"`

    The default duration of the leases that data nodes acquire from the meta nodes.
    Leases automatically expire after the `lease-duration` is met.

    Leases ensure that only one data node is running something at a given time.
    For example, [Continuous Queries](/influxdb/v1.6/concepts/glossary/#continuous-query-cq)
    (CQ) use a lease so that all data nodes aren't running the same CQs at once.

    Environment variable: `INFLUXDB_META_LEASE_DURATION`

    #### `shared-secret = ""`
    The shared secret to be used by the public API for creating custom JWT authentication.
    Set [`auth-enabled`](#auth-enabled-false) to `true` if using this option.

    Environment variable: `INFLUXDB_META_SHARED_SECRET`

    #### `internal-shared-secret = ""`
    The shared secret used by the internal API for JWT authentication. Set this to a long pass phrase. This value must be the same as the value of the [`[meta] meta-internal-shared-secret`](/enterprise_influxdb/v1.6/administration/config-data-nodes#meta-internal-shared-secret) in the data node configuration file.
    Set [`auth-enabled`](#auth-enabled-false) to `true` if using this option.

    Environment variable: `INFLUXDB_META_INTERNAL_SHARED_SECRET`
