---
title: Authentication and Authorization

menu:
  influxdb_010:
    weight: 0
    parent: administration
---

This document covers setting up and managing authentication and authorization in InfluxDB.

[Authentication](/influxdb/v0.10/administration/authentication_and_authorization/#authentication)

* [Set up authentication](/influxdb/v0.10/administration/authentication_and_authorization/#set-up-authentication)
* [Authenticating requests](/influxdb/v0.10/administration/authentication_and_authorization/#authenticating-requests)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Authenticate using the HTTP API](/influxdb/v0.10/administration/authentication_and_authorization/#authenticate-using-the-http-api)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Authenticate using the CLI](/influxdb/v0.10/administration/authentication_and_authorization/#authenticate-using-the-cli)  

[Authorization](/influxdb/v0.10/administration/authentication_and_authorization/#authorization)

* [User types and their privileges](/influxdb/v0.10/administration/authentication_and_authorization/#user-types-and-their-privileges)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Admin users](/influxdb/v0.10/administration/authentication_and_authorization/#admin-users)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Non-admin users](/influxdb/v0.10/administration/authentication_and_authorization/#non-admin-users)  
* [User management commands](/influxdb/v0.10/administration/authentication_and_authorization/#user-management-commands)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Admin user management](/influxdb/v0.10/administration/authentication_and_authorization/#admin-user-management)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`CREATE` a new admin user](/influxdb/v0.10/administration/authentication_and_authorization/#create-a-new-admin-user)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`GRANT` administrative privileges to an existing user](/influxdb/v0.10/administration/authentication_and_authorization/#grant-administrative-privileges-to-an-existing-user)   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`REVOKE` administrative privileges from an admin user](/influxdb/v0.10/administration/authentication_and_authorization/#revoke-administrative-privileges-from-an-admin-user)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`SHOW` all existing users and their admin status](/influxdb/v0.10/administration/authentication_and_authorization/#show-all-existing-users-and-their-admin-status)    
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Non-admin user management](/influxdb/v0.10/administration/authentication_and_authorization/#non-admin-user-management)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`CREATE` a new non-admin user](/influxdb/v0.10/administration/authentication_and_authorization/#create-a-new-non-admin-user)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`GRANT` `READ`,`WRITE`, or `ALL` database privileges to an existing user](/influxdb/v0.10/administration/authentication_and_authorization/#grant-read-write-or-all-database-privileges-to-an-existing-user)   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`REVOKE` `READ`,`WRITE`, or `ALL` database privileges from an existing user](/influxdb/v0.10/administration/authentication_and_authorization/#revoke-read-write-or-all-database-privileges-from-an-existing-user)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`SHOW` a user's database privileges](/influxdb/v0.10/administration/authentication_and_authorization/#show-a-user-s-database-privileges)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[General admin and non-admin user management](/influxdb/v0.10/administration/authentication_and_authorization/#show-a-user-s-database-privileges)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Re`SET` a user's password](/influxdb/v0.10/administration/authentication_and_authorization/#re-set-a-user-s-password)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`DROP` a user](/influxdb/v0.10/administration/authentication_and_authorization/#drop-a-user)  


[Authentication and authorization HTTP errors](/influxdb/v0.10/administration/authentication_and_authorization/#authentication-and-authorization-http-errors)

> **Note:** Authentication and authorization should not be relied upon to prevent access and protect data from malicious actors.
If additional security or compliance features are desired, InfluxDB should be run behind a third-party service.

## Authentication

InfluxDB's HTTP API and the command line interface (CLI), which connects to the database using the API, include simple, built-in authentication based on user credentials.
When you enable authentication InfluxDB only executes HTTP requests that are sent with valid credentials.


> **Note:** Authentication only occurs at the HTTP request scope.
Plugins do not currently have the ability to authenticate requests and service endpoints (for example, Graphite, collectd, etc.) are not authenticated.

### Set up authentication
---
1. Create at least one [admin user](/influxdb/v0.10/administration/authentication_and_authorization/#admin-users).
See the [authorization section](/influxdb/v0.10/administration/authentication_and_authorization/#authorization) for how to create an admin user.

2. By default, authentication is disabled in the configuration file.
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

3. Restart the process.

Now InfluxDB will check user credentials on every request and will only process requests that have valid credentials for an existing user.

> **Note:** If you enable authentication and have no users, InfluxDB will **not** enforce authentication until you create the first admin user, and InfluxDB will only accept the [query](/influxdb/v0.10/administration/authentication_and_authorization/#create-a-new-admin-user) that creates an admin user.

### Authenticating requests
---
#### Authenticate using the HTTP API
There are two options for authenticating with the HTTP API.


* Authenticate with Basic Authentication as described in [RFC 2617, Section 2](http://tools.ietf.org/html/rfc2617) - this is the preferred method for providing user credentials.

Example:

```bash
curl -G http://localhost:8086/query -u todd:influxdb4ever --data-urlencode "q=SHOW DATABASES"
```

* Authenticate by providing query parameters in the URL.
Set `u` as the username and `p` as the password.


Example:

```bash
curl -G http://localhost:8086/query --data-urlencode "u=todd" --data-urlencode "p=influxdb4ever" --data-urlencode "q=SHOW DATABASES"
```

The queries in both examples assume that the user is an [admin user](/influxdb/v0.10/administration/authentication_and_authorization/#admin-users).
See the section on [authorization](/influxdb/v0.10/administration/authentication_and_authorization/#authorization) for the different user types, their privileges, and more on user management.

> **Notes:** If you authenticate with both Basic Authentication **and** the URL query parameters, the user credentials specified in the query parameters take precedence.

>TODO: Note about redacted passwords when disabled and enabled?

#### Authenticate using the CLI
There are two options for authenticating with the CLI.

* Authenticate with `auth <username> <password>` after starting the CLI.

    Example:

    ```sh
$ influx
Connected to http://localhost:8086 version 0.9.4.1
InfluxDB shell 0.9.4.1
> auth todd influxdb4ever
>
    ```

* Authenticate by setting the `username` and `password` flags when you start the CLI.

    Example:

    ```sh
influx -username todd -password influxdb4ever
    ```

## Authorization
Authorization is only enforced once you've [enabled authentication](/influxdb/v0.10/administration/authentication_and_authorization/#set-up-authentication).
By default, authentication is disabled, all credentials are silently ignored, and all users have all privileges.

### User types and their privileges
---
#### Admin users
Admin users have `READ` and `WRITE` access to all databases and full access to the following administrative queries:

Database management:  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`CREATE DATABASE`, and `DROP DATABASE`  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`DROP SERIES` and `DROP MEASUREMENT`  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`CREATE RETENTION POLICY`, `ALTER RETENTION POLICY`, and `DROP RETENTION POLICY`  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`CREATE CONTINUOUS QUERY` and `DROP CONTINUOUS QUERY`  

See the [database management](/influxdb/v0.10/query_language/database_management/) and [continuous queries](/influxdb/v0.10/query_language/continuous_queries/) page for a complete discussion of the commands listed above.

User management:  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Admin user management:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`CREATE USER`](/influxdb/v0.10/administration/authentication_and_authorization/#create-a-new-admin-user), [`GRANT ALL PRIVILEGES`](/influxdb/v0.10/administration/authentication_and_authorization/#grant-administrative-privileges-to-an-existing-user), [`REVOKE ALL PRIVILEGES`](/influxdb/v0.10/administration/authentication_and_authorization/#revoke-administrative-privileges-from-an-admin-user), and [`SHOW USERS`](/influxdb/v0.10/administration/authentication_and_authorization/#show-all-existing-users-and-their-admin-status)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Non-admin user management:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`CREATE USER`](/influxdb/v0.10/administration/authentication_and_authorization/#create-a-new-non-admin-user), [`GRANT [READ,WRITE,ALL]`](/influxdb/v0.10/administration/authentication_and_authorization/#grant-read-write-or-all-database-privileges-to-an-existing-user), [`REVOKE [READ,WRITE,ALL]`](/influxdb/v0.10/administration/authentication_and_authorization/#revoke-read-write-or-all-database-privileges-from-an-existing-user), and [`SHOW GRANTS`](/influxdb/v0.10/administration/authentication_and_authorization/#show-a-user-s-database-privileges)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;General user management:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`SET PASSWORD`](/influxdb/v0.10/administration/authentication_and_authorization/#re-set-a-user-s-password) and [`DROP USER`](/influxdb/v0.10/administration/authentication_and_authorization/#drop-a-user)  

See [below](/influxdb/v0.10/administration/authentication_and_authorization/#user-management-commands) for a complete discussion of the user management commands.

#### Non-admin users
Non-admin users can have one of the following three privileges per database:  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`READ`  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`WRITE`  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ALL` (both `READ` and `WRITE` access)

`READ`, `WRITE`, and `ALL` privileges are controlled per user per database.
A new non-admin user has no access to any database until they are specifically [granted privileges to a database](/influxdb/v0.10/administration/authentication_and_authorization/#grant-read-write-or-all-database-privileges-to-an-existing-user) by an admin user.

### User management commands
---
#### Admin user management
* ##### `CREATE` a new admin user:  

    ```sql
CREATE USER <username> WITH PASSWORD '<password>' WITH ALL PRIVILEGES
    ```

    CLI example:

    ```sh
> CREATE USER paul WITH PASSWORD 'timeseries4days' WITH ALL PRIVILEGES
>
    ```

* ##### `GRANT` administrative privileges to an existing user:

    ```sql
GRANT ALL PRIVILEGES TO <username>
    ```

    CLI example:

    ```sh
> GRANT ALL PRIVILEGES TO todd
>
    ```

* ##### `REVOKE` administrative privileges from an admin user:

    ```sql
REVOKE ALL PRIVILEGES FROM <username>
    ```

    CLI example:

    ```sh
> REVOKE ALL PRIVILEGES FROM todd
>
    ```

* ##### `SHOW` all existing users and their admin status:

    ```sql
SHOW USERS
    ```

    CLI example:

    ```sh
> SHOW USERS
user 	 admin
todd     false
paul     true
hermione false
dobby    false
    ```

#### Non-admin user management
* ##### `CREATE` a new non-admin user:

    ```sql
CREATE USER <username> WITH PASSWORD '<password>'
    ```

    CLI example:

    ```sh
> CREATE USER todd WITH PASSWORD 'influxdb41yf3'
>
    ```
    > **Note:** The password [string](/influxdb/v0.10/query_language/query_syntax/#string-literals-single-quoted) must be wrapped in single quotes.
Do not include the single quotes when authenticating requests.
> For passwords that include a single quote or a newline character, escape the single quote or newline character with a backslash both when creating the password and when submitting authentication requests.

* ##### `GRANT` `READ`, `WRITE` or `ALL` database privileges to an existing user:

    ```sql
GRANT [READ,WRITE,ALL] ON <database_name> TO <username>
    ```

    CLI examples:

    `GRANT` `READ` access to `todd` on the `NOAA_water_database` database:

    ```sh
> GRANT READ ON NOAA_water_database TO todd
>
    ```

    `GRANT` `ALL` access to `todd` on the `NOAA_water_database` database:

    ```sh
> GRANT ALL ON NOAA_water_database TO todd
>
    ```

* ##### `REVOKE` `READ`, `WRITE`, or `ALL` database privileges from an existing user:

    ```sql
REVOKE [READ,WRITE,ALL] ON <database_name> FROM <username>
    ```

    CLI examples:

    `REVOKE` `ALL` privileges from `todd` on the `NOAA_water_database` database:

    ```sh
> REVOKE ALL ON NOAA_water_database FROM todd
>
    ```

    `REVOKE` `WRITE` privileges from `todd` on the `NOAA_water_database` database:

    ```sh
> REVOKE WRITE ON NOAA_water_database FROM todd
>
    ```

    >**Note:** If a user with `ALL` privileges has `WRITE` privileges revoked, they are left with `READ` privileges, and vice versa.

* ##### `SHOW` a user's database privileges:

    ```sql
SHOW GRANTS FOR <user_name>
    ```

    CLI example:

    ```sh
> SHOW GRANTS FOR todd
database		            privilege
NOAA_water_database	        WRITE
another_database_name	    READ
yet_another_database_name   ALL PRIVILEGES
    ```

#### General admin and non-admin user management

* ##### Re`SET` a user's password:  

    ```sql
SET PASSWORD FOR <username> = '<password>'
    ```

    CLI example:

    ```sh
> SET PASSWORD FOR todd = 'influxdb4ever'
>
    ```

    > **Note:** The password [string](/influxdb/v0.10/query_language/query_syntax/#string-literals-single-quoted) must be wrapped in single quotes.
Do not include the single quotes when authenticating requests.
> For passwords that include a single quote or a newline character, escape the single quote or newline character with a backslash both when creating the password and when submitting authentication requests.

* ##### `DROP` a user:

    ```sql
DROP USER <username>
    ```

    CLI example:

    ```sh
> DROP USER todd
>
    ```

## Authentication and authorization HTTP errors
Requests with invalid credentials and requests by unauthorized users yield the `HTTP 401 Unauthorized` response.
