---
title: Enabling HTTPS with InfluxDB
description: Enable HTTPS and Transport Security Layer (TLS) secure communication between clients and your InfluxDB servers.
menu:
  influxdb_1_7:
    name: Enabling HTTPS
    weight: 30
    parent: Administration
---

Enable TLS to encrypt communication between clients and the InfluxDB server.
When configured with a signed certificate, TLS also allows clients to verify the authenticity of the InfluxDB server.

{{% warn %}}
InfluxData **strongly recommends** enabling HTTPS, especially if you plan to send requests to InfluxDB over a network.
{{% /warn %}}

{{% note %}}
If setting up HTTPS for [InfluxDB Enterprise](/enterprise_influxdb), follow the [InfluxDB Enterprise HTTPS setup guide](/enterprise_influxdb/v1.7/guides/https_setup/).
{{% /note %}}

## Requirements

To enable HTTPS with InfluxDB, you need a Transport Layer Security (TLS) certificate, also known as a Secured Sockets Layer (SSL) certificate.
InfluxDB supports three types of TLS certificates:

* **Single domain certificates signed by a [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority)**

    Single domain certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    These certificates are signed and issued by a trusted, third-party Certificate Authority (CA).
    With this certificate option, every InfluxDB instance requires a unique single domain certificate.

* **Wildcard certificates signed by a Certificate Authority**

    Wildcard certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    Wildcard certificates can be used across multiple InfluxDB instances on different servers.

* **Self-signed certificates**

    Self-signed certificates are _not_ signed by a trusted, third-party CA.
    Self-signed certificates provide cryptographic security to HTTPS requests but don't allow clients to verify the identity of the InfluxDB server.
    With this kind of certificate, every InfluxDB instance requires a unique self-signed certificate.
    You can generate a self-signed certificate on your own machine.

<!-- InfluxDB supports certificates composed of a private key file (`.key`) and a signed certificate file (`.crt`) file pair, -->
<!-- as well as certificates that combine the private key file and the signed certificate file into a single bundled file (`.pem`). -->

## Configure InfluxDB to use TLS

1. **Download or generate certificate files**

    If using a certificate provided by a CA, follow their instructions to download the certificate files.

    If using a self-signed certificate, use the `openssl` utility to create a certificate.

    Use the following command to generate a private key file (`.key`) and a self-signed certificate file (`.crt`) and save them to `/etc/ssl/`.
    Set `NUMBER_OF_DAYS` to specify the amount of time the files will remain valid.

    ```sh
    sudo openssl req -x509 -nodes -newkey rsa:2048 \
      -keyout /etc/ssl/influxdb-selfsigned.key \
      -out /etc/ssl/influxdb-selfsigned.crt \
      -days <NUMBER_OF_DAYS>
    ```

    The command will prompt you for more information.
    You can choose to fill out these fields or leave them blank; both actions generate valid certificate files.

2. **Set certificate file permissions**

    The user running InfluxDB must have read permissions on the TLS certificate.

    {{% note %}}You may opt to set up multiple users, groups, and permissions.
    Ultimately, make sure all users running InfluxDB have read permissions for the TLS certificate.
    {{% /note %}}

    Run the following command to give InfluxDB read and write permissions on the certificate files.

    ```bash
    sudo chmod 644 /etc/ssl/<CA-certificate-file>
    sudo chmod 600 /etc/ssl/<private-key-file>
    ```

3. Enable HTTPS in the configuration file

    HTTPS is disabled by default.
    Enable HTTPS in the `[http]` section of the configuration file (`/etc/influxdb/influxdb.conf`) by setting:

    * `https-enabled` to `true`
    * `https-certificate` to `/etc/ssl/influxdb-selfsigned.crt`
    * `https-private-key` to `/etc/ssl/influxdb-selfsigned.key`

    ```
    [http]

      [...]

      # Determines whether HTTPS is enabled.
      https-enabled = true

      [...]

      # The TLS or SSL certificate to use when HTTPS is enabled.
      https-certificate = "/etc/ssl/influxdb-selfsigned.crt"

      # Use a separate private key location.
      https-private-key = "/etc/ssl/influxdb-selfsigned.key"
    ```

4. **Verify TLS connection**

    Verify that HTTPS is working by connecting to InfluxDB with the [CLI tool](/influxdb/v1.7/tools/shell/):

    ```bash
    influx -ssl -host <domain_name>.com
    ```

    If using a self-signed certificate, add the `-unsafeSsl` flag to the above command.

    A successful connection returns the following:

    ```bash
    Connected to https://<domain_name>.com:8086 version 1.x.x
    InfluxDB shell version: 1.x.x
    >
    ```

    That's it! You've successfully set up HTTPS with InfluxDB.

## Connect Telegraf to a secured InfluxDB instance

Connecting [Telegraf](/telegraf/latest/) to an InfluxDB instance that's using
HTTPS requires some additional steps.

In the Telegraf configuration file (`/etc/telegraf/telegraf.conf`), edit the `urls`
setting to indicate `https` instead of `http` and change `localhost` to the
relevant domain name.
If you're using a self-signed certificate, uncomment the `insecure_skip_verify`
setting and set it to `true`.

```toml
    ###############################################################################
    #                            OUTPUT PLUGINS                                   #
    ###############################################################################
>
    # Configuration for InfluxDB server to send metrics to
    [[outputs.influxdb]]
      ## The full HTTP or UDP endpoint URL for your InfluxDB instance.
      ## Multiple urls can be specified as part of the same cluster,
      ## this means that only ONE of the urls will be written to each interval.
      # urls = ["udp://localhost:8089"] # UDP endpoint example
      urls = ["https://<domain_name>.com:8086"]
>
    [...]
>
      ## Optional SSL Config
      [...]
      insecure_skip_verify = true # <-- Update only if you're using a self-signed certificate
```

Next, restart Telegraf and you're all set!
