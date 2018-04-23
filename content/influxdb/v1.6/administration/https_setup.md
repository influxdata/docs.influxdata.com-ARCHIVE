---
title: Enabling HTTPS with InfluxDB
menu:
  influxdb_1_6:
    name: Enabling HTTPS
    weight: 30
    parent: administration
---

Enabling HTTPS secures the communication between clients and the InfluxDB
server, and, in some cases, HTTPS verifies the authenticity of the InfluxDB server to clients.

If you plan on sending requests to InfluxDB over a network, InfluxData
[strongly recommends](/influxdb/v1.6/administration/security/)
that you enable HTTPS.

## Requirements

To enable HTTPS with InfluxDB, you'll need an existing or new InfluxDB instance
and a Transport Layer Security (TLS) certificate (also known as a
Secured Sockets Layer (SSL) certificate).
InfluxDB supports three types of TLS/SSL certificates:

* **Single domain certificates signed by a [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority)**

    These certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    With this certificate option, every InfluxDB instance requires a unique single domain certificate.

* **Wildcard certificates signed by a Certificate Authority**

    These certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    Wildcard certificates can be used across multiple InfluxDB instances on different servers.

* **Self-signed certificates**

    Self-signed certificates are not signed by a CA and you can [generate](#step-1-generate-a-self-signed-certificate) them on your own machine.
    Unlike CA-signed certificates, self-signed certificates only provide cryptographic security to HTTPS requests.
    They do not allow clients to verify the identity of the InfluxDB server.
    We recommend using a self-signed certificate if you are unable to obtain a CA-signed certificate.
    With this certificate option, every InfluxDB instance requires a unique self-signed certificate.

Regardless of your certificate's type, InfluxDB supports certificates composed of
a private key file (`.key`) and a signed certificate file (`.crt`) file pair, as well as certificates
that combine the private key file and the signed certificate file into a single bundled file (`.pem`).

The following two sections outline how to set up HTTPS with InfluxDB [using a CA-signed
certificate](#setup-https-with-a-ca-signed-certificate) and [using a self-signed certificate](#setup-https-with-a-self-signed-certificate)
on Ubuntu 16.04.
Specific steps may be different for other operating systems.

## Setup HTTPS with a CA-Signed certificate

#### Step 1: Install the SSL/TLS certificate

Place the private key file (`.key`) and the signed certificate file (`.crt`)
or the single bundled file (`.pem`) in the `/etc/ssl` directory.

#### Step 2: Ensure file permissions
Certificate files require read and write access by the `root` user.
Ensure that you have the correct file permissions by running the following
commands:

```
sudo chown root:root /etc/ssl/<ca-certificate-file>
sudo chown root:root /etc/ssl/<certificate-file>
sudo chmod 644 /etc/ssl/<ca-certificate-file>
sudo chmod 644 /etc/ssl/<certificate-file>
sudo chmod 600 /etc/ssl/<private-key-file>
```

#### Step 3: Enable HTTPS in the InfluxDB configuration file

HTTPS is disabled by default.
Enable HTTPS in InfluxDB's the `[http]` section of the configuration file (`/etc/influxdb/influxdb.conf`) by setting:

* `https-enabled` to `true`
* `https-ca-certificate` to `/etc/ssl/<ca-certificate-file>.crt`
* `https-certificate` to `/etc/ssl/<certificate-file>.crt` (or to `/etc/ssl/<bundled-certificate-file>.pem`)
* `https-private-key` to `/etc/ssl/<private-key-file>.key` (or to `/etc/ssl/<bundled-certificate-file>.pem`)

```
[http]

  [...]

  # Determines whether HTTPS is enabled.
  https-enabled = true

  [...]

  # The SSL certificate used to validate client certificates
  https-ca-certificate = "/etc/ssl/<ca-certificate-file>.crt"

  # The SSL certificate to use when HTTPS is enabled.
  https-certificate = "/etc/ssl/<certificate-file>.crt"

  # Use a separate private key location.
  https-private-key = "/etc/ssl/<private-key-file>.key"
```

#### Step 4: Restart the InfluxDB service

Restart the InfluxDB process for the configuration changes to take effect:
```
sudo systemctl restart influxdb
```

#### Step 5: Verify the HTTPS setup

Verify that HTTPS is working by connecting to InfluxDB with the [CLI tool](/influxdb/v1.6/tools/shell/):
```
influx -ssl -host <domain_name>.com
```

A successful connection returns the following:
```
Connected to https://<domain_name>.com:8086 version 1.x.x
InfluxDB shell version: 1.x.x
>
```

That's it! You've successfully set up HTTPS with InfluxDB.

## Setup HTTPS with a Self-Signed Certificate

#### Step 1: Generate a self-signed certificate

The following command generates a private key file (`.key`) and a self-signed
certificate file (`.crt`) which remain valid for the specified `NUMBER_OF_DAYS`.
It outputs those files to InfluxDB's default certificate file paths and gives them
the required permissions.

```
sudo openssl req -x509 -nodes -newkey rsa:2048 -keyout /etc/ssl/influxdb-selfsigned.key -out /etc/ssl/influxdb-selfsigned.crt -days <NUMBER_OF_DAYS>
```

When you execute the command, it will prompt you for more information.
You can choose to fill out that information or leave it blank;
both actions generate valid certificate files.

#### Step 2: Enable HTTPS in InfluxDB's configuration file

HTTPS is disabled by default.
Enable HTTPS in InfluxDB's the `[http]` section of the configuration file (`/etc/influxdb/influxdb.conf`) by setting:

* `https-enabled` to `true`
* `https-certificate` to `/etc/ssl/influxdb-selfsigned.crt`
* `https-private-key` to `/etc/ssl/influxdb-selfsigned.key`

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

#### Step 3: Restart InfluxDB

Restart the InfluxDB process for the configuration changes to take effect:
```
sudo systemctl restart influxdb
```

#### Step 4: Verify the HTTPS Setup

Verify that HTTPS is working by connecting to InfluxDB with the [CLI tool](/influxdb/v1.6/tools/shell/):
```
influx -ssl -unsafeSsl -host <domain_name>.com
```

A successful connection returns the following:
```
Connected to https://<domain_name>.com:8086 version 1.x.x
InfluxDB shell version: 1.x.x
>
```

That's it! You've successfully set up HTTPS with InfluxDB.

>
## Connect Telegraf to a secured InfluxDB instance
>
Connecting [Telegraf](/telegraf/latest/) to an InfluxDB instance that's using
HTTPS requires some additional steps.
>
In Telegraf's configuration file (`/etc/telegraf/telegraf.conf`), edit the `urls`
setting to indicate `https` instead of `http` and change `localhost` to the
relevant domain name.
If you're using a self-signed certificate, uncomment the `insecure_skip_verify`
setting and set it to `true`.
>
    ###############################################################################
    #                            OUTPUT PLUGINS                                   #
    ###############################################################################
>
    # Configuration for influxdb server to send metrics to
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
>
Next, restart Telegraf and you're all set!

## Setup HTTPS with client certificate authentication

#### Step 1: Generate a client certificate

The following command generates a private key file (`.key`) and a certificate request (`.csr`).
The certificate's common name will be the username in InfluxDB.
The certificate request can be sent off to be signed by a third-party CA, or signed with your own CA.

```
sudo openssl req -nodes -newkey rsa:2048 -keyout /etc/ssl/client-private-key-file.key -out /etc/ssl/<client-certificate-file>.csr -subj "CN=testuser"
sudo openssl rsa -in /etc/ssl/client-private-key-file.key -out /etc/ssl/client-private-key-file.key
# Sign if you manage the CA with openssl
sudo openssl ca -infiles /etc/ssl/<client-certificate-file>.csr -out /etc/ssl/<client-certificate-file>.crt
```

#### Step 2: Ensure file permissions
Certificate files require read and write access by the `root` user.
Ensure that you have the correct file permissions by running the following
commands:

```
sudo chown root:root /etc/ssl/<client-certificate-file>
sudo chmod 644 /etc/ssl/<client-certificate-file>
sudo chmod 600 /etc/ssl/<client-private-key-file>
```

#### Step 3: Create user to match certificate CN (Common Name)

Note: The password is required, but will not be used for client certificate authentication
```
> CREATE USER "testuser" WITH PASSWORD '<some_random_password>'
> GRANT WRITE ON "telegraf" to "testuser"
```

#### Step 5: Verify the HTTPS setup

Verify that client certificate authentication is working by connecting to InfluxDB with curl:
```
curl --cacert /etc/ssl/<ca-certificate-file>.crt --cert /etc/ssl/<client-certificate-file> --key /etc/ssl/<client-private-key-file> https://<FQDN>:8086/query --data-urlencode "q=SHOW DATABASES"
```

A successful connection returns the following:
```
{"results":[{"statement_id":0,"series":[{"name":"databases","columns":["name"],"values":[["_internal"]]}]}]}
```
>
## Connect Telegraf to a secured InfluxDB instance with a client certificate
>
Connecting [Telegraf](/telegraf/latest/) to an InfluxDB instance that's using
HTTPS and client certificates requires some additional steps.
>
Copy the CA certificate, the client certificate, and client key to the host system
running telegraf.
>
In Telegraf's configuration file (`/etc/telegraf/telegraf.conf`), edit the `urls`
setting to indicate `https` instead of `http` and change `localhost` to the
relevant domain name.
Edit the `ssl_*` settings to indicate the paths to the certificates and key.
Leave the `username` and `password` settings commented out.
>
    ###############################################################################
    #                            OUTPUT PLUGINS                                   #
    ###############################################################################
>
    # Configuration for influxdb server to send metrics to
    [[outputs.influxdb]]
      ## The full HTTP or UDP endpoint URL for your InfluxDB instance.
      ## Multiple urls can be specified as part of the same cluster,
      ## this means that only ONE of the urls will be written to each interval.
      # urls = ["udp://localhost:8089"] # UDP endpoint example
      urls = ["https://<domain_name>.com:8086"]
>
    [...]
>
      # username = "telegraf"
      # password = "metricsmetricsmetricsmetrics"
>
    [...]
>
      ## Optional SSL Config
      ssl_ca = "/etc/ssl/<ca-certificate-file>"
      ssl_cert = "/etc/ssl/<client-certificate-file>"
      ssl_key = "/etc/ssl/<client-private-key-file>"
>
Next, restart Telegraf and you're all set!
