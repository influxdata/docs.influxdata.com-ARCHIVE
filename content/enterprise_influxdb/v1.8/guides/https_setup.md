---
title: Enable HTTPS for InfluxDB Enterprise
menu:
  enterprise_influxdb_1_8:
    name: Enable HTTPS
    weight: 100
    parent: Guides
---

Enabling HTTPS encrypts the communication between clients and the InfluxDB Enterprise server, and between nodes in the cluster.
When configured with a signed certificate, HTTPS can also verify the authenticity of the InfluxDB Enterprise server to connecting clients.

This pages outlines how to set up HTTPS with InfluxDB Enterprise using either a signed or self-signed certificate.

<dt>
InfluxData **strongly recommends** enabling HTTPS, especially if you plan on sending requests to InfluxDB Enterprise over a network.
</dt>

{{% note %}}
These steps have been tested on Debian-based Linux distributions.
Specific steps may vary on other operating systems.
{{% /note %}}

## Requirements

To enable HTTPS with InfluxDB Enterprise, you need a Transport Layer Security (TLS) certificate, also known as a Secured Sockets Layer (SSL) certificate.
InfluxDB supports three types of TLS certificates:

* **Single domain certificates signed by a [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority)**

    Single domain certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    These certificates are signed and issued by a trusted, third-party Certificate Authority (CA).
    With this certificate option, every InfluxDB instance requires a unique single domain certificate.

* **Wildcard certificates signed by a Certificate Authority**

    These certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    Wildcard certificates can be used across multiple InfluxDB Enterprise instances on different servers.

* **Self-signed certificates**

    Self-signed certificates are _not_ signed by a trusted, third-party CA.
    Unlike CA-signed certificates, self-signed certificates only provide cryptographic security to HTTPS requests.
    They do not allow clients to verify the identity of the InfluxDB server.
    With this certificate option, every InfluxDB Enterprise instance requires a unique self-signed certificate.
    You can generate a self-signed certificate on your own machine.

Regardless of your certificate's type, InfluxDB Enterprise supports certificates composed of
a private key file (`.key`) and a signed certificate file (`.crt`) file pair, as well as certificates
that combine the private key file and the signed certificate file into a single bundled file (`.pem`).

## Setup HTTPS in an InfluxDB Enterprise cluster

1. **Download or generate certificate files**

    If using a certificate provided by a CA, follow their instructions to download the certificate files.

    {{% note %}}
If using one or more self-signed certificates, use the `openssl` utility to create a certificate.
The following command generates a private key file (`.key`) and a self-signed
certificate file (`.crt`) which remain valid for the specified `NUMBER_OF_DAYS`.

```sh
sudo openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout influxdb-selfsigned.key \
  -out influxdb-selfsigned.crt \
  -days <NUMBER_OF_DAYS>
```

The command will prompt you for more information.
You can choose to fill out these fields or leave them blank; both actions generate valid certificate files.

In subsequent steps, you will need to copy the certificate and key (or `.pem` file) to each node in the cluster.
    {{% /note %}}

2. **Install the SSL/TLS certificate in each Node**

    Place the private key file (`.key`) and the signed certificate file (`.crt`)
    or the single bundled file (`.pem`)
    in the `/etc/ssl/` directory of each meta node and data node.

    {{% note %}}
Some Certificate Authorities provide certificate files with other extensions.
Consult your CA if you are unsure about how to use these files.
    {{% /note %}}

3. **Ensure file permissions for each Node**

    Certificate files require read and write access by the `influxdb` user.
    Ensure that you have the correct file permissions in each meta node and data node by running the following commands:

    ```sh
    sudo chown influxdb:influxdb /etc/ssl/
    sudo chmod 644 /etc/ssl/<CA-certificate-file>
    sudo chmod 600 /etc/ssl/<private-key-file>
    ```

4. **Enable HTTPS within the configuration file for each meta node**

    Enable HTTPS for each meta node within the `[meta]` section of the meta node configuration file (`influxdb-meta.conf`) by setting:

    ```toml
    [meta]

     [...]

      # Determines whether HTTPS is enabled.
      https-enabled = true

      # The SSL certificate to use when HTTPS is enabled.
      https-certificate = "influxdb-meta.crt"

      # Use a separate private key location.
      https-private-key = "influxdb-meta.key"

      # If using a self-signed certificate:
      https-insecure-tls = true
    ```

