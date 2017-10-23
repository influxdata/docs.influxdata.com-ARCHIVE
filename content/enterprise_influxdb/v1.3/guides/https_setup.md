---
title: HTTPS Setup
menu:
  enterprise_influxdb_1_3:
    weight: 100
    parent: Guides
---

This guide describes how to enable HTTPS with InfluxEnterprise.
Setting up HTTPS secures the communication between clients and the InfluxEnterprise
server,
and, in some cases, HTTPS verifies the authenticity of the InfluxEnterprise server to
clients.

If you plan on sending requests to InfluxEnterprise over a network, we
[strongly recommend](/enterprise_influxdb/v1.3/administration/security_best_practices/)
that you set up HTTPS.

## Requirements

To set up HTTPS with InfluxEnterprise, you'll need an existing or new InfluxEnterprise instance
and a Transport Layer Security (TLS) certificate (also known as a Secured Sockets Layer (SSL) certificate).
InfluxEnterprise supports three types of TLS/SSL certificates:

* **Single domain certificates signed by a [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority)**

    These certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxEnterprise server.
    With this certificate option, every InfluxEnterprise instance requires a unique single domain certificate.

* **Wildcard certificates signed by a Certificate Authority**

    These certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    Wildcard certificates can be used across multiple InfluxEnterprise instances on different servers.

