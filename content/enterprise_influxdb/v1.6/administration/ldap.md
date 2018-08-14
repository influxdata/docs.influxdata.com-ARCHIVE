---
title: Configure LDAP authentication in InfluxDB Enterprise
description: Configure LDAP authentication in InfluxDB Enterprise and test LDAP connectivity.
menu:
  enterprise_influxdb_1_6:
    name: Configure LDAP authentication for InfluxDB Enterprise
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

* Provide an HTTP Basic Authentication header. See [Authentication and authorization in InfluxDB](/influxdb/v1.6/administration/authentication_and_authorization/) for details on using HTTP Basic Authentication with InfluxDB.
* Provide a username and password as HTTP query parameters
  - `u`: username
  - `p`: password
* Enable HTTP authentication
  - Set the `[http]` `auth-enabled` configuration setting, or corresponding environment variable `INFLUXDB_HTTP_AUTH_ENABLED`, to `true`. Default is `false`.
* Configure the HTTP shared secret to validate requests using JSON web tokens (JWT) and sign each HTTP payload with the secret and username.
  - Set the `[http]` configuration setting for `shared-secret`, or the corresponding environment variable `INFLUXDB_HTTP_SHARED_SECRET`. Default value is `""`.


### Configure the InfluxDB Enterprise meta nodes

To enable LDAP support in InfluxDB Enterprise, make the following configuration settings on your meta nodes:

* Provide an HTTP Basic Authentication header. See [Authentication and authorization in InfluxDB](/influxdb/v1.6/administration/authentication_and_authorization/) for details on using HTTP Basic Authentication with InfluxDB.
* Provide a username and password as HTTP query parameters
  - `u`: username
  - `p`: password
* Configure the meta node META shared secret to validate requests using JSON web tokens (JWT) and sign each HTTP payloads with the secret and username.
      - Set the `[meta]` configuration setting `meta-shared-secret`, or the corresponding environment variable `INFLUXDB_META_SHARED_SECRET` to `"<shared-secret>"`.
* Set the `[meta]` configuration setting `meta.ldap-allowed`, or the corresponding environment variable `INFLUXDB_META_LDAP_ALLOWED`, to `true` on all meta nodes in your cluster.
    - If using  to `true` on all meta nodes.
* If authentication is enabled on meta nodes, then the data nodes must be configured for:
    - `INFLUXDB_META_META_AUTH_ENABLED` environment variable, or `[http]` configuration setting `meta-auth-enabled`, is set to `true`. Default value is `false`. This value must be the same value as the meta node's `meta.auth-enabled` configuration.
      - `INFLUXDB_META_META_INTERNAL_SHARED_SECRET`, or the corresponding `[meta]` configuration setting `meta-internal-shared-secret`, is set to `true`. Default value is `false`. This value must be the same value as the meta node's `meta.internal-shared-secret`.


### Configure the LDAP configuration file

To create your LDAP configuration file, generate a sample configuration using the following command.

```
influxd-ctl ldap sample-config
```

Save this file and edit it as needed for your LDAP server.


### Verify the LDAP authentication

To verify your LDAP configuration and see what happens as you authenticate through LDAP, run:

```
influxd-ctl ldap verify -ldap-config /path/to/ldap.toml
```

### Load the LDAP configuration file

To load your LDAP configuration file, run the `influxd-ctl ldap set-config` command

```
influxd-ctl ldap set-config /path/to/ldap.toml
```

## Sample LDAP configuration

The following is a sample configuration file that connects to a publicly available LDAP server.

A `DN` is the distinguished name that uniquely identifies an entry and describes its position in the directory information tree (DIT) hierarchy. The DN of an LDAP entry is similar to a file path on a file system. `DNs` refers to multiple DN entries.

```
# Sample TOML for LDAP configuration
# First, save this file and edit it for your LDAP server.
# Then test the config with: influxd-ctl ldap verify -ldap-config /path/to/ldap.toml
# Finally, upload the config to the cluster with: influxd-ctl ldap set-config /path/to/ldap.toml
#
# Note: the meta nodes must be configured with meta.ldap-allowed = true
# and the data nodes must be configured with http.auth-enabled = true

enabled = true

[[servers]]
  host = "ldap.example.com"
  port = 389

  # Credentials to use when searching for a user or group.
  bind-dn = "cn=read-only-admin,dc=example,dc=com"
  bind-password = "read-only-admin's password"

  # Base DNs to use when applying the search-filter to discover an LDAP user.
  search-base-dns = [
    "dc=example,dc=com",
  ]

  # LDAP filter to discover a user's DN.
  # %s will be replaced with the provided username.
  search-filter = "(uid=%s)"
  # On Active Directory you might use "(sAMAccountName=%s)".

  # Base DNs to use when searching for groups.
  group-search-base-dns = ["ou=groups,dc=example,dc=com"]

  # LDAP filter to identify groups that a user belongs to.
  # %s will be replaced with the user's DN.
  group-membership-search-filter = "(&(objectClass=groupOfUniqueNames)(uniqueMember=%s))"
  # On Active Directory you might use "(&(objectClass=group)(member=%s))".

  # Attribute to use to determine the "group" in the group-mappings section.
  group-attribute = "ou"
  # On Active Directory you might use "cn".

  # LDAP filter to search for groups during cache warming.
  # %s will be replaced with the "group" value in the group-mappings section.
  group-search-filter = "(&(objectClass=groupOfUniqueNames)(ou=%s))"

  # Attribute on group objects indicating membership.
  # Used during cache warming, should be same as part of the group-membership-search-filter.
  group-member-attribute = "uniqueMember"

  # Groups whose members have admin privileges on the influxdb servers.
  admin-groups = ["influx-admins"]

  # Mappings of LDAP groups to Influx roles.
  # All Influx roles need to be manually created to take effect.
  [[servers.group-mappings]]
    group = "app-developers"
    role = "app-metrics-rw"

  [[servers.group-mappings]]
    group = "web-support"
    role = "web-traffic-ro"
```
