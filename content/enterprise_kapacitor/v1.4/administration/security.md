---
title: Security
draft: true

menu:
  enterprise_kapacitor_1_4:
    weight: 4
    parent: Administration
---

## Contents

* [Integration with Secure InfluxDB](#integration-with-secure-influxdb)
   * [Secure Influxb-Meta Nodes](#secure-influxdb-meta-nodes)
   * [Secure Influxdb-Data Nodes](#secure-influxdb-data-nodes)
* [Securing Kapacitor](#securing-kapacitor)
   * [Kapacitor over TLS](#kapacitor-over-tls)
   * [Kapacitor with Authentication](#kapacitor-with-authentication)  

<br/>
Kapacitor Enterprise security means configuring a Kapacitor cluster to work with
an already secured InfluxDB Enterprise cluster as well as enabling security
features implemented by Kapacitor handlers and services.  These including using
TLS on public API endpoints and enabling authentication and authorization, which
is covered in depth in the [Authentication and Authorization](/enterprise_kapacitor/v1.4/administration/auth/) document.    

### Integration with secure InfluxDB

A secure Influx Enterprise installation is one which has at a minimum TLS
enabled on publicly exposed APIs.  These include the user and other APIs of
the InfluxDB meta nodes.  It may also include enabling authentication to these
nodes.  

How to set up security in InfluxDB Enterprise is covered in the [Managing security](/enterprise_influxdb/v1.5/administration/security/)
document of that product.

#### Securing InfluxDB meta Nodes

Since the InfluxDB-Meta node is used as the backend user and privilege store of the
TICK stack, it is particularly important when securing Kapacitor with
Authentication and Authorization.  Kapacitor will need to connect to InfluxDB meta nodes
when verifying security credentials.

Properties relating to the InfluxDB meta node configuration are located in the `[auth]`
group of the configuration schema.  

**Example 1 &ndash; Authentication configuration group**
```toml
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
  meta-addr = "cluster_node_1:8091"
  meta-use-tls = true
```

The properties can be understood as follows:

* `cache-expiration: Length of time credentials should be held in the Kapacitor local cache.
* `bcrypt-cost`: Number of iterations used when hashing the password using the bcrypt algorithm.
* `meta-addr`: Address to the InfluxDB meta node API endpoint.  Note that if this endpoint is secured using TLS, then the host and domain name portion of this string must match the string specified in the CN field of the certificate.  Otherwise, Kapacitor will reject the certificate, terminate the credential verification transaction, and return `401` to all requests.
* `meta-use-tls`: Sets up Kapacitor to connect to the InfluxDB meta node using TLS/HTTPS.

More detailed information is available in 
[Authentication and authorization](/enterprise_kapacitor/v1.4/administration/auth/).  

#### Securubg InfluxDB data nodes

InfluxDB Enterprise data nodes can be secured with TLS and authentication.

**TLS enabled**

Integrating Kapacitor to a TLS-enabled InfluxDB data cluster requires the following
properties in the `[[influxdb]]` group.

* `urls`: Strings in the `urls` property need to include the `https` protocol.  
* One of the following
   * The following pair
      * `ssl-cert`: Path to the public certificate used by the endpoint.
      * `ssl-key`: Path to the public key used by the endpoint.
   * `ssl-ca`: Path to the PEM record of the certificate authority.

**Example 2: InfluxDB group, enabling TLS connection**

```toml
[[influxdb]]
  # Connect to an InfluxDB cluster
  # Kapacitor can subscribe, query, and write to this cluster.
  # Using InfluxDB is not required and can be disabled.
  enabled = true
  default = true
  name = "local-cluster"
  urls = ["https://cluster_node_1:8086", "https://cluster_node_2:8086", "https://cluster_node_3:8086" ]
  ...
  # Absolute path to pem encoded CA file.
  # A CA can be provided without a key/cert pair
  #   ssl-ca = "/etc/kapacitor/ca.pem"
  # Absolutes paths to pem encoded key and cert files.
     ssl-cert = "/etc/ssl/cluster_node_1.crt"
     ssl-key = "/etc/ssl/cluster_node_1.key.pem"

```

**Authentication protected**

To connect to a cluster protected by authentication, provide the following parameters:

* `username` &ndash; Name of an Influxdb user with admin privilgeges.
* `password` &ndash; Password of the user.

**Example 3: InfluxDB group, enabling authentication**
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

Enterprise Kapacitor listens for communications on three different ports.

* `9090`: Default port for the gossip protocol used in establishing and maintaining the cluster.
* `9091`: Default RPC port for the node.
* `9092`: API port of the node.

Each of these default values can be modified in the configuration file.

By default, the gossip and RPC ports communicate using plain text.  
These communications occur behind a firewall and these ports
will not be publicly exposed. They can be secured, if needed.  Contact
[InfluxData support](mailto:Support@InfluxData.com) if this is a
requirement.

The API port may need to be exposed for client applications.  It features the
same TLS security measures as
[Kapacitor OSS](/kapacitor/v1.4/administration/security/#kapacitor-security)
and also features an authentication and authorization handler. For more information,
see [Authentication and authorization](/enterprise_kapacitor/v1.4/administration/auth/).

#### Kapacitor over TLS

This feature can be enabled in the `[http]` group of the configuration.
Activation requires simply setting the property `https-enabled` to `true` and
then providing a path to a certificate with the property `https-certificate`.

The following example shows how this is done in the `kapacitor.conf` file.

**Example 4: Enabling TLS for Kapacitor**
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
  https-enabled = true
  https-certificate = "/etc/ssl/cluster_node_1.key.crt.pem"
  shared-secret = ""
```

Note that the PEM format certificate defined by the property `https-certificate`
needs to contain the root key and certificate as shown in Example 5.

**Example 5: Combined key and certificate PEM file**
```
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBBAKCAQEA8ysZveuWjlyE8uCLl8RTYUvjkAI69Y/1vAz9l8YGdRGuY4gH
...
p+GbblHPIGUFPTyXXkp+XHJYnPfabIDN4jKYQS6f9a3J7X1bIRl7
-----END RSA PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
MIIElTCCBo0CAQrwDQYJKoZIhvcNAQELBQAwgZMxCzAJBgNVBAYTAkNaMQ4wDAYD
...
2BL2xVPoZTXIyWhhT5pVcmMuDjkPDYYNmA==
-----END CERTIFICATE-----
```

In addition the `[[influxdb]]` section needs to have its property
`subscription-protocol` updated to `https`, otherwise subscription data will be
sent using the wrong prootocol.

**Example 6: Subscription protocol in InfluxDB**
```toml
[[influxdb]]
  # Connect to an InfluxDB cluster
  # Kapacitor can subscribe, query and write to this cluster.
  # Using InfluxDB is not required and can be disabled.
  enabled = true
  default = true
...
  # Which protocol to use for subscriptions
  # one of 'udp', 'http', or 'https'.
  subscription-protocol = "https"
...
```

#### Kapacitor command-line client with HTTPS

Once HTTPS has been enabled, the Kapacitor command line client will need to be
supplied the `-url` argument in order to connect.  If a self-signed or other
certificate is used, which has not been added to the system certificate store,
an additional argument `-skipVerify` will also need to be provided.

**Example 5: Connecting the Kapacitor client with TLS enabled**
```
$ kapacitor -url https://localhost:9092 -skipVerify list tasks
ID                                                 Type      Status    Executing Databases and Retention Policies
chronograf-v1-3586109e-8b7d-437a-80eb-a9c50d00ad53 stream    enabled   true      ["telegraf"."autogen"]
```

### Kapacitor with authentication

Steps for configuring authentication for Kapacitor Enterprise are presented in [Authentication and authorization](/enterprise_kapacitor/v1.4/administration/auth/).
