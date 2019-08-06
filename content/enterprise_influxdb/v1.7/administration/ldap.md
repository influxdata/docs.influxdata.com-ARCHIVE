---
title: Configure LDAP authentication in InfluxDB Enterprise
description: Configure LDAP authentication in InfluxDB Enterprise and test LDAP connectivity.
menu:
  enterprise_influxdb_1_7:
    name: Configure LDAP authentication
    weight: 40
    parent: Administration
---
InfluxDB Enterprise can be configured to query a Lightweight Directory Access Protocol(LDAP)-compatible directory service for determining user permissions and to synchronize this directory service into InfluxDB so that the remote directory service does not need to be queried for each request.

## Requirements

To configure InfluxDB Enterprise to support LDAP, the following requirements must be met:

* All users are managed in the remote LDAP service.

## Configure LDAP for an InfluxDB Enterprise cluster

To use LDAP with an InfluxDB Enterprise cluster, you need to make the following changes to your data node and meta node configurations.

### Configure the InfluxDB Enterprise data nodes

To enable LDAP support on your data nodes, make the following changes to the InfluxDB Enterprise configuration:

* Provide an HTTP Basic Authentication header. See [Authentication and authorization in InfluxDB](/influxdb/v1.7/administration/authentication_and_authorization/) for details on using HTTP Basic Authentication with InfluxDB.
* Provide a username and password as HTTP query parameters
  * `u`: username
  * `p`: password
* Enable HTTP authentication
  * Set the `[http]` `auth-enabled` configuration setting, or corresponding environment variable `INFLUXDB_HTTP_AUTH_ENABLED`, to `true`. Default is `false`.
* Configure the HTTP shared secret to validate requests using JSON web tokens (JWT) and sign each HTTP payload with the secret and username.
  * Set the `[http]` configuration setting for `shared-secret`, or the corresponding environment variable `INFLUXDB_HTTP_SHARED_SECRET`. Default value is `""`.

> **Note:** To use fine-grained authorization (FGA) with LDAP, you must map FGA roles to key-value pairs in the LDAP database. For more information, see Fine-grained authorization in InfluxDB Enterprise (https://docs.influxdata.com/enterprise_influxdb/v1.7/guides/fine-grained-authorization/).

### Configure the InfluxDB Enterprise meta nodes

To enable LDAP support in InfluxDB Enterprise, make the following changes on your meta nodes.

* Provide an HTTP Basic Authentication header. See [Authentication and authorization in InfluxDB](/influxdb/v1.7/administration/authentication_and_authorization/) for details on using HTTP Basic Authentication with InfluxDB.
* Provide a username and password as HTTP query parameters
  * `u`: username
  * `p`: password
* Configure the meta node META shared secret to validate requests using JSON web tokens (JWT) and sign each HTTP payload with the username and shared secret.
* Set the `[meta]` configuration setting `internal-shared-secret`, or the corresponding environment variable `INFLUXDB_META_INTERNAL_SHARED_SECRET`, to `"<internal-shared-secret>"`.
* Set the `[meta]` configuration setting `meta.ldap-allowed`, or the corresponding environment variable `INFLUXDB_META_LDAP_ALLOWED`, to `true` on all meta nodes in your cluster.
* If using  to `true` on all meta nodes.

### Configure the InfluxDB Enterprise data nodes

If authentication is enabled on meta nodes, then the data nodes must be configured with the following options:

* `INFLUXDB_META_META_AUTH_ENABLED` environment variable, or `[http]` configuration setting `meta-auth-enabled`, is set to `true`. Default value is `false`. This value must be the same value as the meta node's `meta.auth-enabled` configuration.
* `INFLUXDB_META_META_INTERNAL_SHARED_SECRET`, or the corresponding `[meta]` configuration setting `meta-internal-shared-secret`, is set to `true`. Default value is `false`. This value must be the same value as the meta node's `meta.internal-shared-secret`.

### Configure the LDAP configuration file

To create your LDAP configuration file, generate a sample configuration using the following command.

```bash
influxd-ctl ldap sample-config
```

Save this file and edit it as needed for your LDAP server.

### Verify the LDAP authentication

To verify your LDAP configuration and see what happens as you authenticate through LDAP, run:

```bash
influxd-ctl ldap verify -ldap-config /path/to/ldap.toml
```

### Load the LDAP configuration file

To load your LDAP configuration file, run the `influxd-ctl ldap set-config` command.

```bash
influxd-ctl ldap set-config /path/to/ldap.toml
```

## Sample LDAP configuration

The following is a sample configuration file that connects to a publicly available LDAP server.

A `DN` is the distinguished name that uniquely identifies an entry and describes its position in the directory information tree (DIT) hierarchy. The DN of an LDAP entry is similar to a file path on a file system. `DNs` refers to multiple DN entries.

```toml
# As long as you have an SSH tunnel to the AD server,
# this config should work out of the box.
# Verify with `influxd-ctl ldap verify /path/to/this.toml`.
enabled = true

[[servers]]
  # Assumes you have an SSH tunnel to the AD server.
  # The SSH command looks something like:
  # ssh -N -L 3389:ad_server:389 jumpbox_ip
  # And to add a tunnel-only user, run:
  # useradd tunnel -m -d /home/tunnel -s /bin/true && mkdir -p /home/tunnel/.ssh && cat pubkey >> /home/tunnel/.ssh/authorized_keys
  host = "127.0.0.1"
  port = 3389

  # Security mode for LDAP connection to this server.
  # Defaults to "starttls", to use an initial unencrypted connection
  # and upgrade to TLS as the first action against the server,
  # per the LDAPv3 standard.
  # Other options are "starttls+insecure" to behave the same as starttls
  # but skip server certificate verification, or "none" to use an unencrypted connection
  # security = "starttls"
  security = "none"

  # Credentials to use when searching for a user or group.
  bind-dn = "CN=readonly admin,OU=Users,OU=enterprisead,DC=enterprisead,DC=example,DC=com"
  bind-password = "p@ssw0rd"

  # Base DNs to use when applying the search-filter to discover an LDAP user.
  search-base-dns = [
    "OU=Users,OU=enterprisead,DC=enterprisead,DC=example,DC=com",
  ]

  # LDAP filter to discover a user'\''s DN.
  # %s will be replaced with the provided username.
  search-filter = "(sAMAccountName=%s)"

  # Base DNs to use when searching for groups.
  group-search-base-dns = [
    "OU=Users,OU=enterprisead,DC=enterprisead,DC=example,DC=com",
  ]

  # LDAP filter to identify groups that a user belongs to.
  # %s will be replaced with the user'\''s DN.
  group-membership-search-filter = "(&(objectClass=group)(member=%s))"

  # Attribute to use to determine the "group" in the group-mappings section.
  group-attribute = "cn"