* **Self-signed certificates**

    Self-signed certificates are not signed by a CA and you can [generate](#step-1-generate-a-self-signed-certificate) them on your own machine.
    Unlike CA-signed certificates, self-signed certificates only provide cryptographic security to HTTPS requests.
    They do not allow clients to verify the identity of the InfluxDB server.
    We recommend using a self-signed certificate if you are unable to obtain a CA-signed certificate.
    With this certificate option, every InfluxEnterprise instance requires a unique self-signed certificate.

Regardless of your certificate's type, InfluxEnterprise supports certificates composed of
a private key file (`.key`) and a signed certificate file (`.crt`) file pair, as well as certificates
that combine the private key file and the signed certificate file into a single bundled file (`.pem`).

The following two sections outline how to set up HTTPS with InfluxEnterprise [using a CA-signed
certificate](#setup-https-with-a-ca-signed-certificate) and [using a self-signed certificate](#setup-https-with-a-self-signed-certificate)
on Ubuntu 16.04.
Specific steps may be different for other operating systems.

## Setup HTTPS with a CA-Signed Certificate

#### Step 1: Install the SSL/TLS certificate in each Data Node

Place the private key file (`.key`) and the signed certificate file (`.crt`)
or the single bundled file (`.pem`) in the `/etc/ssl` directory of each Data Node.

#### Step 2: Ensure file permissions for each Data Node
Certificate files require read and write access by the `root` user.
Ensure that you have the correct file permissions in each Data Node by running the following
commands:

```
sudo chown root:root /etc/ssl/<CA-certificate-file>
sudo chmod 644 /etc/ssl/<CA-certificate-file>
sudo chmod 600 /etc/ssl/<private-key-file>
```
#### Step 3: Enable HTTPS within the configuration file for each Meta Node

HTTPS is disabled by default.
Enable HTTPS for each Meta Node within the `[meta]` section of the configuration file (`/etc/influxdb/influxdb-meta.conf`) by setting:

* `https-enabled` to `true`
* `http-certificate` to `/etc/ssl/<signed-certificate-file>.crt` (or to `/etc/ssl/<bundled-certificate-file>.pem`)
* `http-private-key` to `/etc/ssl/<private-key-file>.key` (or to `/etc/ssl/<bundled-certificate-file>.pem`)

```
[http]

 [...]

  # Determines whether HTTPS is enabled.
  https-enabled = true
[...]

  # The SSL certificate to use when HTTPS is enabled.
  https-certificate = "<bundled-certificate-file>.pem"

  # Use a separate private key location.
  https-private-key = "<bundled-certificate-file>.pem"
```

#### Step 4: Enable HTTPS within the configuration file for each Data Node

HTTPS is disabled by default. There are two sets of configuration changes required.

First, enable HTTPS for each Data Node within the `[http]` section of the configuration file (`/etc/influxdb/influxdb.conf`) by setting:

* `https-enabled` to `true`
* `http-certificate` to `/etc/ssl/<signed-certificate-file>.crt` (or to `/etc/ssl/<bundled-certificate-file>.pem`)
* `http-private-key` to `/etc/ssl/<private-key-file>.key` (or to `/etc/ssl/<bundled-certificate-file>.pem`)

```
[http]

  [...]

  # Determines whether HTTPS is enabled.
  https-enabled = true

  [...]

  # The SSL certificate to use when HTTPS is enabled.
  https-certificate = "<bundled-certificate-file>.pem"

  # Use a separate private key location.
  https-private-key = "<bundled-certificate-file>.pem"
```

Second, Configure the Data Nodes to use HTTPS when communicating with the Meta Nodes  within the `[meta]` section of the configuration file (`/etc/influxdb/influxdb.conf`) by setting:

* `meta-tls-enabled` to `true`

```
[meta]

  [...]
    meta-tls-enabled = true  
```

#### Step 5: Restart InfluxEnterprise

Restart the InfluxEnterprise meta node processes for the configuration changes to take effect:
```
sudo systemctl start influxdb-meta
```

Restart the InfluxEnterprise data node processes for the configuration changes to take effect:
```
sudo systemctl restart influxdb
```

#### Step 6: Verify the HTTPS Setup

Verify that HTTPS is working on the meta nodes by using `influxd-ctl`.
```
influxd-ctl -bind-tls show
```
<dt>
   Once you have enabled HTTPS, you MUST use `-bind-tls` in order for influxd-ctl to connect to the meta node.
</dt>

A successful connection returns output which should resemble the following:
```
Data Nodes
==========
ID   TCP Address               Version
4    enterprise-data-01:8088   1.x.y-c1.x.y
5    enterprise-data-02:8088   1.x.y-c1.x.y    

Meta Nodes
==========
TCP Address               Version
enterprise-meta-01:8091   1.x.y-c1.x.z
enterprise-meta-02:8091   1.x.y-c1.x.z
enterprise-meta-03:8091   1.x.y-c1.x.z
```


Next, verify that HTTPS is working by connecting to InfluxEnterprise with the [CLI tool](/influxdb/v1.3/tools/shell/):
```
influx -ssl -host <domain_name>.com
```

A successful connection returns the following:
```
Connected to https://<domain_name>.com:8086 version 1.x.y
InfluxDB shell version: 1.x.y
>
```

That's it! You've successfully set up HTTPS with InfluxEnterprise.

## Setup HTTPS with a Self-Signed Certificate

#### Step 1: Generate a self-signed certificate

The following command generates a private key file (`.key`) and a self-signed
certificate file (`.crt`) which remain valid for the specified `NUMBER_OF_DAYS`.
It outputs those files to InfluxEnterprise's default certificate file paths and gives them
the required permissions.

```
sudo openssl req -x509 -nodes -newkey rsa:2048 -keyout /etc/ssl/influxdb-selfsigned.key -out /etc/ssl/influxdb-selfsigned.crt -days <NUMBER_OF_DAYS>
```

When you execute the command, it will prompt you for more information.
You can choose to fill out that information or leave it blank;
both actions generate valid certificate files.

#### Step 2: Enable HTTPS within the configuration file for each Meta Node

HTTPS is disabled by default.
Enable HTTPS for each Meta Node within the `[meta]` section of the configuration file (`/etc/influxdb/influxdb-meta.conf`) by setting:

* `https-enabled` to `true`
* `https-certificate` to `/etc/ssl/influxdb-selfsigned.crt`
* `https-private-key` to `/etc/ssl/influxdb-selfsigned.key`
* `https-insecure-tls` to `true` to indicate a self-signed key


```
[http]

  [...]

  # Determines whether HTTPS is enabled.
  https-enabled = true

  [...]

  # The SSL certificate to use when HTTPS is enabled.
  https-certificate = "/etc/ssl/influxdb-selfsigned.crt"

  # Use a separate private key location.
  https-private-key = "/etc/ssl/influxdb-selfsigned.key"
  
  # For self-signed key
  https-insecure-tls = true 
```

#### Step 3: Enable HTTPS within the configuration file for each Data Node

HTTPS is disabled by default.  There are two sets of configuration changes required.

First, enable HTTPS for each Data Node within the `[http]` section of the configuration file (`/etc/influxdb/influxdb.conf`) by setting:

* `https-enabled` to `true`
* `http-certificate` to `/etc/ssl/influxdb-selfsigned.crt`
* `http-private-key` to `/etc/ssl/influxdb-selfsigned.key`

```
[http]

  [...]

  # Determines whether HTTPS is enabled.
  https-enabled = true

  [...]

  # The SSL certificate to use when HTTPS is enabled.
  https-certificate = "/etc/ssl/influxdb-selfsigned.crt"

  # Use a separate private key location.
  https-private-key = "/etc/ssl/influxdb-selfsigned.key"
```

Second, Configure the Data Nodes to use HTTPS when communicating with the Meta Nodes  within the `[meta]` section of the configuration file (`/etc/influxdb/influxdb.conf`) by setting:

* `meta-tls-enabled` to `true`
* `meta-insecure-tls` to `true` to indicate a self-signed key

```
[meta]

  [...]
    meta-tls-enabled = true
    
    #for self-signed key
    meta-insecure-tls = true 
```

#### Step 4: Restart InfluxEnterprise

Restart the InfluxEnterprise meta node processes for the configuration changes to take effect:
```
sudo systemctl restart influxdb-meta
```

Restart the InfluxEnterprise data node processes for the configuration changes to take effect:
```
sudo systemctl restart influxdb
```

#### Step 5: Verify the HTTPS Setup

Verify that HTTPS is working on the meta nodes by using `influxd-ctl`.
```
influxd-ctl -bind-tls -k show
```
<dt>
   Once you have enabled HTTPS, you MUST use `-bind-tls` in order for influxd-ctl to connect to the meta node.  Because the cert is self-signed, you MUST also use the `-k` option.  This skips certificate verification.
</dt>

A successful connection returns output which should resemble the following:
```
Data Nodes
==========
ID   TCP Address               Version
4    enterprise-data-01:8088   1.x.y-c1.x.y
5    enterprise-data-02:8088   1.x.y-c1.x.y    

Meta Nodes
==========
TCP Address               Version
enterprise-meta-01:8091   1.x.y-c1.x.z
enterprise-meta-02:8091   1.x.y-c1.x.z
enterprise-meta-03:8091   1.x.y-c1.x.z
```


Next, verify that HTTPS is working by connecting to InfluxEnterprise with the [CLI tool](/influxdb/v1.3/tools/shell/):
```
influx -ssl -unsafeSsl -host <domain_name>.com
```

A successful connection returns the following:
```
Connected to https://<domain_name>.com:8086 version 1.x.y
InfluxDB shell version: 1.x.y
>
```

That's it! You've successfully set up HTTPS with InfluxEnterprise.


## Connect Telegraf to a secured InfluxEnterprise instance

Connecting [Telegraf](/telegraf/v1.3/) to an InfluxEnterprise instance that's using
HTTPS requires some additional steps.

In Telegraf's configuration file (`/etc/telegraf/telegraf.conf`), under the OUTPUT PLUGINS section, edit the `urls`
setting to indicate `https` instead of `http` and change `localhost` to the
relevant domain name.
>
The best practice in terms of security is to transfer the cert to the client and make it trusted (e.g. by putting in OS cert repo or using `ssl_ca` option).  The alternative is to sign the cert using an internal CA and then trust the CA cert.


If you're using a self-signed certificate, uncomment the `insecure_skip_verify`
setting and set it to `true`.
```
    ###############################################################################
    #                            OUTPUT PLUGINS                                   #
    ###############################################################################

    # Configuration for influxdb server to send metrics to
    [[outputs.influxdb]]
      ## The full HTTP or UDP endpoint URL for your InfluxEnterprise instance.
      ## Multiple urls can be specified as part of the same cluster,
      ## this means that only ONE of the urls will be written to each interval.
      # urls = ["udp://localhost:8089"] # UDP endpoint example
      urls = ["https://<domain_name>.com:8086"]

    [...]

      ## Optional SSL Config
      [...]
      insecure_skip_verify = true # <-- Update only if you're using a self-signed certificate
```

Next, restart Telegraf and you're all set!
```
sudo systemctl restart telegraf
```
