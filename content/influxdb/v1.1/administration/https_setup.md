---
title: HTTPS Setup
menu:
  influxdb_1_1:
    weight: 100
    parent: administration
---

## How to set up HTTPS on with InfluxDB

This guide explains how to enable HTTPS with InfluxDB. HTTPS has two features,
it secures the communication between a server and client, and (optionally)
verifies the authenticity of the owner of the InfluxDB server to clients.

The recommended best practice is to always enable HTTPS when requests to
InfluxDB will be sent over a network.

This tutorial assumes you are using InfluxDB on Ubuntu 16.04 and plan to use a self-signed certificate.

1. Generate a TLS/SSL certificate.

InfluxDB can use three types of TLS/SSL certificates.

- Single domain certificates signed by a [certificate authority](https://en.wikipedia.org/wiki/Certificate_authority) (commonly refered to as a CA).
Every instance of InfluxDB would need a unique certificate and private key which match the server's hostname.

- Wildcard certificate signed by a CA.
A single wildcard certificate and private key can be used for multiple InfluxDB instances on different servers.

- Self-signed certificates.
Self-signed certificates are not signed by a CA so it's not possible for clients to verify the identity of the server.
However, self-signed certificates provide the same cryptographic security to HTTPS requests as CA signed certificates.
If CA signed certificates are unavailable, we highly recommend using self-signed certificates.

The following command will generate a self-signed certificate and private key on an Ubuntu 16.04 server:

```
sudo openssl req -x509 -nodes -newkey rsa:2048 -keyout /etc/ssl/influxdb-selfsigned.key -out /etc/ssl/influxdb-selfsigned.crt -days NUMBER_OF_DAYS
```

`NUMBER_OF_DAYS` is the number of days the certificate will be valid.
The command will offer prompts for more information, which can be left blank. 

This will generate both a self-signed certificate and an associated private key.
These files can be combined into a single bundled certificate file with a `.pem` filename, but it is unnecessary for InfluxDB.
InfluxDB supports using both separate certificate and key files, as well as a combined `.pem` bundle file.

2. Install the SSL certificate on the instance.

On Ubuntu 16.04, all certificate files (including `.crt`, `.key`, and `.pem`) should be placed in the `/etc/ssl` directory.
The files owner should be set to `root` and restricted to read-write access by the `root` user.

```
sudo chown root:root /etc/ssl/influxdb-selfsigned.crt /etc/ssl/influxdb-selfsigned.key
sudo chmod 644 /etc/ssl/influxdb-selfsigned.crt /etc/ssl/influxdb-selfsigned.key
```

If a self-signed certificate was generated using the command listed above, the self-signed certificates will already be in the correct path and have the right permissions.

3. Enable HTTPS in the InfluxDB config file.

In the InfluxDB config file, the following options in the `[http]` section should be configured.
If the certificate is in a combined `.pem` file, the location of the `.pem` file should used as both the `https-certificate` and `https-private-key` files. 

```
[http]
  # Determines whether HTTPS is enabled.
  https-enabled = true

  # The SSL certificate to use when HTTPS is enabled.
  https-certificate = "/etc/ssl/influxdb-selfsigned.crt"

  # Use a separate private key location.
  https-private-key = "/etc/ssl/influxdb-selfsigned.key"
```

Note, the OpenTSDB plugin for InfluxDB is the only plugin that supports TLS/SSL aside from the HTTP endpoint. 

4. Restart InfluxDB to enable HTTPS.

```
sudo systemctl restart influxdb
```

Check the logs to verify InfluxDB started correctly.

5. Verify clients can connect to InfluxDB with HTTPS enabled.

Once HTTPS is enabled, verify HTTPS is working by connecting to InfluxDB using the `influx` CLI tool using the `-ssl` option.

```
influx -ssl -host security-demo.s.influxdb.com
```

For self-signed certificates, the `influx` CLI will need to also specify the `-unsafeSsl` option.

```
influx -ssl -unsafeSsl -host security-demo.s.influxdb.com
```

6. Connect Telegraf and other clients to InfluxDB with HTTPS enabled.

Blah blah

Telegraf https:// (for self-signed do `insecure_skip_verify = true`)
