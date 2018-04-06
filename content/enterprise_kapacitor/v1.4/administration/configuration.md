---
title: Configuration
draft: true

menu:
  enterprise_kapacitor_1_4:
    weight: 1
    parent: Administration
---

## Contents

* [Configuration Groups](#configuration-groups)
* [Enterprise Licensing](#enterprise-licensing)
* [Authentication](#authentication)
* [Cluster Communications](#cluster-communications)
* [Remote Procedure Calls](#remote-procedure-calls)

<br/>
Enterprise Kapacitor configuration shares the same principles as those presented
in the [configuring Kapacitor](/kapacitor/v1.4/administration/configuration/)
document of open-source Kapacitor.

However in Kapacitor Enterprise there are new grouping identifiers that pertain
to features specific to an enterprise deployment.

## Configuration Groups

The four new configuration groups needed in Kapacitor Enterprise are:

* `[enterprise]` &ndash; Covers management of Influxdata licenses.
* `[auth]` &ndash; Covers the authentication handler.
* `[cluster]` &ndash; Covers communications using a gossip protocol.
* `[rpc]` &ndash; Covers procedure calls between cluster members.

### Enterprise Licensing

The `[enterprise]` group is required to run Kapacitor Enterprise.  

**Example 1 &ndash; Enterprise configuration group**
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

* `registration-enabled` &ndash; Whether or not to enable registraion.  Must be set to true, which is the default.
* `registration-server-url` &ndash; The url of the registration server, if changed from the default.
* `license-key` &ndash; The license key string provided by Influxdata.
* `license-path` &ndash; Path to the license file provided by Influxdata.

Note that `license-key` and `license-path` are mutually exclusive properties.
Use one or the other but not both.  To obtain a license key or a license file,
please contact [Influxdata support](mailto:Support@InfluxData.com).

When a Kapacitor Enterprise node loads it will check the license against the
registration server before attempting to join the cluster. If the license is
invalid or no license is found, it will not cluster but will continue to run
like open-source Kapacitor.

### Authentication

The `[auth]` group is used to declare how to connect to the backend
Authentication/Authorization user store.  Currently this store is handled by
default by the influxdb-meta cluster.

**Example 2 &ndash; Auth configuration group**
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

* `cache-expiration` &ndash; How long Kapacitor should cache user information locally in the kapacitor.db before querying the influxdb-meta node once more when authenticating a user.
* `bcrypt-cost` &ndash; The number of iterations used when hashing the password using the bcrypt algorithm.
* `meta-addr` &ndash; Address of the influxdb-meta server.  A string containing its host and port. Host can be an IP Address or a domain name.  When using TLS the host part must contain the name used in the CN part of the server certificate.
* `meta-use-tls` &ndash; Whether to connect to the influxdb-meta server over TLS or not. The default value is `false`.

Authentication configuration is explained in greater detail in the document
[Authentication and Authorization](/enterprise_kapacitor/v1.4/administration/auth/).


### Cluster Communications

The `[cluster]` group defines how the node advertises itself, joins other
nodes in the cluster and exchanges meta-information with those nodes.  A gossip
protocol is used.

**Example 3 &ndash; Cluster configuration group**
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

* `bind-address` &ndash; A string containing host(optional) and port to connect to the cluster.  If the host part of the string is missing the system hostname will be used.
* `advertise-address` &ndash; A string declaring the address advertised to other cluster members as the gossip endpoint.  Can be empty, in which case the hostname and bind address will be used.
* `roles` &ndash; An array of strings declaring the roles this instance plays in the cluster.  Only the `"worker"` role is currently supported.
* `gossip-members` &ndash; A positive integer for the number of neighboring cluster nodes with whom the node will gossip.
* `gossip-interval` &ndash; A time value declaring how frequently gossip messages should be sent.
* `gossip-sync-interval` &ndash; A time value declaring how frequently the full TCP state sync of the cluster gossip state should occur.

### Remote Procedure Calls

The `[rpc]` group defines how RPC communications between nodes should be handled.

**Example 4 &ndash; RPC configuration group**
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

* `bind-address` &ndash; A string containing the host(optional) and port to connect to the cluster. If the host part of the string is left out the system hostname will be used.
* `advertise-adress` &ndash; A string declaring the address advertised to other cluster members as the RPC endpoint that they can call. Can be empty, in which case the hostname and bind address will be used.
* `enable-grpc-logging` &ndash; Whether or not to enable logging of RPC communications.
