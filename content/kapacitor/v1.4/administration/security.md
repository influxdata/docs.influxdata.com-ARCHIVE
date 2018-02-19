---
title: Security

menu:
  kapacitor_1_4:
    weight: 12
    parent: administration
---

# Contents

* [Overview](#overview)
* [Secure InfluxDB and Kapacitor](#secure-influxdb-and-kapacitor)
* [Kapacitor Security](#kapacitor-security)
* [Secure Kapacitor and Chronograf](#secure-kapacitor-and-chronograf)

# Overview

This document covers the basics of securing the open-source distribution of
Kapacitor.  For information about security with Enterprise Kapacitor see the
[Enterprise Kapacitor](/enterprise_kapacitor/v1.3/) documentation.

When seeking to secure Kapacitor it is assumed that the Kapacitor server will be
communicating with an already secured InfluxDB server.  It will also make its
tasks and alerts available to a Chronograf installation.  

The following discussion will cover configuring Kapacitor to communicate with a
secure InfluxDB server; enabling TLS in Kapacitor; and connecting a TLS enabled
Kapacitor server to Chronograf.  

Authentication and Authorization are not fully implemented in the open-source
Kapacitor distribution, but are available as a feature of Enterprise Kapacitor.  

## Secure InfluxDB and Kapacitor

InfluxDB communications can be secured with TLS on the transport layer and
with authentication into the HTTP API.  How to enable TLS and authentication
and authorization in InfluxDB is covered in the InfluxDB documentation in the
sections [HTTPS Setup](/influxdb/v1.4/administration/https_setup/) and
[Authentication and Authorization](/influxdb/v1.4/query_language/authentication_and_authorization)
respectively.

Kapacitor configuration supports secure connections to
InfluxDB.  

Configuration parameters can be set directly in the configuration file, as
environment variables or over Kapacitor's HTTP API.  Storing passwords and
other sensitive information in a configuration file on disk is discouraged in
production environments.  However, Kapacitor cannot successfully start without
communications to a default InfluxDB server.  It is therefore advised to use the
configuration file to boot Kapacitor, and then to make use of the HTTP API
when resetting sensitive values, after they have been redacted from the
configuration file.  Note that if Kapacitor needs to be rebooted, the parameters
in the file will need to be temporarily restored.  An overview of Kapacitor
configuration is provided in the
[Configuration](/kapacitor/v1.4/administration/configuration/) document.

### Kapacitor and InfluxDB HTTPS

To activate a TLS connection the `urls` strings in the `influxdb` servers
configuration will need to contain the `https` protocol.  Furthermore either a
PEM encoded public key and certificate will need to be specified or a PEM encoded
CA file.

When testing with a **self-signed certificate** it is also important to switch off
certificate verification with the property `insecure-skip-verify`.  Failure to do
so will result in x509 certificate errors as follows:

```
ts=2018-02-19T13:26:11.437+01:00 lvl=error msg="failed to connect to InfluxDB, retrying..." service=influxdb cluster=localhost err="Get https://localhost:8086/ping: x509: certificate is valid for lenovo-TP02, not localhost"
```

> Note that in a production environment with a CA certificate, `insecure-skip-verify` needs to be switched back on.

**Subscriptions** will also be handled over the `HTTPS` protocol, so the property
`subscription-protocol` needs to be set to "`https`".  Failure to do so will
result in a `TLS handshake error` with the message ` oversized record received
with length 21536` in the Kapacitor log as shown here:

```
ts=2018-02-19T13:23:49.684+01:00 lvl=error msg="2018/02/19 13:23:49 http: TLS handshake error from 127.0.0.1:49946: tls: oversized record received with length 21536\n" service=http service=httpd_server_errors
```

In the configuration file these values are set according to the following example.

**Example 1 &ndash; TLS Configuration Properties for InfluxDB &ndash; kapacitor.conf**
```toml
[[influxdb]]
  # Connect to an InfluxDB cluster
  # Kapacitor can subscribe, query and write to this cluster.
  # Using InfluxDB is not required and can be disabled.
  enabled = true
  default = true
  name = "localhost"
  urls = ["https://localhost:8086"]
  timeout = 0
  # Absolute path to pem encoded CA file.
  # A CA can be provided without a key/cert pair
  #   ssl-ca = "/etc/ssl/influxdata-selfsigned-incl-pub-key.pem"
  # Absolutes paths to pem encoded key and cert files.
     ssl-cert = "/etc/ssl/influxdb-selfsigned.crt"
     ssl-key = "/etc/ssl/influxdb-selfsigned.key"
...
   insecure-skip-verify = true
...
   subscription-protocol = "https"     
...   
```
The relavent properties in Example 1 are:

* `urls` &ndash; note the protocol is `https` and _not_ `http`.
* `ssl-cert` and `ssl-key` &ndash; to indicate the location of the certificate and key files.
* `insecure-skip-verify` &ndash; for testing with a self-signed certificate.
* `subscription-protocol` &ndash; to declare the correct protocol for subscription communications.   

Note that when a CA file contains the certificate and key together the property
`ssl-ca` can be used in place of `ssl-cert` and `ssl-key`.  

As environment variables these properties can be set as follows:

**Example 2 &ndash; TLS Configuration Properties for InfluxDB &ndash; ENVARS**
```
KAPACITOR_INFLUXDB_0_URLS_0="https://localhost:8086"
KAPACITOR_INFLUXDB_0_SSL_CERT="/etc/ssl/influxdb-selfsigned.crt"
KAPACITOR_INFLUXDB_0_SSL_KEY="/etc/ssl/influxdb-selfsigned.key"
KAPACITOR_INFLUXDB_0_INSECURE_SKIP_VERIFY=true
KAPACITOR_INFLUXDB_0_SUBSCRIPTION_PROTOCOL="https"
```
When using Systemd to manage the Kapacitor daemon the above parameters can be
stored in the file `/etc/defaults/kapacitor`.  

#### Kapacitor InfluxDB TLS configuration over HTTP API

These properties can also be set using the HTTP API.  To get the current
`InfluxDB` part of the Kapacitor configuration, use the following Curl command:

```
curl -ks https://localhost:9092/kapacitor/v1/config/influxdb | python -m json.tool > kapacitor-influxdb.conf
```

This results in the following file:

**Example 3 &ndash; The InfluxDB part of the Kapacitor configuration**

```json
{
    "elements": [
        {
            "link": {
                "href": "/kapacitor/v1/config/influxdb/localhost",
                "rel": "self"
            },
            "options": {
                "default": true,
                "disable-subscriptions": false,
                "enabled": true,
                "excluded-subscriptions": {
                    "_kapacitor": [
                        "autogen"
                    ]
                },
                "http-port": 0,
                "insecure-skip-verify": true,
                "kapacitor-hostname": "",
                "name": "localhost",
                "password": true,
                "ssl-ca": "",
                "ssl-cert": "/etc/ssl/influxdb-selfsigned.crt",
                "ssl-key": "/etc/ssl/influxdb-selfsigned.key",
                "startup-timeout": "5m0s",
                "subscription-mode": "cluster",
                "subscription-protocol": "https",
                "subscriptions": {},
                "subscriptions-sync-interval": "1m0s",
                "timeout": "0s",
                "udp-bind": "",
                "udp-buffer": 1000,
                "udp-read-buffer": 0,
                "urls": [
                    "https://localhost:8086"
                ],
                "username": "admin"
            },
            "redacted": [
                "password"
            ]
        }
    ],
    "link": {
        "href": "/kapacitor/v1/config/influxdb",
        "rel": "self"
    }
}
```

The following command switches off the `insecure-skip-verify` property.

```
curl -kv -d '{ "set": { "insecure-skip-verify": false } }' https://localhost:9092/kapacitor/v1/config/influxdb/
...
upload completely sent off: 43 out of 43 bytes
< HTTP/1.1 204 No Content
< Content-Type: application/json; charset=utf-8
< Request-Id: 189e9abb-157b-11e8-866a-000000000000
< X-Kapacitor-Version: 1.5.0~n201802140813
< Date: Mon, 19 Feb 2018 13:45:07 GMT
<
* Connection #0 to host localhost left intact
```

Similar commands:

* To change the URLS:

`curl -kv -d '{ "set": { "urls": [ "https://lenovo-TP02:8086" ]} }' https://localhost:9092/kapacitor/v1/config/influxdb/`

* To set the `subscription-protocol`:

`curl -kv -d '{ "set": { "subscription-protocol": "https" } }' https://localhost:9092/kapacitor/v1/config/influxdb/`

* To set the path to the CA Certificate:

`curl -kv -d '{ "set": { "ssl-ca": "/etc/ssl/influxdata-selfsigned-incl-pub-key.pem" } }' https://localhost:9092/kapacitor/v1/config/influxdb/`

Other properties can be set in a similar fashion.

### Kapacitor and InfluxDB Authentication

An additional security mechanism available in InfluxDB is Authentication and
Authorization.  Kapacitor can be configured to communicate with Influx using
a username:password pair.  These properties can be set in the configuration
file, as environment variables or over the HTTP API.

**Example 4 &ndash; InfluxDB Authentication Parameters &ndash; kapaciotor.conf**

```toml
[[influxdb]]
  # Connect to an InfluxDB cluster
  # Kapacitor can subscribe, query and write to this cluster.
  # Using InfluxDB is not required and can be disabled.
  enabled = true
  default = true
  name = "localhost"
  urls = ["https://localhost:8086"]
  username = "admin"
  password = "changeit"
  timeout = 0
...
```

The relevant parameters in Example 4 are `username` and `password`.

These can also be set as environment variables.

**Example 5 &ndash; InfluxDB Authentication Paramenters &ndash; ENVARS**

```
KAPACITOR_INFLUXDB_0_USERNAME="admin"
KAPACITOR_INFLUXDB_0_PASSWORD="changeit"
```

When using Systemd to manage the Kapacitor daemon the above parameters can be
stored in the file `/etc/defaults/kapacitor`.  

Alternately they can be set or updated over the HTTP API.  

```
$ curl -kv -d '{ "set": { "username": "foo", "password": "bar" } }' https://localhost:9092/kapacitor/v1/config/influxdb/
```

## Kapacitor Security

Open-source Kapacitor offers TLS for encrypting communications to the HTTP API.

### Kapacitor over TLS

This feature can be enabled in the configuration `http` group of the configuration.
Activation requires simply setting the property `https-enabled` to `true` and
then providing a path to a certificate with the property `https-certificate`.

Note that enabling HTTPS implies using the `https` protocol in connection URLs.

Example 6 shows how this is done in the `kapacitor.conf` file.

**Example 6 &ndash; Enabling TLS in kapacitor.conf**

```toml
[http]
  # HTTP API Server for Kapacitor
  # This server is always on,
  # it serves both as a write endpoint
  # and as the API endpoint for all other
  # Kapacitor calls.
  bind-address = ":9092"
  log-enabled = true
  write-tracing = false
  pprof-enabled = false
  https-enabled = true
  https-certificate = "/etc/ssl/influxdata-selfsigned-incl-pub-key.pem"
```

These values can also be set as environment variables as shown in

**Example 7 &ndash; Enabling TLS as ENVARS**

```
KAPACITOR_HTTP_HTTPS_ENABLED=true
KAPACITOR_HTTP_HTTPS_CERTIFICATE="/etc/ssl/influxdata-selfsigned-incl-pub-key.pem"
```

However, they _cannot_ be set over the HTTP API.


### Kapacitor Authentication and Authorization

The following applies to the open-source distribution of Kapacitor.  While it is
possible to add parameters such as `username`, `password` and `auth-enabled` to
the section `[http]` of the configuration file, `kapacitor.conf`, and while the
kapacitor server will then expect a username and password to be supplied when
connecting, the authorization and authentication handler in the open-source
distribution does not enforce checks against a user-store, nor does it verify
access permissions to resources using an Access Control List (ACL).  

A true authentication and authorization handler is available only in the
Enterprise Kapacitor distribution.      

## Secure Kapacitor and Chronograf