5. **Enable HTTPS within the configuration file for each data node**

    Make the following sets of changes in the configuration file (`influxdb.conf`) on each data node:

    1. Enable HTTPS for each data node within the `[http]` section of the configuration file by setting:

      ```toml
      [http]

        [...]

        # Determines whether HTTPS is enabled.
        https-enabled = true

        [...]

        # The SSL certificate to use when HTTPS is enabled.
        https-certificate = "influxdb-data.crt"

        # Use a separate private key location.
        https-private-key = "influxdb-data.key"
      ```

    2. Configure the data nodes to use HTTPS when communicating with other data nodes.
       In the `[cluster]` section of the configuration file, set the following:

       ```toml
       [cluster]

         [...]

         # Determines whether data nodes use HTTPS to communicate with each other.
         https-enabled = true

         # The SSL certificate to use when HTTPS is enabled.
         https-certificate = "influxdb-data.crt"

         # Use a separate private key location.
         https-private-key = "influxdb-data.key"
       ```

    3. Configure the data nodes to use HTTPS when communicating with the meta nodes.
       In the `[meta]` section of the configuration file, set the following:

       ```toml
       [meta]

         [...]
           meta-tls-enabled = true

           # If using a self-signed certificate:
           meta-insecure-tls = true
       ```

6. **Restart InfluxDB Enterprise**

    Restart the InfluxDB Enterprise processes for the configuration changes to take effect:

    ```sh
    sudo systemctl restart influxdb-meta
    ```

    Restart the InfluxDB Enterprise data node processes for the configuration changes to take effect:

    ```sh
    sudo systemctl restart influxdb
    ```

7. **Verify the HTTPS Setup**

    Verify that HTTPS is working on the meta nodes by using `influxd-ctl`.

    ```sh
    influxd-ctl -bind-tls show
    ```

    If using a self-signed certificate, use:

    ```sh
    influxd-ctl -bind-tls -k show
    ```

    {{% warn %}}
Once you have enabled HTTPS, you must use `-bind-tls` in order for `influxd-ctl` to connect to the meta node.
With a self-signed certificate, you must also use the `-k` option to skip certificate verification.
    {{% /warn %}}

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

    Next, verify that HTTPS is working by connecting to InfluxDB Enterprise with the [`influx` command line interface](/influxdb/v1.8/tools/shell/):

    ```sh
    influx -ssl -host <domain_name>.com
    ```

    If using a self-signed certificate, use
    
    ```sh
    influx -ssl -unsafeSsl -host <domain_name>.com
    ```

    A successful connection returns the following:

    ```sh
    Connected to https://<domain_name>.com:8086 version 1.x.y
    InfluxDB shell version: 1.x.y
    >
    ```

    That's it! You've successfully set up HTTPS with InfluxDB Enterprise.

## Connect Telegraf to a secured InfluxDB Enterprise instance

Connecting [Telegraf](/telegraf/latest/)
to an HTTPS-enabled InfluxDB Enterprise instance requires some additional steps.

In Telegraf's configuration file (`/etc/telegraf/telegraf.conf`), under the OUTPUT PLUGINS section,
edit the `urls` setting to indicate `https` instead of `http`.
Also change `localhost` to the relevant domain name.

The best practice in terms of security is to transfer the certificate to the client and make it trusted
(either by putting in the operating system's trusted certificate system or using the `ssl_ca` option).
The alternative is to sign the certificate using an internal CA and then trust the CA certificate.

If you're using a self-signed certificate,
uncomment the `insecure_skip_verify` setting and set it to `true`.

```toml
###############################################################################
#                            OUTPUT PLUGINS                                   #
###############################################################################

# Configuration for influxdb server to send metrics to
[[outputs.influxdb]]
  ## The full HTTP or UDP endpoint URL for your InfluxDB Enterprise instance.
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

```sh
sudo systemctl restart telegraf
```
