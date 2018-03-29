---
title: Configuration
draft: true

menu:
  enterprise_kapacitor_1_4:
    weight: 1
    parent: Administration
---

Enterprise Kapacitor configuration shares the same principles as those presented
in the [Confugring Kapacitor](/kapacitor/v1.4/administration/configuration/)
document of open-source Kapacitor.

However in Enterprise Kapacitor there are new grouping identifiers that pertain
to features specific to an enterprise deployment.

## The Configuration File

Enterprise licensing

```
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

Authentication

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
  meta-addr = ""

```

Cluster communications

```
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

Remote Procedure Calls

```
[rpc]
  # Bind-address is a host:port pair to bind to for the cluster rpc communitcation.
  bind-address = ":9091"
  # Advertise-address is the address to advertise to other members of the cluster for this member's rpc endpoint.
  # Defaults to hostname + bind-address if empty.
  advertise-address = ""
  # Enable-grpc-logging indicates whether to enable logging around the rpc communitcation.
  enable-grpc-logging = false

```
