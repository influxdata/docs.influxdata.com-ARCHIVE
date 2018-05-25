---
title: Configuring Kapacitor Enterprise
description: Covers Kapacitor Enterprise configuration groups, licensing, authentication, cluster communications, and remote procedure calls (RPCs).

menu:
  enterprise_kapacitor_1_5:
    name: Configuration
    weight: 1
    parent: Administration
---

## Content

* [Configuration groups](#configuration-groups)
* [Enterprise licensing](#enterprise-licensing)
* [Authentication](#authentication)
* [Cluster communications](#cluster-communications)
* [Remote procedure calls (RPCs)](#remote-procedure-calls-rpcs)

<br/>
Kapacitor Enterprise configuration shares the same principles as those presented
in the [configuring Kapacitor](/kapacitor/v1.5/administration/configuration/)
documentation of the Kapacitor OSS version.
In Kapacitor Enterprise, however, there are new grouping identifiers that pertain
to features specific to enterprise deployments.

## Configuration groups

The four new configuration groups needed in Kapacitor Enterprise are:

* `[enterprise]`: Covers management of Influxdata licenses.
* `[auth]`: Covers the authentication handler.
* `[cluster]`: Covers communications using a gossip protocol.
* `[rpc]`: Covers procedure calls between cluster members.

### Enterprise licensing

The `[enterprise]` group is required to run Kapacitor Enterprise.  

**Example 1: Enterprise configuration group**
```toml
[enterprise]
  # Must be set to true to use the Enterprise Web UI.
  # registration-enabled = false

  # Must include the protocol (http://).
  # registration-server-url = ""

  # license-key and license-path are mutually exclusive, use only one and leave the other blank.
  license-key = ""

  # The path to a valid license file.  license-key and license-path are mutually exclusive,
  # use only one and leave the other blank.
  license-path = ""
```

This group includes the following properties:

* `registration-enabled`: Whether or not to enable registraion.  Must be set to true, which is the default.
* `registration-server-url`: The url of the registration server, if changed from the default.
* `license-key`: The license key string provided by Influxdata.
* `license-path`: Path to the license file provided by Influxdata.

Note that `license-key` and `license-path` are mutually exclusive properties.
Use one or the other but not both.  To obtain a license key or a license file,
please contact [Influxdata support](mailto:Support@InfluxData.com).

When a Kapacitor Enterprise node loads it will check the license against the
registration server before attempting to join the cluster. If the license is
invalid or no license is found, it will not cluster but will continue to run
like open-source Kapacitor.

### Authentication

The `[auth]` group is used to declare how to connect to the backend
Authentication/Authorization user store.  
By default, this store is handled by the influxdb-meta cluster.

**Example 2: Auth configuration group**
```
[auth]
  # Configure authentication service.
  # User permissions cache expiration time.
  cache-expiration = "10m"
  # Cost to compute bcrypt password hashes.
  # bcrypt rounds = 2^cost
  bcrypt-cost = 10
  # Address of a meta server.
  # If empty then meta is not used as a user backend.
  # host:port
  meta-addr = "172.17.0.2:8091"
  # meta-use-tls = false
```

This group includes the following properties:

* `cache-expiration`: How long Kapacitor should cache user information locally in the kapacitor.db before querying the influxdb-meta node once more when authenticating a user.
* `bcrypt-cost`: The number of iterations used when hashing the password using the bcrypt algorithm.
* `meta-addr`: Address of the influxdb-meta server.  A string containing its host and port. Host can be an IP Address or a domain name.  When using TLS the host part must contain the name used in the CN part of the server certificate.
* `meta-use-tls`: Whether to connect to the influxdb-meta server over TLS or not. The default value is `false`.

Authentication configuration is explained in greater detail in
[Authentication and Authorization](/enterprise_kapacitor/v1.5/administration/auth/).


### Cluster communications

The `[cluster]` group defines how the node advertises itself, joins other
nodes in the cluster and exchanges meta-information with those nodes.  
A gossip protocol is used.

**Example 3: Cluster configuration group**
```toml
[cluster]
  # Bind-address is a host:port pair to bind to for the cluster gossip communitcation.
  # Both a UDP and TCP address will be bound.
  bind-address = ":9090"
  # Advertise-address is the address to advertise to other members of the cluster for this member's gossip endpoint.
  # Defaults to hostname + bind-address if empty.
  advertise-address = ""
  # Roles for this instance of the server.
  # Currently only the worker role is supported
  roles = ["worker"]
  # Gossip-members is the number of neighboring members to whom to send gossip messages.
  # A higher count means faster convergence but more network bandwidth.
  # If zero then a default value designed for use within a typical LAN network is chosen.
  gossip-members = 0
  # Gossip-interval is the time between gossip messages.
  # A shorter interval means faster convergence but more network bandwidth.
  # If zero then a default value designed for use within a typical LAN network is chosen.
  gossip-interval = "0s"
  # Gossip-sync-interval is the time between full TCP state sync of the cluster gossip state.
  # A shorter interval means faster convergence but more network bandwidth.
  # If zero then a default value designed for use within a typical LAN network is chosen.
  gossip-sync-interval = "0s"

```

The following properties can be defined:

* `bind-address`: A string containing host(optional) and port to connect to the cluster.  If the host part of the string is missing the system hostname will be used.
* `advertise-address`: A string declaring the address advertised to other cluster members as the gossip endpoint.  Can be empty, in which case the hostname and bind address will be used.
* `roles`: An array of strings declaring the roles this instance plays in the cluster.  Only the `"worker"` role is currently supported.
* `gossip-members`: A positive integer for the number of neighboring cluster nodes with whom the node will gossip.
* `gossip-interval`: A time value declaring how frequently gossip messages should be sent.
* `gossip-sync-interval` &ndash; A time value declaring how frequently the full TCP state sync of the cluster gossip state should occur.

### Remote procedure calls (RPCs)

The `[rpc]` group defines how RPC communications between nodes should be handled.

**Example 4: RPC configuration group**
```toml
[rpc]
  # Bind-address is a host:port pair to bind to for the cluster rpc communitcation.
  bind-address = ":9091"
  # Advertise-address is the address to advertise to other members of the cluster for this member's rpc endpoint.
  # Defaults to hostname + bind-address if empty.
  advertise-address = ""
  # Enable-grpc-logging indicates whether to enable logging around the rpc communitcation.
  enable-grpc-logging = false

```

The following properties are used:

* `bind-address`: A string containing the host(optional) and port to connect to the cluster. If the host part of the string is left out the system hostname will be used.
* `advertise-adress`: A string declaring the address advertised to other cluster members as the RPC endpoint that they can call. Can be empty, in which case the hostname and bind address will be used.
* `enable-grpc-logging`: Whether or not to enable logging of RPC communications.
