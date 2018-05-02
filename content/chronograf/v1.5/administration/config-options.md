---
title: Chronograf configuration options
description: Details on configuration settings (command line options and environment variables) for Chronograf services, Kapacitor and InfluxDB connections, and OAuth 2.0 authentication providers.
menu:
  chronograf_1_5:
    name: Configuration options
    weight: 30
    parent: Administration
---

**On this page:**

* [Usage](#usage)
* [Chronograf service options](#chronograf-service-options)
  - [InfluxDB connection options](#influxdb-connection-options)
  - [Kapacitor connection options](#kapacitor-connection-options)
  - [TLS (Transport Layer Security) options](#tls-transport-layer-security-options)
  * [Other service options](#other-service-options)
* [Authentication options](#authentication-options)
    * [General authentication options](#general-authentication-options)
    * [GitHub-specific OAuth 2.0 authentication options](#github-specific-oauth-2-0-authentication-options)
    * [Google-specific OAuth 2.0 authentication options](#google-specific-oauth-2-0-authentication-options)
    * [Auth0-specific OAuth 2.0 authentication options](#auth0-specific-oauth-2-0-authentication-options)
    * [Heroku-specific OAuth 2.0 authentication options](#heroku-specific-oauth-2-0-authentication-options)
    * [Generic OAuth 2.0 authentication options](#generic-oauth-2-0-authentication-options)

## Usage

When starting the Chronograf service, include any options after `chronograf`, where `[OPTIONS]` are options separated by spaces:

```sh
 chronograf [OPTIONS]
```

Examples:

* Linux: Setting options for develop mode and disabling reporting

```sh
  sudo systemctl start chronograf --develop --reporting-disabled
```
* Mac OS X: Using shortcut options to set develop mode and disable reporting

```sh
  chronograf -d -r
```

> ***Note:*** Command line options take precedence over corresponding environment variables.


## Chronograf service options

#### `--host=`

The IP that the `chronograf` service listens on.

Default value: `0.0.0.0`

Example: `--host=0.0.0.0`

Environment variable: `$HOST`

#### `--port=`

The port that the `chronograf` service listens on for insecure connections.

Default: `8888`

Environment variable: `$PORT`

#### `--bolt-path=` | `-b`

The file path to the BoltDB file.

Default value: `./chronograf-v1.db`

Environment variable: `$BOLT_PATH`

####`--canned-path=` | `-c`

The path to the directory of [canned dashboards](/chronograf/latest/troubleshooting/frequently-asked-questions/#what-applications-are-supported-in-chronograf) files.

Default value: `/usr/share/chronograf/canned`

Environment variable: `$CANNED_PATH`

####`--basepath=` | `-p`

The URL path prefix under which all `chronograf` routes will be mounted.

Environment variable: `$BASE_PATH`

####`--status-feed-url=`

URL of JSON feed to display as a news feed on the client Status page.

Default value: `https://www.influxdata.com/feed/json`

Environment variable: `$STATUS_FEED_URL`

####`--version` | `-v`

Displays the version of the Chronograf service.

Example:
```sh
$ chronograf -v
2018/01/03 14:11:19 Chronograf 1.4.0.0-rc1-26-gb74ae387 (git: b74ae387)
```

## InfluxDB connection options

### `--influxdb-url=`

The location of your InfluxDB instance, including `http://`, IP address, and port.

Example: `--influxdb-url=http:///0.0.0.0:8086`

Environment variable: `$INFLUXDB_URL`

### `--influxdb-username=`

The [username] for your InfluxDB instance.

Environment variable: `$INFLUXDB_USERNAME`

### `--influxdb-password=`

The [password] for your InfluxDB instance.

Environment variable: `$INFLUXDB_PASSWORD`

## Kapacitor connection options

### `--kapacitor-url=`

The location of your Kapacitor instance, including `http://`, IP address, and port.

Example: `--kapacitor-url=http://0.0.0.0:9092`.

Environment variable: `$KAPACITOR_URL`

### `--kapacitor-username=`

The username for your Kapacitor instance.

Environment variable: `$KAPACITOR_USERNAME`

### `--kapacitor-password=`

The password for your Kapacitor instance.

Environment variable: `$KAPACITOR_PASSWORD`

### TLS (Transport Layer Security) options

See [Configuring TLS (Transport Layer Security) and HTTPS](/chronograf/v1.5/administration/managing-security/#configuring-tls-transport-layer-security-and-https) for more information.

#### `--cert=`

The file path to PEM-encoded public key certificate.

Environment variable: `$TLS_CERTIFICATE`

#### `--key=`

The file path to private key associated with given certificate.

Environment variable: `$TLS_PRIVATE_KEY`


### Other service options

####`--custom-link <display_name>:<link_address>`

Custom link added to Chronograf User menu options. Useful for providing links to internal company resources for your Chronograf users. Can be used when any OAuth 2.0 authentication is enabled. To add another custom link, repeat the custom link option.

Example: `--custom-link InfluxData:http://www.influxdata.com/`

#### `--reporting-disabled` | `-r`

Disables reporting of usage statistics.
Usage statistics reported once every 24 hours include: `OS`, `arch`, `version`, `cluster_id`, and `uptime`.

Environment variable: `$REPORTING_DISABLED`

#### `--log-level=` | `-l`

Set the logging level.

Valid values: `debug` | `info` | `error`

Default value: `info`

Example: `--log-level=debug`

Environment variable: `$LOG_LEVEL`

#### `--develop` | `-d`

Run the `chronograf` service in developer mode.

####`--help` | `-h`

Displays the command line help for `chronograf`.

## Authentication options

### General authentication options

####`--token-secret=` | `-t`

The secret for signing tokens.

Environment variable: `$TOKEN_SECRET`

####`--auth-duration=`

The total duration (in hours) of cookie life for authentication.

Default value: `720h`

Authentication expires on browser close when `--auth-duration=0`.

Environment variable: `$AUTH_DURATION`

####`--public-url=`

The public URL required to access Chronograf using a web browser. For example, if you access Chronograf using the default URL, the public URL value would be `http://localhost:8888`.
Required for Google OAuth 2.0 authentication. Used for Auth0 and some generic OAuth 2.0 authentication providers.

Environment variable: `$PUBLIC_URL`


### GitHub-specific OAuth 2.0 authentication options

See [Configuring GitHub authentication](/chronograf/v1.5/administration/managing-security/#configuring-github-authentication) for more information.

####`--github-client-id=` | `-i`

The GitHub client ID value for OAuth 2.0 support.

Environment variable: `$GH_CLIENT_ID`

####`--github-client-secret=` | `-s`

The GitHub Client Secret value for OAuth 2.0 support.

Environment variable: `$GH_CLIENT_SECRET`

####`--github-organization=` | `-o`

[Optional] Specify a GitHub organization membership required for a user.

Environment variable: `$GH_ORGS`

### Google-specific OAuth 2.0 authentication options

See [Configuring Google authentication](/chronograf/v1.5/administration/managing-security/#configuring-google-authentication) for more information.

####`--google-client-id=`

The Google Client ID value required for OAuth 2.0 support.

Environment variable: `$GOOGLE_CLIENT_ID`

####`--google-client-secret=`

The Google Client Secret value required for OAuth 2.0 support.

Environment variable: `$GOOGLE_CLIENT_SECRET`

####`--google-domains=`

[Optional] Restricts authorization to users from specified Google email domains.

Environment variable: `$GOOGLE_DOMAINS`

### Auth0-specific OAuth 2.0 authentication options

See [Configuring Auth0 authentication](/chronograf/v1.5/administration/managing-security/#configuring-auth0-authentication) for more information.

####`--auth0-domain=`

The subdomain of your Auth0 client; available on the configuration page for your Auth0 client.

Example: https://myauth0client.auth0.com

Environment variable: `$AUTH0_DOMAIN`

####`--auth0-client-id=`

The Auth0 Client ID value required for OAuth 2.0 support.

Environment variable: `$AUTH0_CLIENT_ID`

####`--auth0-client-secret=`

The Auth0 Client Secret value required for OAuth 2.0 support.

Environment variable: `$AUTH0_CLIENT_SECRET`

####`--auth0-organizations=`

[Optional] The Auth0 organization membership required to access Chronograf.
Organizations are set using an "organization" key in the user's `app_metadata`.
Lists are comma-separated and are only available when using environment variables.

Environment variable: `$AUTH0_ORGS`

### Heroku-specific OAuth 2.0 authentication options

See [Configuring Heroku authentication](/chronograf/v1.5/administration/managing-security/#configuring-heroku-authentication) for more information.

### `--heroku-client-id=`                         
The Heroku Client ID for OAuth 2.0 support.

**Environment Variable:** `$HEROKU_CLIENT_ID`

### `--heroku-secret=`                            
The Heroku Secret for OAuth 2.0 support.

**Environment Variable:** `$HEROKU_SECRET`

### `--heroku-organization=`                      
The Heroku organization memberships required for access to Chronograf.
Lists are comma-separated.

**Environment Variable:** `$HEROKU_ORGS`


### Generic OAuth 2.0 authentication options

See [Configuring Generic authentication](/chronograf/v1.5/administration/managing-security/#configuring-generic-authentication) for more information.

####`--generic-name=`

The generic OAuth 2.0 name presented on the login page.

Environment variable: `$GENERIC_NAME`

####`--generic-client-id=`

The generic OAuth 2.0 Client ID value.
Can be used for a custom OAuth 2.0 service.

Environment variable: `$GENERIC_CLIENT_ID`

####`--generic-client-secret=`

The generic OAuth 2.0 Client Secret value.

Environment variable: `$GENERIC_CLIENT_SECRET`

####`--generic-scopes=`

The scopes requested by provider of web client.

Default value: `user:email`

Environment variable: `$GENERIC_SCOPES`

####`--generic-domains=`

The email domain required for user email addresses.

Example: `--generic-domains=example.com`

Environment variable: `$GENERIC_DOMAINS`

####`--generic-auth-url=`

The authorization endpoint URL for the OAuth 2.0 provider.

Environment variable: `$GENERIC_AUTH_URL`

####`--generic-token-url=`

The token endpoint URL for the OAuth 2.0 provider.

Environment variable: `$GENERIC_TOKEN_URL`

####`--generic-api-url=`

The URL that returns OpenID UserInfo-compatible information.

Environment variable: `$GENERIC_API_URL`
