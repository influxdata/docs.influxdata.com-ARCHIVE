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

### Configure the InfluxDB Enterprise meta nodes

To enable LDAP support in InfluxDB Enterprise, make the following changes on your meta nodes.

* Provide an HTTP Basic Authentication header. See [Authentication and authorization in InfluxDB](/influxdb/v1.7/administration/authentication_and_authorization/) for details on using HTTP Basic Authentication with InfluxDB.
* Provide a username and password as HTTP query parameters
  * `u`: username
  * `p`: password
* Configure the meta node META shared secret to validate requests using JSON web tokens (JWT) and sign each HTTP payload with the username and shared secret.
* Set the `[meta]` configuration setting `meta-shared-secret`, or the corresponding environment variable `INFLUXDB_META_SHARED_SECRET`, to `"<shared-secret>"`.
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
  # but skip server certificate verification, or "none" to use an unencrypted connection.
  # from Mark: Right, there was  '\''breaking'\'' change in the ldap config, that when unspecified, the default is to use TLS.
  # The default used to be unencrypted. We made this change because as far as we know, nobody is using LDAP in production yet.
  # The fix is to update the config to set `security = "none"`:
  # https://github.com/influxdata/plutonium/pull/2853/commits/87a747e40034fcf05f0da1ed74f7c2c598b8d210#diff-fe8a3f0bbdb3fe46a99666a25eb20725
  # The test server is not set up with TLS. Trying to use starttls against it will not work.
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

  # Anyone whose last name begins with X gets to be an admin.
  # If using this config, you'\''ll probably want to remember an X last name to
  # be able to do things like create a database.
  admin-groups = ["X_lastnames"]

  group-mappings = [
    {group = "A_firstnames", role = "a_first"},
    {group = "A_lastnames",  role = "a_last"},
    {group = "B_firstnames", role = "b_first"},
    {group = "B_lastnames",  role = "b_last"},
    {group = "C_firstnames", role = "c_first"},
    {group = "C_lastnames",  role = "c_last"},
    {group = "D_firstnames", role = "d_first"},
    {group = "D_lastnames",  role = "d_last"},
    {group = "E_firstnames", role = "e_first"},
    {group = "E_lastnames",  role = "e_last"},
    {group = "F_firstnames", role = "f_first"},
    {group = "F_lastnames",  role = "f_last"},
    {group = "G_firstnames", role = "g_first"},
    {group = "G_lastnames",  role = "g_last"},
    {group = "H_firstnames", role = "h_first"},
    {group = "H_lastnames",  role = "h_last"},
    {group = "I_firstnames", role = "i_first"},
    {group = "I_lastnames",  role = "i_last"},
    {group = "J_firstnames", role = "j_first"},
    {group = "J_lastnames",  role = "j_last"},
    {group = "K_firstnames", role = "k_first"},
    {group = "K_lastnames",  role = "k_last"},
    {group = "L_firstnames", role = "l_first"},
    {group = "L_lastnames",  role = "l_last"},
    {group = "M_firstnames", role = "m_first"},
    {group = "M_lastnames",  role = "m_last"},
    {group = "N_firstnames", role = "n_first"},
    {group = "N_lastnames",  role = "n_last"},
    {group = "O_firstnames", role = "o_first"},
    {group = "O_lastnames",  role = "o_last"},
    {group = "P_firstnames", role = "p_first"},
    {group = "P_lastnames",  role = "p_last"},
    {group = "Q_firstnames", role = "q_first"},
    {group = "Q_lastnames",  role = "q_last"},
    {group = "R_firstnames", role = "r_first"},
    {group = "R_lastnames",  role = "r_last"},
    {group = "S_firstnames", role = "s_first"},
    {group = "S_lastnames",  role = "s_last"},
    {group = "T_firstnames", role = "t_first"},
    {group = "T_lastnames",  role = "t_last"},
    {group = "U_firstnames", role = "u_first"},
    {group = "U_lastnames",  role = "u_last"},
    {group = "V_firstnames", role = "v_first"},
    {group = "V_lastnames",  role = "v_last"},
    {group = "W_firstnames", role = "w_first"},
    {group = "W_lastnames",  role = "w_last"},
    {group = "X_firstnames", role = "x_first"},
    {group = "X_lastnames",  role = "x_last"},
    {group = "Y_firstnames", role = "y_first"},
    {group = "Y_lastnames",  role = "y_last"},
    {group = "Z_firstnames", role = "z_first"},
    {group = "Z_lastnames",  role = "z_last"},
  ]'
```
