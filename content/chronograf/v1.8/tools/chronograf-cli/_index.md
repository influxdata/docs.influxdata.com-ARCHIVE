---
title: chronograf cli
description: The `chronograf` command line interface (CLI) includes options to manage many aspects of Chronograf security.
menu:
  chronograf_1_8:
    name: chronograf CLI
    parent: Tools
    weight: 10

---

The `chronograf` command line interface (CLI) includes options to manage Chronograf security.

## Usage
```
chronograf [flags]
```

## Chronograf service flags

| Flag                  | Description                                                                               | Default                                 | Env. Variable      |
|-----------------------|-------------------------------------------------------------------------------------------|-----------------------------------------|--------------------|
| `--host`              | IP the Chronograf service listens on                                                      | `0.0.0.0`                               | `$HOST`            |
| `--port`              | Port the Chronograf service listens on for insecure connections                           | `8888`                                  | `$PORT`            |
| `-b`,`--bolt-path`   | File path to the BoltDB file                                                              | `./chronograf-v1.db`                    | `$BOLT_PATH`       |
| `-c`,`--canned-path` | File path to the directory of canned dashboard files                                      | `/usr/share/chronograf/canned`          | `$CANNED_PATH`     |
| `--resources-path`    | Path to directory of canned dashboards, sources, Kapacitor connections, and organizations | `/usr/share/chronograf/resources`       | `$RESOURCES_PATH`  |
| `-b`, `--basepath`   | URL path prefix under which all Chronograf routes will be mounted.                        |                                         | `$BASE_PATH`       |
| `--status-feed-url`   | URL of JSON feed to display as a news feed on the client status page                      | `https://www.influxdata.com/feed/json` | `$STATUS_FEED_URL` |
| `-v`, `--version`    | Displays the version of the Chronograf service                                           |                                         |                    |
| `-h`, `--host-page-disabled`    | Disables the hosts page                                           |                                         |      `$HOST_PAGE_DISABLED`              |


## InfluxDB connection flags

| Flag                  | Description                                                                   | Env. Variable        |
|-----------------------|-------------------------------------------------------------------------------|----------------------|
| `--influxdb-url`      | Location of your InfluxDB instance, including `http://`, IP address, and port | `$INFLUXDB_URL`      |
| `--influxdb-username` | Username for your InfluxDB instance                                           | `$INFLUXDB_USERNAME` |
| `--influxdb-password` | Password for your InfluxDB instance                                           | `$INFLUXDB_PASSWORD` |

## Kapacitor connection flags

| Flag                   | Description                                                                    | Env. Variable         |
|------------------------|--------------------------------------------------------------------------------|-----------------------|
| `--kapacitor-url`      | Location of your Kapacitor instance, including `http://`, IP address, and port | `$KAPACITOR_URL`      |
| `--kapacitor-username` | Username for your Kapacitor instance                                           | `$KAPACITOR_USERNAME` |
| `--kapacitor-password` | Password for your Kapacitor instance                                           | `$KAPACITOR_PASSWORD` |

## TLS (Transport Layer Security) flags

| Flag    | Description                                                | Env. Variable      |
|---------|------------------------------------------------------------|--------------------|
| `--cert | File path to PEM-encoded public key certificate            | `$TLS_CERTIFICATE` |
| `--key` | File path to private key associated with given certificate | `$TLS_PRIVATE_KEY` |

## Other service option flags

| Flag                                         | Description                                                                                                                                                                                                                                                 | Env. Variable         |
|----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| `--custom-link <display_name>:<link_address> | Custom link added to Chronograf user menu options. Useful for providing links to internal company resources for your Chronograf users. Can be used when any OAuth 2.0 authentication is enabled. To add another custom link, repeat the custom link option. |                       |
| `-r`, `--reporting-disabled`                 | Disables reporting of usage statistics. Usage statistics reported once every 24 hours include: `OS`, `arch`, `version`, `cluster_id`, and `uptime`.                                                                                                         | `$REPORTING_DISABLED` |
| `-l`, `--log-level`                          | Sets the logging level. Valid values include `info` (default), `debug`, and `error`.                                                                                                                                                                        | `$LOG_LEVEL`          |
| `-d`, `--develop`                            | Runs the Chronograf service in developer mode                                                                                                                                                                                                               |                       |
| `-h`, `--help`                               | Displays command line help for Chronograf                                                                                                                                                                                                                   |                       |

## Authentication option flags

### General authentication flags

