---
title: Configure LDAP authentication in InfluxDB Enterprise
description: Configure LDAP authentication in InfluxDB Enterprise and test LDAP connectivity.
menu:
  enterprise_influxdb_1_7:
    name: Configure LDAP authentication
    weight: 40
    parent: Administration
---

Configure InfluxDB Enterprise to use LDAP (Lightweight Directory Access Protocol) to:

- Validate user permissions
- Synchronize InfluxDB and LDAP so each LDAP request doesn't need to be queried.

## Requirements

To configure InfluxDB Enterprise to support LDAP, all users must be managed in the remote LDAP service.

## Configure LDAP for an InfluxDB Enterprise cluster

To use LDAP with an InfluxDB Enterprise cluster, do the following:

1. [Configure data nodes](#configure-data-nodes)
2. [Configure meta nodes](#configure-meta-nodes)
3. [Create, verify, and upload the LDAP configuration file](#create-verify-and-upload-the-ldap-configuration-file)

### Configure data nodes

Update the following settings in each data node configuration file (/etc/influxdb/influxdb.conf):

- Provide an HTTP Basic Authentication header. See [Authentication and authorization in InfluxDB](/influxdb/v1.7/administration/authentication_and_authorization/) for details on using HTTP Basic Authentication with InfluxDB.
- Provide a username and password as HTTP query parameters:
  - `u`: username
  - `p`: password
- Enable HTTP authentication:
  - Set the `[http]` `auth-enabled` configuration setting, or corresponding environment variable `INFLUXDB_HTTP_AUTH_ENABLED`, to `true`. Default is `false`.
- Configure the HTTP shared secret to validate requests using JSON web tokens (JWT) and sign each HTTP payload with the secret and username:
  - Set the `[http]` configuration setting for `shared-secret`, or the corresponding environment variable `INFLUXDB_HTTP_SHARED_SECRET`. Default value is `""`.
- (Optional) If you're enabling authentication on meta nodes, data nodes must also include the following configurations:

  - `INFLUXDB_META_META_AUTH_ENABLED` environment variable, or `[http]` configuration setting `meta-auth-enabled`, is set to `true`. Default value is `false`. This value must be the same value as the meta node's `meta.auth-enabled` configuration.
  - `INFLUXDB_META_META_INTERNAL_SHARED_SECRET`, or the corresponding `[meta]` configuration setting `meta-internal-shared-secret`, is set to `true`. Default value is `false`. This value must be the same value as the meta node's `meta.internal-shared-secret`.

### Configure meta nodes

Update the following settings in each meta node configuration file (/etc/influxdb/influxdb-meta.conf):

- Provide an HTTP Basic Authentication header. See [Authentication and authorization in InfluxDB](/influxdb/v1.7/administration/authentication_and_authorization/) for details on using HTTP Basic Authentication with InfluxDB.
- Provide a username and password as HTTP query parameters:
  - `u`: username
  - `p`: password
- Configure the meta node META shared secret to validate requests using JSON web tokens (JWT) and sign each HTTP payload with the username and shared secret.
- Set the `[meta]` configuration setting `internal-shared-secret`, or the corresponding environment variable `INFLUXDB_META_INTERNAL_SHARED_SECRET`, to `"<internal-shared-secret>"`.
- Set the `[meta]` configuration setting `meta.ldap-allowed`, or the corresponding environment variable `INFLUXDB_META_LDAP_ALLOWED`, to `true` on all meta nodes in your cluster.
- If using  to `true` on all meta nodes.

### Create, verify, and upload the LDAP configuration file

1. To create a sample LDAP configuration file, run the following command:

    ```js
    bash
    influxd-ctl ldap sample-config
    ```

2. Save the sample file and edit as needed for your LDAP server. For detail, see the [sample LDAP configuration file](#sample-ldap-configuration) below.

    > **Note:** To use fine-grained authorization (FGA) with LDAP, you must map InfluxDB Enterprise roles to key-value pairs in the LDAP database. For more information, see [Fine-grained authorization in InfluxDB Enterprise](/enterprise_influxdb/v1.7/guides/fine-grained-authorization/).

3. To verify your LDAP configuration and see what happens as you authenticate through LDAP, run:

    ```bash
    influxd-ctl ldap verify -ldap-config /path/to/ldap.toml
    ```

4. To load your LDAP configuration file, run the following command:

    ```bash
    influxd-ctl ldap set-config /path/to/ldap.toml
    ```

### Sample LDAP configuration

The following is a sample configuration file that connects to a publicly available LDAP server.

A `DN` is the distinguished name that uniquely identifies an entry and describes its position in the directory information tree (DIT) hierarchy. The DN of an LDAP entry is similar to a file path on a file system. `DNs` refers to multiple DN entries.

```toml

  # As long as you have an SSH tunnel to the LDAP server,
  # this configuration should work out of the box.
  # Verify with `influxd-ctl ldap verify /path/to/this.toml`.

enabled = true

[[servers]]
  # Assumes you have an SSH tunnel to the LDAP server.
  # The SSH command looks something like:
  # ssh -N -L 3389:ad_server:389 jumpbox_ip
  # To add a tunnel-only user, run:
  # useradd tunnel -m -d /home/tunnel -s /bin/true && mkdir -p /home/tunnel/.ssh && cat pubkey >> /home/tunnel/.ssh/authorized_keys
  host = "LDAP-server-name"
  port = 3389

  # Security mode for LDAP connection to this server.
  # Defaults to "starttls", which uses an initial unencrypted connection
  # and upgrades to TLS as the first action against the server,
  # per the LDAPv3 standard.
  # Other options are "starttls+insecure", which behaves the same as starttls
  # but skips the server certificate verification, and "none", which uses an unencrypted connection.
  # security = "starttls"

  # Credentials to use when searching for a user or group.
  bind-dn = "cn=readonly admin,ou=users,ou=enterprisead,dc=enterprisead,dc=example,dc=com"
  bind-password = "p@ssw0rd"

  # Base DNs to use when applying the search-filter to discover an LDAP user.
  search-base-dns = [
    "ou=Users,ou=enterprisead,dc=enterprisead,dc=example,dc=com",
  ]

  # LDAP filter to discover a user'\''s DN.
  # %s will be replaced with the provided username.
  search-filter = "(sAMAccountName=%s)"

  # Base DNs to use when searching for groups.
  group-search-base-dns = [
    "ou=Users,ou=enterprisead,dc=enterprisead,dc=example,dc=com",
  ]

  # LDAP filter to identify groups that a user belongs to.
  # %s will be replaced with the user'\''s DN.
  group-membership-search-filter = "(&(objectClass=group)(member=%s))"

   # Attribute to use to determine the "group" in the group-mappings section.
  group-attribute = "ou"
  # On Active Directory you might use "cn".

  # LDAP filter to search for a group with a particular name.
  # This is used when warming the cache to load group membership.
  group-search-filter = "(&(objectClass=groupOfUniqueNames)(cn=%s))"
  # On Active Directory you might use "(&(objectClass=group)(cn=%s))".

  # Attribute of a group that contains the DNs of the group's members.
  group-member-attribute = "uniqueMember"
  # On Active Directory you might use "member".

  # Map LDAP groups to InfluxDB Enterprise roles by creating roles for all LDAP groups.
  
  # For example, if you map the following groups and roles:

  [[servers.group-mappings]]
    group = "admins"
    role = "administrator"

  [[servers.group-mappings]]
    group = "users"
    role = "monitor"

  # To do `admins` tasks, you'd log in with the `administrator` role username and password.

  # To do `users` tasks, you'd log in with the `monitor` role username and password.
```
