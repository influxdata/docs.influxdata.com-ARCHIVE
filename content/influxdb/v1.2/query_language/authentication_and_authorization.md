---
title: Authentication and Authorization
aliases:
    - influxdb/v1.2/administration/authentication_and_authorization/
menu:
  influxdb_1_2:
    weight: 90
    parent: query_language
---

This document covers setting up and managing authentication and authorization in InfluxDB.

<table style="width:100%">
  <tr>
    <td><a href="#authentication">Authentication:</a></td>
    <td><a href="#authorization">Authorization:</a></td>
  </tr>
  <tr>
    <td><a href="#set-up-authentication">Set up Authentication</a></td>
    <td><a href="#user-types-and-privileges">User Types and Privileges</a></td>
  </tr>
  <tr>
    <td><a href="#authenticate-requests">Authenticate Requests</a></td>
    <td><a href="#user-management-commands">User Management Commands</a></td>
  </tr>
  <tr>
      <td><a href="#authentication-and-authorization-http-errors">HTTP Errors</a></td>
      <td><a href="#authentication-and-authorization-http-errors">HTTP Errors</a></td>
  </tr>
</table>

> **Note:** Authentication and authorization should not be relied upon to prevent access and protect data from malicious actors.
If additional security or compliance features are desired, InfluxDB should be run behind a third-party service.

## Authentication

InfluxDB's HTTP API and the [command line interface](/influxdb/v1.2/tools/shell/) (CLI), which connects to the database using the API, include simple, built-in authentication based on user credentials.
When you enable authentication InfluxDB only executes HTTP requests that are sent with valid credentials.


> **Note:** Authentication only occurs at the HTTP request scope.
Plugins do not currently have the ability to authenticate requests and service endpoints (for example, Graphite, collectd, etc.) are not authenticated.

### Set up Authentication