| Flag                   | Description                                                                                                                                                                                                                                                                                         | Env. Variable    |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| `-t`, `--token-secret` | Secret for signing tokens                                                                                                                                                                                                                                                                           | `$TOKEN_SECRET`  |
| `--auth-duration`      | Total duration, in hours, of cookie life for authentication. Default value is `720h`.                                                                                                                                                                                                               | `$AUTH_DURATION` |
| `--public-url`         | Public URL required to access Chronograf using a web browser. For example, if you access Chronograf using the default URL, the public URL value would be `http://localhost:8888`. Required for Google OAuth 2.0 authentication. Used for Auth0 and some generic OAuth 2.0 authentication providers. | `$PUBLIC_URL`    |

### GitHub-specific OAuth 2.0 authentication flags

| Flag                           | Description                                                             | Env. Variable       |
|--------------------------------|-------------------------------------------------------------------------|---------------------|
| `-i`, `--github-client-id`     | GitHub client ID value for OAuth 2.0 support                            | `$GH_CLIENT_ID`     |
| `-s`, `--github-client-secret` | GitHub client secret value for OAuth 2.0 support                        | `$GH_CLIENT_SECRET` |
| `-o`, `--github-organization`  | Specify a GitHub organization membership required for a user. Optional. | `$GH_ORGS`          |

### Google-specific OAuth 2.0 authentication flags

| Flag                     | Description                                                                     | Env. Variable           |
|--------------------------|---------------------------------------------------------------------------------|-------------------------|
| `--google-client-id`     | Google client ID value for OAuth 2.0 support                                    | `$GOOGLE_CLIENT_ID`     |
| `--google-client-secret` | Google client secret value for OAuth 2.0 support                                | `$GOOGLE_CLIENT_SECRET` |
| `--google-domains`       | Restricts authorization to users from specified Google email domains. Optional. | `$GOOGLE_DOMAINS`       |


### Auth0-specific OAuth 2.0 authentication flags

| Flag                    | Description                                                                                                                                                                                                                   | Env. Variable          |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|
| `--auth0-domain`        | Subdomain of your Auth0 client. Available on the configuration page for your Auth0 client.                                                                                                                                    | `$AUTH0_DOMAIN`        |
| `--auth0-client-id`     | Auth0 client ID value for OAuth 2.0 support                                                                                                                                                                                   | `$AUTH0_CLIENT_ID`     |
| `--auth0-client-secret` | Auth0 client secret value for OAuth 2.0 support                                                                                                                                                                               | `$AUTH0_CLIENT_SECRET` |
| `--auth0-organizations` | Auth0 organization membership required to access Chronograf. Organizations are set using an organization key in the user’s `app_metadata`. Lists are comma-separated and are only available when using environment variables. | `$AUTH0_ORGS`          |

### Heroku-specific OAuth 2.0 authentication flags

| Flag                    | Description                                                                              | Env. Variable       |
|-------------------------|------------------------------------------------------------------------------------------|---------------------|
| `--heroku-client-id`    | Heroku client ID value for OAuth 2.0 support                                             | `$HEROKU_CLIENT_ID` |
| `--heroku-secret`       | Heroku secret for OAuth 2.0 support                                                      | `$HEROKU_SECRET`    |
| `--heroku-organization` | Heroku organization membership required to access Chronograf. Lists are comma-separated. | `$HEROKU_ORGS`      |

### Generic OAuth 2.0 authentication flags

| Flag                      | Description                                                                    | Env. Variable            |
|---------------------------|--------------------------------------------------------------------------------|--------------------------|
| `--generic-name`          | Generic OAuth 2.0 name presented on the login page                             | `$GENERIC_NAME`          |
| `--generic-client-id`     | Generic OAuth 2.0 client ID value. Can be used for a custom OAuth 2.0 service. | `$GENERIC_CLIENT_ID`     |
| `--generic-client-secret` | Generic OAuth 2.0 client secret value                                          | `$GENERIC_CLIENT_SECRET` |
| `--generic-scopes`        | Scopes requested by provider of web client                                     | `$GENERIC_SCOPES`        |
| `--generic-domains`       | Email domain required for user email addresses                                 | `$GENERIC_DOMAINS`       |
| `--generic-auth-url`      | Authorization endpoint URL for the OAuth 2.0 provider                          | `$GENERIC_AUTH_URL`      |
| `--generic-token-url`     | Token endpoint URL for the OAuth 2.0 provider                                  | `$GENERIC_TOKEN_URL`     |
| `--generic-api-url`       | URL that returns OpenID UserInfo-compatible information                        | `$GENERIC_API_URL`       |
