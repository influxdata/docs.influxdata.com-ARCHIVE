---
title: Configure LDAP authentication in InfluxDB Enterprise
description: Configure LDAP authentication in InfluxDB Enterprise and test LDAP connectivity.
menu:
  enterprise_influxdb_1_8:
    name: Configure LDAP authentication
    weight: 40
    parent: Administration
---

Configure InfluxDB Enterprise to use LDAP (Lightweight Directory Access Protocol) to:

- Validate user permissions
- Synchronize InfluxDB and LDAP so each LDAP request doesn't need to be queried

{{% note %}}
To configure InfluxDB Enterprise to support LDAP, all users must be managed in the remote LDAP service.
If LDAP is configured and enabled, users **must** authenticate through LDAP, including users who may have existed before enabling LDAP.
{{% /note %}}

## Configure LDAP for an InfluxDB Enterprise cluster

To use LDAP with an InfluxDB Enterprise cluster, do the following:

1. [Configure data nodes](#configure-data-nodes)
2. [Configure meta nodes](#configure-meta-nodes)
3. [Create, verify, and upload the LDAP configuration file](#create-verify-and-upload-the-ldap-configuration-file)
4. [Restart meta and data nodes](#restart-meta-and-data-nodes)

### Configure data nodes

Update the following settings in each data node configuration file (`/etc/influxdb/influxdb.conf`):

1. Under `[http]`, enable HTTP authentication by setting `auth-enabled` to `true`.
   (Or set the corresponding environment variable `INFLUXDB_HTTP_AUTH_ENABLED` to `true`.)
2. Configure the HTTP shared secret to validate requests using JSON web tokens (JWT) and sign each HTTP payload with the secret and username.
   Set the `[http]` configuration setting for `shared-secret`, or the corresponding environment variable `INFLUXDB_HTTP_SHARED_SECRET`.
3. If you're enabling authentication on meta nodes, you must also include the following configurations:
   - `INFLUXDB_META_META_AUTH_ENABLED` environment variable, or `[http]` configuration setting `meta-auth-enabled`, is set to `true`.
     This value must be the same value as the meta node's `meta.auth-enabled` configuration.
   - `INFLUXDB_META_META_INTERNAL_SHARED_SECRET`, or the corresponding `[meta]` configuration setting `meta-internal-shared-secret`, is set to `true`.
     This value must be the same value as the meta node's `meta.internal-shared-secret`.

### Configure meta nodes

Update the following settings in each meta node configuration file (`/etc/influxdb/influxdb-meta.conf`):

1. Configure the meta node META shared secret to validate requests using JSON web tokens (JWT) and sign each HTTP payload with the username and shared secret.
2. Set the `[meta]` configuration setting `internal-shared-secret` to `"<internal-shared-secret>"`.
   (Or set the `INFLUXDB_META_INTERNAL_SHARED_SECRET` environment variable.)
3. Set the `[meta]` configuration setting `meta.ldap-allowed` to `true` on all meta nodes in your cluster.
   (Or set the `INFLUXDB_META_LDAP_ALLOWED`environment variable.)

### Authenticate your connection to InfluxDB

To authenticate your InfluxDB connection, run the following command, replacing `username:password` with your credentials:

```bash
curl -u username:password -XPOST "http://localhost:8086/..."
```

For more detail on authentication, see [Authentication and authorization in InfluxDB](/influxdb/v1.8/administration/authentication_and_authorization/).

### Create, verify, and upload the LDAP configuration file

1. To create a sample LDAP configuration file, run the following command:

    ```bash
    influxd-ctl ldap sample-config
    ```

2. Save the sample file and edit as needed for your LDAP server.
   For detail, see the [sample LDAP configuration file](#sample-ldap-configuration) below.

    > To use fine-grained authorization (FGA) with LDAP, you must map InfluxDB Enterprise roles to key-value pairs in the LDAP database.
    For more information, see [Fine-grained authorization in InfluxDB Enterprise](/enterprise_influxdb/v1.8/guides/fine-grained-authorization/).
    The InfluxDB admin user doesn't include permissions for InfluxDB Enterprise roles.

3. To verify your LDAP configuration, run:

    ```bash
    influxd-ctl ldap verify -ldap-config /path/to/ldap.toml
    ```

4. To load your LDAP configuration file, run the following command:

    ```bash
    influxd-ctl ldap set-config /path/to/ldap.toml
    ```

###  Restart meta and data nodes

Restart all meta and data nodes in your InfluxDB Enterprise cluster to load your
updated configuration.

On each **meta** node, run:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[sysvinit](#)
[systemd](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
service influxdb-meta restart
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
sudo systemctl restart influxdb-meta
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

On each **data** node, run:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[sysvinit](#)
[systemd](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
service influxdb restart
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
sudo systemctl restart influxdb
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Sample LDAP configuration

The following is a sample configuration file that connects to a publicly available LDAP server.

A `DN` ("distinguished name") uniquely identifies an entry and describes its position in the directory information tree (DIT) hierarchy.
The DN of an LDAP entry is similar to a file path on a file system.
`DNs` refers to multiple DN entries.

{{% truncate %}}
```toml
enabled = true

[[servers]]
  enabled = true

[[servers]]
  host = "<LDAPserver>"
  port = 389

  # Security mode for LDAP connection to this server.
  # The recommended security is set "starttls" by default. This uses an initial unencrypted connection
  # and upgrades to TLS as the first action against the server,
  # per the LDAPv3 standard.
  # Other options are "starttls+insecure" to behave the same as starttls
  # but skip server certificate verification, or "none" to use an unencrypted connection.
  security = "starttls"

  # Credentials to use when searching for a user or group.
  bind-dn = "cn=read-only-admin,dc=example,dc=com"
  bind-password = "password"

  # Base DNs to use when applying the search-filter to discover an LDAP user.
  search-base-dns = [
    "dc=example,dc=com",
  ]

  # LDAP filter to discover a user's DN.
  # %s will be replaced with the provided username.
  search-filter = "(uid=%s)"
  # On Active Directory you might use "(sAMAccountName=%s)".

  # Base DNs to use when searching for groups.
  group-search-base-dns = ["dc=example,dc=com"]

  # LDAP filter to identify groups that a user belongs to.
  # %s will be replaced with the user's DN.
  group-membership-search-filter = "(&(objectClass=groupOfUniqueNames)(uniqueMember=%s))"
  # On Active Directory you might use "(&(objectClass=group)(member=%s))".

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

  # Create an administrator role in InfluxDB and then log in as a member of the admin LDAP group. Only members of a group with the administrator role can complete admin tasks.
  # For example, if tesla is the only member of the `italians` group, you must log in as tesla/password.
  admin-groups = ["italians"]

  # These two roles would have to be created by hand if you want these LDAP group memberships to do anything.
  [[servers.group-mappings]]
    group = "mathematicians"
    role = "arithmetic"

  [[servers.group-mappings]]
    group = "scientists"
    role = "laboratory"

```
{{% /truncate %}}
