---
title: Enable HTTPS for InfluxDB Enterprise
menu:
  enterprise_influxdb_1_7:
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

1. **Generate a self-signed certificate** (optional)

    If using a self-signed certificate, use the `openssl` utility (preinstalled on many OSes) to create a certificate.
    The following command generates a private key file (`.key`) and a self-signed
    certificate file (`.crt`) which remain valid for the specified `NUMBER_OF_DAYS`.
    It outputs those files to `/etc/ssl/` and gives them the required permissions.
    (Other paths will also work.)

    ```
    sudo openssl req -x509 -nodes -newkey rsa:2048 \
      -keyout /etc/ssl/influxdb-selfsigned.key \
      -out /etc/ssl/influxdb-selfsigned.crt \
      -days <NUMBER_OF_DAYS>
    ```

    When you execute the command, it will prompt you for more information.
    You can choose to fill out that information or leave it blank; both actions generate valid certificate files.

    In subsequent steps, you will need to copy the certificate to each node in the cluster.

2. **Install the SSL/TLS certificate in each Node**

    Place the private key file (`.key`) and the signed certificate file (`.crt`)
    or the single bundled file (`.pem`)
    in the `/etc/ssl` directory of each Meta Node and Data Node.

3. **Ensure file permissions for each Node**
   
    Certificate files require read and write access by the `root` user.
    Ensure that you have the correct file permissions in each Meta Node and Data Node by running the following commands:

    ```
    sudo chown root:root /etc/ssl/<CA-certificate-file>
    sudo chmod 644 /etc/ssl/<CA-certificate-file>
    sudo chmod 600 /etc/ssl/<private-key-file>
    ```

4. **Enable HTTPS within the configuration file for each Meta Node**

    Enable HTTPS for each Meta Node within the `[meta]` section of the configuration file (`/etc/influxdb/influxdb-meta.conf`) by setting:

    * `https-enabled` to `true`
    * `http-certificate` to `/etc/ssl/<signed-certificate-file>.crt` (or to `/etc/ssl/<bundled-certificate-file>.pem`)
    * `http-private-key` to `/etc/ssl/<private-key-file>.key` (or to `/etc/ssl/<bundled-certificate-file>.pem`)
    * `https-insecure-tls` to `true` (if using a self-signed key)

    ```toml
    [meta]

     [...]

      # Determines whether HTTPS is enabled.
      https-enabled = true

      # The SSL certificate to use when HTTPS is enabled.
      https-certificate = "<bundled-certificate-file>.pem"

      # Use a separate private key location.
      https-private-key = "<bundled-certificate-file>.pem"
      
      # For self-signed key
      https-insecure-tls = true
    ```

5. **Enable HTTPS within the configuration file for each Data Node**

    Make the following sets of changes in the configuration file at `/etc/influxdb/influxdb.conf` on each Data Node:

    1. Enable HTTPS for each Data Node within the `[http]` section of the configuration file by setting:

      * `https-enabled` to `true`
      * `http-certificate` to `/etc/ssl/<signed-certificate-file>.crt` (or to `/etc/ssl/<bundled-certificate-file>.pem`)
      * `http-private-key` to `/etc/ssl/<private-key-file>.key` (or to `/etc/ssl/<bundled-certificate-file>.pem`)

      ```toml
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

   2. Configure the Data Nodes to use HTTPS when communicating with other Data Nodes.
      In the `[cluster]` section of the configuration file, set the following:

      * `https-enabled` to `true`
      * `http-certificate` to `/etc/ssl/<signed-certificate-file>.crt` (or to `/etc/ssl/<bundled-certificate-file>.pem`)
      * `http-private-key` to `/etc/ssl/<private-key-file>.key` (or to `/etc/ssl/<bundled-certificate-file>.pem`)

      ```toml
      [cluster]

        [...]

        # Determines whether data nodes use HTTPS to communicate with each other.
        https-enabled = true

        # The SSL certificate to use when HTTPS is enabled.
        https-certificate = "<bundled-certificate-file>.pem"

        # Use a separate private key location.
        https-private-key = "<bundled-certificate-file>.pem"
      ```

   3. Configure the Data Nodes to use HTTPS when communicating with the Meta Nodes.
      In the `[meta]` section of the configuration file, set the following:

      * `meta-tls-enabled` to `true`
      * `meta-insecure-tls` to `true` (if using a self-signed key)

      ```toml
      [meta]

        [...]
          meta-tls-enabled = true

          #for self-signed key
          meta-insecure-tls = true
      ```

6. **Restart InfluxDB Enterprise**

    Restart the InfluxDB Enterprise Meta Node processes for the configuration changes to take effect:

    ```sh
    sudo systemctl start influxdb-meta
    ```

    Restart the InfluxDB Enterprise Data Node processes for the configuration changes to take effect:

    ```sh
    sudo systemctl restart influxdb
    ```

7. **Verify the HTTPS Setup**

    Verify that HTTPS is working on the meta nodes by using `influxd-ctl`.

    ```sh
    influxd-ctl -bind-tls show
    ```

    If using a self-signed certificate, use

    ```sh
    influxd-ctl -bind-tls -k show
    ```

    {{% warn %}}
Once you have enabled HTTPS, you must use `-bind-tls` in order for `influxd-ctl` to connect to the Meta Node.
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

    Next, verify that HTTPS is working by connecting to InfluxDB Enterprise with the [CLI tool](/influxdb/v1.7/tools/shell/):

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
(either by putting in the OS's trusted certificate system or using the `ssl_ca` option).
The alternative is to sign the cert using an internal CA and then trust the CA cert.

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
