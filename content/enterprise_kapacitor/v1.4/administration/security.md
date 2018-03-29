---
title: Security
draft: true

menu:
  enterprise_kapacitor_1_4:
    weight: 4
    parent: Administration
---

Kapacitor Enterprise security means configuring a Kapacitor cluster to work with
an already secured InfluxDB Enterprise cluster as well as enabling security
features implemented by Kapacitor handlers and services.  These including using
TLS on public API endpoints and enabling authentication and authorization, which
is covered in depth in the [Authentication and Authorization](/enterprise_kapacitor/v1.4/administration/auth/) document.    

<!--
### Security of Communications chnannels

Gossip `:9090`
RPC: `:9091`
API: `:9092`
-->

### Interacting with Secure InfluxDB

A secure Influx Enterprise installation is one which has at a minimum TLS
enabled on publicly exposed APIs.  These include the user and other APIs of
the Influxdb-Meta nodes.  It may also include enabling Authentication to these
nodes.  

How to set up security in InfluxDB Enterprise is covered in the [Managing Security](/enterprise_influxdb/v1.5/administration/security/)
document of that product.

#### Secure Influxdb-Meta

Since the Influxdb-Meta node is used as the backend user and privilege store of the
TICK stack. it is particularly important when securing Kapacitor with
Authentication and Authorization.  Kapacitor will need to connect to Influxdb-Meta
when verifying security credentials.

Properties relating to the Influxdb-Meta configuration are located in the `[auth]`
group of the configuration schema.  

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
  meta-addr = "ip-172-31-16-108.us-west-1.compute.internal:8091"
  meta-use-tls = true
```

The properties can be understood as follows:

* `cache-expiration` &ndash; the length of time credentials should be held in Kapacitor's local cache.
* `bcrypt-cost` &ndash; The number of iterations used when hashing the password using the bcrypt algorithm.
* `meta-addr` &ndash; The address to the Influxdb-meta node API endpoint.  Note that if this endpoint is secured using TLS, then the host and domain name portion of this string must match the FQDN string specified in the CN field of the certificate.  Otherwise Kapacitor will reject the certificate, terminate the credential verification transaction and return 401 to all requests.
* `meta-use-tls` &ndash; Sets up Kapacitor to connect to the Influxdb-Meta node using TLS/HTTPS.

More detailed information is covered in the [Authentication and Authorization](/enterprise_kapacitor/v1.4/administration/auth/) document.  

#### Secure Influxdb-Data

Influxdb-Data Enterprise nodes can be secured with TLS and Authentication.

**TLS Enabled**

Integrating Kapacitor to a TLS enabled Influxdb-Data cluster requires the following
properties in the `[[influxdb]]` group.

* `urls` &ndash; The strings in the `urls` property need to include the `https` protocol.  
* One of the following:
   * The following pair:
      * `ssl-cert` &ndash; Path to the accepted public certificate used by the endpoint.
      * `ssl-key` &ndash; Path to the public key used by the endpoint.
   * `ssl-ca` &ndash; Path to the PEM record of the certificate authority.

```toml
[[influxdb]]
  # Connect to an InfluxDB cluster
  # Kapacitor can subscribe, query and write to this cluster.
  # Using InfluxDB is not required and can be disabled.
  enabled = true
  default = true
  name = "local-cluster"
  urls = ["https://ip-172-31-16-108.us-west-1.compute.internal:8086", "https://ip-172-31-16-140.us-west-1.compute.internal:8086", "https://ip-172-31-17-7.us-west-1.compute.internal:8086" ]
  ...
  # Absolute path to pem encoded CA file.
  # A CA can be provided without a key/cert pair
  #   ssl-ca = "/etc/kapacitor/ca.pem"
  # Absolutes paths to pem encoded key and cert files.
     ssl-cert = "/etc/ssl/ip-172-31-16-108.us-west-1.compute.internal.crt"
     ssl-key = "/etc/ssl/ip-172-31-16-108.key.pem"

```

**Authentication Protected**

To connect to a cluster protected by authentication provide the following parameters:

* `username` &ndash; Name of an Influxdb user with admin privilgeges.
* `password` &ndash; Password of the user.

```toml
# Multiple InfluxDB configurations can be defined.
# Exactly one must be marked as the default.
# Each one will be given a name and can be referenced in batch queries and InfluxDBOut nodes.
[[influxdb]]
  # Connect to an InfluxDB cluster
  # Kapacitor can subscribe, query and write to this cluster.
  # Using InfluxDB is not required and can be disabled.
  enabled = true
  default = true
  ...
  username = "admin"
  password = "changeit"
  ...
```


### Securing Kapacitor

```toml
[http]
  # HTTP API Server for Kapacitor
  # This server is always on,
  # it serves both as a write endpoint
  # and as the API endpoint for all other
  # Kapacitor calls.
  bind-address = ":9092"
  auth-enabled = true
  log-enabled = true
  write-tracing = false
  pprof-enabled = false
  https-enabled = false
  https-certificate = "/etc/ssl/kapacitor.pem"
  shared-secret = ""
```