#### 1. Create at least one [admin user](#admin-users).
See the [authorization section](#authorization) for how to create an admin user.

> **Note:** If you enable authentication and have no users, InfluxDB will **not** enforce authentication and will only accept the [query](#create-a-new-admin-user) that creates a new admin user.

InfluxDB will enforce authentication once there is an admin user.

#### 2. By default, authentication is disabled in the configuration file.
Enable authentication by setting the `auth-enabled` option to `true` in the `[http]` section of the configuration file:

```
[http]  
  enabled = true  
  bind-address = ":8086"  
  auth-enabled = true # ✨
  log-enabled = true  
  write-tracing = false  
  pprof-enabled = false  
  https-enabled = false  
  https-certificate = "/etc/ssl/influxdb.pem"  
```

#### 3. Restart the process.

Now InfluxDB will check user credentials on every request and will only process requests that have valid credentials for an existing user.

### Authenticate Requests

#### Authenticate with the HTTP API
There are two options for authenticating with the [HTTP API](/influxdb/v1.2/tools/api/).

If you authenticate with both Basic Authentication **and** the URL query parameters, the user credentials specified in the query parameters take precedence.
The queries in the following examples assume that the user is an [admin user](#admin-users).
See the section on [authorization](#authorization) for the different user types, their privileges, and more on user management.

> **Note:** InfluxDB redacts passwords when you enable authentication.

##### Authenticate with Basic Authentication as described in [RFC 2617, Section 2](http://tools.ietf.org/html/rfc2617)
<br>
This is the preferred method for providing user credentials.

Example:

```bash
curl -G http://localhost:8086/query -u todd:influxdb4ever --data-urlencode "q=SHOW DATABASES"
```

##### Authenticate by providing query parameters in the URL or request body
<br>
Set `u` as the username and `p` as the password.

Example using query parameters:

```bash
curl -G "http://localhost:8086/query?u=todd&p=influxdb4ever" --data-urlencode "q=SHOW DATABASES"
```

Example using request body:

```bash
curl -G http://localhost:8086/query --data-urlencode "u=todd" --data-urlencode "p=influxdb4ever" --data-urlencode "q=SHOW DATABASES"
```

#### Authenticate with the CLI
There are three options for authenticating with the [CLI](/influxdb/v1.2/tools/shell/).

##### Authenticate with the `INFLUX_USERNAME` and `INFLUX_PASSWORD` environment variables
<br>
Example:

```
export INFLUX_USERNAME todd
export INFLUX_PASSWORD influxdb4ever
echo $INFLUX_USERNAME $INFLUX_PASSWORD
todd influxdb4ever

influx
Connected to http://localhost:8086 version 1.2.x
InfluxDB shell 1.2.x
```

##### Authenticate by setting the `username` and `password` flags when you start the CLI
<br>
Example:

```bash
influx -username todd -password influxdb4ever
Connected to http://localhost:8086 version 1.2.x
InfluxDB shell 1.2.x
```

##### Authenticate with `auth <username> <password>` after starting the CLI
<br>
Example:

```bash
influx
Connected to http://localhost:8086 version 1.2.x
InfluxDB shell 1.2.x
> auth
username: todd
password:
>
```


>
## Authenticate Telegraf requests to InfluxDB
>
Authenticating [Telegraf](/telegraf/v1.2/) requests to an InfluxDB instance with
authentication enabled requires some additional steps.
In Telegraf's configuration file (`/etc/telegraf/telegraf.conf`), uncomment
and edit the `username` and `password` settings:
>
    ###############################################################################
    #                            OUTPUT PLUGINS                                   #
    ###############################################################################
>
    [...]
>
    ## Write timeout (for the InfluxDB client), formatted as a string.
    ## If not provided, will default to 5s. 0s means no timeout (not recommended).
    timeout = "5s"
    username = "telegraf" #💥
    password = "metricsmetricsmetricsmetrics" #💥
>
    [...]
>
Next, restart Telegraf and you're all set!

## Authorization

Authorization is only enforced once you've [enabled authentication](#set-up-authentication).
By default, authentication is disabled, all credentials are silently ignored, and all users have all privileges.

### User Types and Privileges

#### Admin users
Admin users have `READ` and `WRITE` access to all databases and full access to the following administrative queries:

Database management:  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`CREATE DATABASE`, and `DROP DATABASE`  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DROP SERIES` and `DROP MEASUREMENT`  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`CREATE RETENTION POLICY`, `ALTER RETENTION POLICY`, and `DROP RETENTION POLICY`  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`CREATE CONTINUOUS QUERY` and `DROP CONTINUOUS QUERY`  

See the [database management](/influxdb/v1.2/query_language/database_management/) and [continuous queries](/influxdb/v1.2/query_language/continuous_queries/) pages for a complete discussion of the commands listed above.

User management:  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Admin user management:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`CREATE USER`](#create-a-new-admin-user), [`GRANT ALL PRIVILEGES`](#grant-administrative-privileges-to-an-existing-user), [`REVOKE ALL PRIVILEGES`](#revoke-administrative-privileges-from-an-admin-user), and [`SHOW USERS`](#show-all-existing-users-and-their-admin-status)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Non-admin user management:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`CREATE USER`](#create-a-new-non-admin-user), [`GRANT [READ,WRITE,ALL]`](#grant-read-write-or-all-database-privileges-to-an-existing-user), [`REVOKE [READ,WRITE,ALL]`](#revoke-read-write-or-all-database-privileges-from-an-existing-user), and [`SHOW GRANTS`](#show-a-user-s-database-privileges)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;General user management:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`SET PASSWORD`](#re-set-a-user-s-password) and [`DROP USER`](#drop-a-user)  

See [below](#user-management-commands) for a complete discussion of the user management commands.

#### Non-admin users
Non-admin users can have one of the following three privileges per database:  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`READ`  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`WRITE`  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ALL` (both `READ` and `WRITE` access)

`READ`, `WRITE`, and `ALL` privileges are controlled per user per database. A new non-admin user has no access to any database until they are specifically [granted privileges to a database](#grant-read-write-or-all-database-privileges-to-an-existing-user) by an admin user.

### User Management Commands

#### Admin user management
##### `CREATE` a new admin user:  
<br>
```
CREATE USER <username> WITH PASSWORD '<password>' WITH ALL PRIVILEGES
```

CLI example:

```bash
> CREATE USER "paul" WITH PASSWORD 'timeseries4days' WITH ALL PRIVILEGES
>
```

> **Note:** Repeating the exact `CREATE USER` statement is idempotent. If any values change the database will return a duplicate user error. See GitHub Issue [#6890](https://github.com/influxdata/influxdb/pull/6890) for details.
>
CLI example:
>
    > CREATE USER "todd" WITH PASSWORD '123456' WITH ALL PRIVILEGES
    > CREATE USER "todd" WITH PASSWORD '123456' WITH ALL PRIVILEGES
    > CREATE USER "todd" WITH PASSWORD '123' WITH ALL PRIVILEGES
    ERR: user already exists
    > CREATE USER "todd" WITH PASSWORD '123456'
    ERR: user already exists
    > CREATE USER "todd" WITH PASSWORD '123456' WITH ALL PRIVILEGES
    >

##### `GRANT` administrative privileges to an existing user:
<br>
```
GRANT ALL PRIVILEGES TO <username>
```

CLI example:

```bash
> GRANT ALL PRIVILEGES TO "todd"
>
```

##### `REVOKE` administrative privileges from an admin user:
<br>
```
REVOKE ALL PRIVILEGES FROM <username>
```

CLI example:

```bash
> REVOKE ALL PRIVILEGES FROM "todd"
>
```

##### `SHOW` all existing users and their admin status:
<br>
```
SHOW USERS
```

CLI example:

```bash
> SHOW USERS
user 	 admin
todd     false
paul     true
hermione false
dobby    false
```

#### Non-admin user management
##### `CREATE` a new non-admin user:
<br>
```
CREATE USER <username> WITH PASSWORD '<password>'
```

CLI example:

```bash
> CREATE USER "todd" WITH PASSWORD 'influxdb41yf3'
>
```

> **Notes:**
>
* The password [string](/influxdb/v1.2/query_language/spec/#strings) must be wrapped in single quotes.
Do not include the single quotes when authenticating requests.
> For passwords that include a single quote or a newline character, escape the single quote or newline character with a backslash both when creating the password and when submitting authentication requests.
>
* Repeating the exact `CREATE USER` statement is idempotent. If any values change the database will return a duplicate user error. See GitHub Issue [#6890](https://github.com/influxdata/influxdb/pull/6890) for details.
>
CLI example:
>
    > CREATE USER "todd" WITH PASSWORD '123456'
    > CREATE USER "todd" WITH PASSWORD '123456'
    > CREATE USER "todd" WITH PASSWORD '123'
    ERR: user already exists
    > CREATE USER "todd" WITH PASSWORD '123456'
    > CREATE USER "todd" WITH PASSWORD '123456' WITH ALL PRIVILEGES
    ERR: user already exists
    > CREATE USER "todd" WITH PASSWORD '123456'
    >


##### `GRANT` `READ`, `WRITE` or `ALL` database privileges to an existing user:
<br>
```
GRANT [READ,WRITE,ALL] ON <database_name> TO <username>
```

CLI examples:

`GRANT` `READ` access to `todd` on the `NOAA_water_database` database:

```bash
> GRANT READ ON "NOAA_water_database" TO "todd"
>
```

`GRANT` `ALL` access to `todd` on the `NOAA_water_database` database:

```bash
> GRANT ALL ON "NOAA_water_database" TO "todd"
>
```

##### `REVOKE` `READ`, `WRITE`, or `ALL` database privileges from an existing user:
<br>
```
REVOKE [READ,WRITE,ALL] ON <database_name> FROM <username>
```

CLI examples:

`REVOKE` `ALL` privileges from `todd` on the `NOAA_water_database` database:

```bash
> REVOKE ALL ON "NOAA_water_database" FROM "todd"
>
```

`REVOKE` `WRITE` privileges from `todd` on the `NOAA_water_database` database:

```bash
> REVOKE WRITE ON "NOAA_water_database" FROM "todd"
>
```

>**Note:** If a user with `ALL` privileges has `WRITE` privileges revoked, they are left with `READ` privileges, and vice versa.

##### `SHOW` a user's database privileges:
<br>
```
SHOW GRANTS FOR <user_name>
```

CLI example:

```bash
> SHOW GRANTS FOR "todd"
database		            privilege
NOAA_water_database	        WRITE
another_database_name	    READ
yet_another_database_name   ALL PRIVILEGES
```

#### General admin and non-admin user management

##### Re`SET` a user's password:  
<br>
```
SET PASSWORD FOR <username> = '<password>'
```

CLI example:

```bash
> SET PASSWORD FOR "todd" = 'influxdb4ever'
>
```

    > **Note:** The password [string](/influxdb/v1.2/query_language/spec/#strings) must be wrapped in single quotes.
Do not include the single quotes when authenticating requests.
> For passwords that include a single quote or a newline character, escape the single quote or newline character with a backslash both when creating the password and when submitting authentication requests.

##### `DROP` a user:
<br>
```
DROP USER <username>
```

CLI example:

```bash
> DROP USER "todd"
>
```

## Authentication and Authorization HTTP Errors

Requests with no authentication credentials or incorrect credentials yield the `HTTP 401 Unauthorized` response.

Requests by unauthorized users yield the `HTTP 403 Forbidden` response.
