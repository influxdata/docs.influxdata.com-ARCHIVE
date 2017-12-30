---
title: Chronograf configuration options
menu:
  chronograf_1_4:
    name: Configuration options
    weight: 25
    parent: Administration
---

On this page:

* [Usage](#usage)
* [Application options](#application-options)
* [InfluxDB authentication options](#influxdb-authentication-options)
* [Kapacitor authentication options](#kapacitor-authentication-options)
* [GitHub OAuth 2.0 authentication options](#github-oauth-2-0-authentication-options)
* [Google OAuth 2.0 authentication options](#google-oauth-2-0-authentication-options)
* [Heroku OAuth 2.0 authentication options](#heroku-oauth-2-0-authentication-options)
* [Auth0 OAuth 2.0 authentication options](#auth0-oauth-2-0-authentication-options)
* [Generic OAuth 2.0 authentication options](#generic-oauth-2-0-authentication-options)
* [Other options](#other-options)
* [Help option](#help-option)

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


## Application options

### `--host=`

The IP that `chronograf` listens on (default: `0.0.0.0`).

Environment variable: `$HOST`

### `--port=`

The port that `chronograf` listens on for insecure connections (default: `8888`).

Environment variable: `$PORT`

### `--cert=`

The file path to PEM-encoded public key certificate.

Environment variable: `$TLS_CERTIFICATE`

### `--key=`

The file path to private key associated with given certificate.

Environment variable: `$TLS_PRIVATE_KEY`

## InfluxDB options

### `--influxdb-url=`

The location of your InfluxDB instance, including `http://`, IP address, and port.

Example: `http:///0.0.0.0:8086`

Environment variable: `$INFLUXDB_URL`

### `--influxdb-username=`

The [username](/chronograf/v1.4/administration/managing-users/) for your InfluxDB instance.

Environment variable: `$INFLUXDB_USERNAME`

### `--influxdb-password=`

The [password](/chronograf/v1.3/administration/managing-users/) for your InfluxDB instance.

Environment variable: `$INFLUXDB_PASSWORD`

## Kapacitor options

### `--kapacitor-url=`

The location of your Kapacitor instance, including `http://`, IP address, and port.

Example: `http://0.0.0.0:9092`.

Environment variable: `$KAPACITOR_URL`

### `--kapacitor-username=`

The username for your Kapacitor instance.

Environment variable: `$KAPACITOR_USERNAME`

### `--kapacitor-password=`

The password for your Kapacitor instance.

Environment variable: `$KAPACITOR_PASSWORD`

## Other options

### `--develop` | `-d`

Run the `chronograf` server in develop mode.

### `--bolt-path=` | `-b`

The file path to the BoltDB file.

Default: `/var/lib/chronograf/chronograf-v1-.db`

Environment variable: `$BOLT_PATH`

### `--canned-path=` | `-c`

The path to the directory for [pre-created dashboards](/chronograf/v1.4/troubleshooting/frequently-asked-questions/#what-applications-are-supported-in-chronograf)

Default: `/usr/share/chronograf/canned`

Environment variable: `$CANNED_PATH`

### `--token-secret=` | `-t`

The secret for signing tokens.

Environment variable: `$TOKEN_SECRET`

### `--auth-duration=`

The total duration (in hours) of cookie life for authentication.

Default: `720h`

Authentication expires on browser close when `--auth-duration` is set to `0`.

Environment variable: `$AUTH_DURATION`

## GitHub OAuth 2.0 authentication options

### `--github-client-id=` | `-i`

The GitHub client ID for OAuth 2.0 support.

Environment variable: `$GH_CLIENT_ID`

### `--github-client-secret=` | `-s`

The GitHub client secret for OAuth 2.0 support.

Environment variable: `$GH_CLIENT_SECRET`

### `--github-organization=` | `-o`

The GitHub organization user is required to have an active membership.

Environment variable: `$GH_ORGS`

## Google OAuth 2 authentication options

### `--google-client-id=`

The Google client ID for OAuth 2.0 support.

Environment variable: `$GOOGLE_CLIENT_ID`

### `--google-client-secret=`

The Google client secret for OAuth 2.0 support.

Environment variable: `$GOOGLE_CLIENT_SECRET`

### `--google-domains=`

The Google email domain user is required to have an active membership.

Environment variable: `$GOOGLE_DOMAINS`

### `--public-url=`

The full public URL used to access Chronograf from a web browser.
Used for Google, Auth0, and some generic OAuth 2.0 authentication providers.

Default: `http://localhost:8888`

Environment variable: `$PUBLIC_URL`

## Heroku OAuth 2.0 authentication options

### `--heroku-client-id=`

The Heroku client ID for OAuth 2.0 support.

Environment variable: `$HEROKU_CLIENT_ID`

### `--heroku-secret=`

The Heroku secret for OAuth 2.0 support.

Environment variable: `$HEROKU_SECRET`

### `--heroku-organization=`

The Heroku organization memberships required to access Chronograf. Lists are comma-separated.

Environment variable: `$HEROKU_ORGS`

## Auth0 OAuth 2.0 authentication options

### `--auth0-domain=`

The subdomain of your Auth0 client; available on the configuration page for your Auth0 client.

Example: https://myauth0client.auth0.com

Environment variable: `$AUTH0_DOMAIN`

### `--auth0-client-id=`

The client ID supplied by Auth0 for OAuth 2 support.

Environment variable: `$AUTH0_CLIENT_ID`

### `--auth0-client-secret=`

The client secret supplied by Auth0 for OAuth 2 support.

Environment variable: `$AUTH0_CLIENT_SECRET`

### `--auth0-organizations=`

The Auth0 organization required to access Chronograf.
Organizations are set using an "organization" key in the user's `app_metadata`.
Lists are comma-separated and only available when using environment variables.

Environment variable: `$AUTH0_ORGS`

## Generic OAuth 2.0 autentication options

### `--generic-name=`

The generic OAuth 2.0 name presented on the login page.

Environment variable: `$GENERIC_NAME`

### `--generic-client-id=`

The generic OAuth 2.0 client ID.
Can be used for a custom OAuth 2.0 service.

Environment variable: `$GENERIC_CLIENT_ID`

### `--generic-client-secret=`

The generic OAuth 2.0 client secret.

Environment variable: `$GENERIC_CLIENT_SECRET`

### `--generic-scopes=`

The scopes requested by provider of web client.

Default: `user:email`

Environment variable: `$GENERIC_SCOPES`

### `--generic-domains=`

The email domain users' email address to have.

Example: `example.com`

Environment variable: `$GENERIC_DOMAINS`

### `--generic-auth-url=`

The OAuth 2.0 provider's authorization endpoint URL.

Environment variable: `$GENERIC_AUTH_URL`

### `--generic-token-url=`

The OAuth 2.0 provider's token endpoint URL.

Environment variable: `$GENERIC_TOKEN_URL`

### `--generic-api-url=`

The URL that returns OpenID UserInfo-compatible information.

Environment variable: `$GENERIC_API_URL`

### `--reporting-disabled` | `-r`

Disables reporting of usage statistics.
Usage statistics report once every 24 hours include: OS, arch, version, cluster_id, and uptime information.

Environment variable: `$REPORTING_DISABLED`

### `--log-level=choice[debug|info|error]` | `-l`

Set the logging level.

Default: `info`

Environment variable: `$LOG_LEVEL`

### `--basepath=` | `-p`

The URL path prefix under which all `chronograf` routes will be mounted.

Environment variable: `$BASE_PATH`

### `--prefix-routes`

Forces `chronograf` server to require that all requests to it are prefixed with the value set in `--basepath`.

Environment variable: `$PREFIX_ROUTES`

### `--version` | `-v`

Show Chronograf version information.

## Help option

### `--help` | `-h`

Show the help information for `chronograf`.
