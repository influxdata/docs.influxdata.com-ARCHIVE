---
title: Managing Chronograf security

aliases: /chronograf_1_4/security-best-practices/

menu:
  chronograf_1_4:
    name: Managing security
    weight: 50
    parent: Administration
---

**On this page**

* [Chronograf security](#chronograf-security)
* [OAuth 2.0 providers with JWT tokens](#oauth-2-0-providers-with-jwt-tokens)
* [OAuth 2.0 providers](#oauth-2-0-providers)
  * [GitHub](#github)
  * [Google](#google)
  * [Auth0](#auth0)
  * [Generic](#generic)
* [Configuring authentication duration](#onfiguring-authentication-duration)
* [TLS (Transport Layer Security) and HTTPS](#tls--transport-layer-security-and-https)
* [Testing with self-signed certificates](#testing-with-self-signed-certificates)

## Chronograf security

Role-based access control in Chronograf and enhanced security are provided using two configurable options:

* OAuth 2.0 providers with JWT tokens
* TLS (Transport Layer Security) for HTTPS

Both of these options are discussed in the following sections.

## OAuth 2.0 providers with JWT tokens

[OAuth 2.0](https://tools.ietf.org/html/rfc6749) providers and [JWT (JSON Web Token)](https://tools.ietf.org/html/rfc7519) tokens are used in Chronograf to provide the authorization and authentication of Chronograph users and role-based access control.

To configure any of the supported OAuth 2.0 providers to work with Chronograf, you must also configure the `TOKEN_SECRET` environment variable (or command line option), which is used to generate valid JWT signatures for access tokens.

**To set the TOKEN_SECRET option:**

1) Provide a secure arbitrary string that Chronograf will use to generate the JWT Signature used with access tokens.
2) Set the TOKEN_SECRET environment variable to the secret string.

**Example:**

```sh
export TOKEN_SECRET=Super5uperUdn3verGu355!
```

> ***InfluxEnterprise clusters:*** If you are running multiple Chronograf servers in a high availability configuration, set the `TOKEN_SECRET` environment variable on each server to ensure that users can stay logged in.

## OAuth 2.0 providers

OAuth authorization and authentication in Chronograf require you to specify configuration options for OAuth 2.0 authentication providers you want to use.

Configuration steps, including required and optional configuration options, for the following supported authentication providers are provided in these sections below:

* [GitHub](#github)
* [Google](#google)
* [Auth0](#auth0)
* [Generic](#generic)

> ***Note:*** Each of the following OAuth 2.0 provider configurations require the `TOKEN_SECRET` you created in the previous section.

### GitHub

Chronograf supports using the [GitHub OAuth 2.0 authentication](https://developer.github.com/apps/building-oauth-apps/) to request authorization and provide authentication. To use GitHub authentication, you need to register a GitHub application and use the assigned Client ID and Client Secret.


#### Overview

Chronograf has five environment variables (and corresponding command line options) for use with GitHub OAuth 2.0 authentication. The steps below show you how to set the required values for:

* TOKEN_SECRET (secret to use for generating JWT tokens)
* GH_CLIENT_ID (GitHub Client ID)
* GH_CLIENT_SECRET (GitHub Client Secret)

Optionally, you can specify values for these two environment variables (or corresponding command line options):

* AUTH_DURATION (authorization duration)
* GH_ORGS (GitHub organizations)

For details on the command line options and environment variables, see [GitHub OAuth 2.0 authentication options](/chronograf/latest/administration/config-options#github-oauth-2-0-authentication-options).

**Example:**
```
# Require users to reauthenticate after 1 hour
export AUTH_DURATION=1h

# Secret used to generate JWT tokens
export TOKEN_SECRET=Super5uperUdn3verGu355!

# GitHub Client ID
export GH_CLIENT_ID=b339dd4fddd95abec9aa

# GitHub Client Secret
export GH_CLIENT_SECRET=260041897d3252c146ece6b46ba39bc1e54416dc

# Restrict to specific GitHub organizations
export GH_ORGS=biffs-gang
```

#### Creating GitHub OAuth 2.0 applications

The following steps will guide you in configuring Chronograf to support GitHub OAuth 2.0 authorization and authentication.

**To create a GitHub OAuth 2.0 application:**

1) Follow the [Register your app](https://github.com/settings/applications/new) steps at the GitHub Developer website to register your GitHub application and obtain your assigned Client ID and Client Secret.

    - `Homepage URL`: should include the full Chronograf server name and port. For example, if you are running it locally with the default settings, it would be `http://localhost:8888`.
    - `Authorization callback URL`: The `Homepage URL` plus the callback URL path `/oauth/github/callback`. Example: `http://localhost:8888/oauth/github/callback`
2) Set the Chronograf environment variables (or corresponding command line options) for the GitHub OAuth 2.0 credentials:

* `GH_CLIENT_ID` (GitHub Client ID)
* `GH_CLIENT_SECRET` (GitHub Client Secret)

**Example:**

```sh
export GH_CLIENT_ID=b339dd4fddd95abec9aa
export GH_CLIENT_SECRET=260041897d3252c146ece6b46ba39bc1e54416dc
```
3) Set the Chronograf environment variable (or corresponding command line option) required for JWT support:

* `TOKEN_SECRET` (Secret used to generate JWT tokens)

**Example:**
```sh
export TOKEN_SECRET=Super5uperUdn3verGu355!
```

Alternatively, these environment variables can be set using the equivalent command line options:

* [`--github-client-id=`](/chronograf/latest/administration/configuration/#github-client-id)
* [`--github-client-secret=`](/chronograf/latest/administration/configuration/#ithub-client-secret)
* [`--token_secret=`](chronograf/latest/administration/config-options.md#--token-secret---t)

#### Optional GitHub organizations

If you want to require a GitHub organization membership for a user, set the `GH_ORGS` environment variable.

**Example:**

```sh
export GH_ORGS=biffs-gang
```
If the user is not a member of the specified GitHub organization, then the user will not be granted access.
To support multiple organizations, use a comma-delimited list.

**Example:**

```sh
export GH_ORGS=hill-valley-preservation-sociey,the-pinheads
```

### Google

Chronograf supports using the [Google OAuth 2.0 authentication proivder](https://developers.google.com/identity/protocols/OAuth2) to request authorization and provide authentication. To use GitHub authentication, you need to register a GitHub application and use the assigned Client ID and Client Secret.

#### Overview

Chronograf supports the use of the [Google OAuth 2.0 protocol](https://developers.google.com/identity/protocols/OAuth2) for authentication and authorization. The steps below guide you in creating the following required Chronograf environment variables (or corresponding command line options):

* `GOOGLE_CLIENT_ID` (Google Client ID)
* `GOOGLE_CLIENT_SECRET` (Google Client Secret)
* `PUBLIC_URL` (Public URL)

Optionally, you can restrict access to specific domains using the following environment variable (or corresponding command line option):

* `GOOGLE_DOMAINS` (Google domains)

For details on Chronograf command line options and environment variables, see [Google OAuth 2.0 authentication options](/chronograf/latest/config-options#google-oauth-2-0-authentication-options).


#### Creating Google OAuth 2.0 applications

The following steps will guide you in configuring Google OAuth 2.0 authorization and authentication support in Chronograf.

**To create a Google OAuth 2.0 application:**

1) Obtain the required Google OAuth 2.0 credentials, including a Google client ID and client Secret, by following the steps in [Obtain Oauth 2.0 credentials](https://developers.google.com/identity/protocols/OpenIDConnect#getcredentials).
2) Verify that Chronograf is publicly accessible using a fully-qualified domain name so that Google can properly redirect users back to the application.
3) Set the Chronograf environment variables (or corresponding command line options) for the Google OAuth 2.0 credentials and public URL:

* `GOOGLE_CLIENT_ID` (Google client ID)
* `GOOGLE_CLIENT_SECRET` (Google client Secret)
* `PUBLIC_URL` (Public URL)

**Example:**
```sh
export GOOGLE_CLIENT_ID= 812760930421-kj6rnscmlbv49pmkgr1jq5autblc49kr.apps.googleusercontent.com
export GOOGLE_CLIENT_SECRET= wwo0m29iLirM6LzHJWE84GRD
export PUBLIC_URL=http://localhost:8888/google/callback
```

4) Set the Chronograf environment variable (or corresponding command line option) required for JWT support:

* `TOKEN_SECRET` (Secret used to generate JWT tokens)

**Example:**
```sh
export TOKEN_SECRET=Super5uperUdn3verGu355!
```

Alternatively, the environment variables discussed above can be set using their corresponding command line options:

* [`--google-client-id=`](/chronograf/latest/administration/configuration/#google-client-id)
* [`--google-client-secret=`](/chronograf/latest/administration/configuration/#google-client-secret)
* [`--public-url=`](/chronograf/latest/administration/configuration/#public-url)
* [`--token_secret=`](chronograf/latest/administration/config-options.md#--token-secret---t)

#### Optional Google domains

Similar to GitHub organization restrictions, Google authentication can be configured to restrict access to Chronograf to specific domains.
These are configured using the `GOOGLE_DOMAINS` environment variable or the [`--google-domains`](/chronograf/latest/administration/configuration/#google-domains) command line options.
Multiple domains are separated using commas.
For example, to permit access only from `biffspleasurepalace.com` and `savetheclocktower.com`, the `GOOGLE_DOMAINS` environment variable is:
```sh
export GOOGLE_DOMAINS=biffspleasurepalance.com,savetheclocktower.com
```

### Auth0

[Auth0](https://auth0.com/) implements identity protocol support for OAuth 2.0. See [OAuth 2.0](https://auth0.com/docs/protocols/oauth2) for details about Auth0's implementation.

#### Creating an Auth0 application

The following steps will guide you in configuring Auth0 OAuth 2.0 authorization and authentication support in Chronograf.

**To create an Auth0 OAuth 2.0 application:**

1) Create an Auth0 account and [register an Auth0 client](https://auth0.com/docs/clients) within their dashboard.

    - Auth0 clients should be configured as `Regular Web Applications` with the `Token Endpoint Authentication` set to `None`.
    - Clients must have the `Allowed Callback URLs` set to `https://www.example.com/oauth/auth0/callback` and the `Allowed Logout URLs` to `https://www.example.com`, substituting `example.com` for the [`PUBLIC_URL`](/chronograf/latest/administration/configuration/#public-url) of your Chronograf instance.
    - Clients must be set to be ["OIDC Conformant"](https://auth0.com/docs/api-auth/intro#how-to-use-the-new-flows).
2) Set the Chronograf environment variables (or corresponding command line options) based on your Auth0 client credentials:

* `AUTH0_DOMAIN` (Auth0 domain)
* `AUTH0_CLIENT_ID` (Auth0 client ID)
* `AUTH0_CLIENT_SECRET` (Auth0 client Secret)

The equivalent command line options are:

* [`--auth0-domain`](/chronograf/latest/administration/configuration/#auth0-domain)
* [`--auth0-client-id`](/chronograf/latest/administration/configuration/#auth0-client-id)
* [`--auth0-client-secret`](/chronograf/latest/administration/configuration/#auth0-client-secret)

3) Set the Chronograf environment variable (or corresponding command line option) required for JWT support:

* `TOKEN_SECRET` (Secret used to generate JWT tokens)

**Example:**
```sh
export TOKEN_SECRET=Super5uperUdn3verGu355!
```

#### Optional Auth0 organizations

Auth0 can be customized to the operator's requirements, so it has no official concept of an "organization."
Organizations are supported in Chronograf using a lightweight `app_metadata` key that can be inserted into Auth0 user profiles automatically or manually.

To assign a user to an organization, add an `organization` key to the user `app_metadata` field with the value corresponding to the user's organization.
For example, you can assign the user Marty McFly to the "time-travelers" organization by setting `app_metadata` to `{"organization": "time-travelers"}`.
This can be done either manually by an operator or automatically through the use of an [Auth0 Rule](https://auth0.com/docs/rules/metadata-in-rules#updating-app_metadata) or a [pre-user registration Auth0 Hook](https://auth0.com/docs/hooks/extensibility-points/pre-user-registration).

Next, you will need to set the Chronograf [`AUTH0_ORGS`](/chronograf/latest/administration/configuration/#auth0-client-secret) environment variable to a comma-separated list of the allowed organizations.
    For example, if you have one group of users with an `organization` key set to `biffs-gang` and another group with an `organization` key set to `time-travelers`, you can permit access to both with this environment variable: `AUTH0_ORGS=biffs-gang,time-travelers`.

An `--auth0-organizations` command line option is also available, but it is limited to a single organization and does not accept a comma-separated list like its environment variable equivalent.

### Generic

#### Creating OAuth 2.0 applications using your own provider

The generic OAuth 2.0 provider is very similar to the GitHub provider, but
you are able to set your own authentication, token, and API URLs.
The callback URL path will be `/oauth/generic/callback`.
For example, if Chronograf is hosted at `https://localhost:8888` then the full callback URL would be  `https://localhost:8888/oauth/generic/callback`.

The generic OAuth 2.0 provider requires the following five environment variables (or the corresponding command line options):

* `GENERIC_CLIENT_ID`: this application's client [identifier](https://tools.ietf.org/html/rfc6749#section-2.2) issued by the provider
* `GENERIC_CLIENT_SECRET`: this application's [secret](https://tools.ietf.org/html/rfc6749#section-2.3.1) issued by the provider
* `GENERIC_AUTH_URL`: OAuth 2.0 provider's authorization [endpoint](https://tools.ietf.org/html/rfc6749#section-3.1) URL
* `GENERIC_TOKEN_URL`: OAuth 2.0 provider's token endpoint [endpoint](https://tools.ietf.org/html/rfc6749#section-3.2) is used by the client to obtain an access token
* `TOKEN_SECRET`: Used to validate OAuth [state](https://tools.ietf.org/html/rfc6749#section-4.1.1) response. (see above)

#### Optional scopes

By default Chronograf will ask for the `user:email` [scope](https://tools.ietf.org/html/rfc6749#section-3.3) of the client.
If your provider scopes email access under a different scope or scopes provide them as comma-separated values in the `GENERIC_SCOPES` environment variable.
```sh
export GENERIC_SCOPES="openid,email" # Requests access to openid and email scopes
```

#### Optional email domains

The generic OAuth 2.0 provider has the following two optional environment variables (and corresponding command line options):

* `GENERIC_API_URL`: URL that returns [OpenID UserInfo JWT](https://connect2id.com/products/server/docs/api/userinfo) (specifically email address)
* `GENERIC_DOMAINS`: Email domain where email address must include.

#### Customizing the login button text and callback URL

Setting the `GENERIC_NAME` environment variable results in the specified value appearing in both the callback URL and the login button text. This allows you to customize the login by replacing "generic" in both locations with a more meaningful name.

> ***Note:*** Use a short, URL-friendly name. The GENERIC_NAME value is also included in the callback URL.

**Example:**

```sh
export GENERIC_NAME="GitLab"
```
The callback URL changes from:
```
https://localhost:8888/oauth/generic/callback
```
to:
````https://localhost:8888/oauth/GitLab/callback`

Also, on the Chronograf login page, the text on the authentication button changes from `Log in with generic` to `Log in with GitLab`.

### Configuring authentication duration

By default, user authentication remains valid for 30 days using a cookie stored in the web browser. To configure a different authorization duration, set a duration using the `AUTH_DURATION` environment variable.

**Example:**

To set the authentication duration to 1 hour, use the following shell command:
```sh
export AUTH_DURATION=1h
```
The duration uses the Go (golang) [time duration format](https://golang.org/pkg/time/#ParseDuration), so the largest time unit is `h` (hours). So to change it to 45 days, use:
```sh
export AUTH_DURATION=1080h
```
Additionally, for greater security, if you want to require re-authentication every time the browser is closed, set `AUTH_DURATION` to `0`. This makes the cookie transient (aka "in-memory").

## TLS (Transport Layer Security) and HTTPS

The TLS (Transport Layer Security) cryptographic protocol is supported in Chronograf to provides server authentication, data confidentiality, and data integrity. Using TLS secures traffic between a server and web browser and enables the use of HTTPS.

InfluxData recommends using HTTPS to communicate securely with Chronograf applications.
If you are not using a TLS termination proxy, you can run your Chronograf server with TLS connections.

Chronograf includes command line and environment variable options for configuring TLS (Transport Layer Security) certificates and key files. Use of the TLS cryptographic protocol provides server authentication, data confidentiality, and data integrity. When configured, users can use HTTPS to securely communicate with your Chronograf applications.

### Configuring TLS for Chronograf

Chronograf server has command line and environment variable options to specify the certificate and key files.
The server reads and parses a public/private key pair from these files.
The files must contain PEM-encoded data.

All Chronograf command line options have corresponding environment
variables.

**To configure Chronograf to support TLS:**

1) Specify the certificate file using the `TLS_CERTIFICATE` environment variable (or the `--cert` CLI option).
2) Specify the key file using the `TLS_PRIVATE_KEY` environment variable (or `--key` CLI option).

> ***Note:*** If both the TLS certificate and key are in the same file, specify them using the `TLS_CERTIFICATE` environment variable (or the `--cert` CLI option).

#### Example with CLI options
```sh
chronograf --cert=my.crt --key=my.key
```

#### Example with environment variables
```sh
TLS_CERTIFICATE=my.crt TLS_PRIVATE_KEY=my.key chronograf
```

#### Docker example with environment variables
```sh
docker run -v /host/path/to/certs:/certs -e TLS_CERTIFICATE=/certs/my.crt -e TLS_PRIVATE_KEY=/certs/my.key quay.io/influxdb/chronograf:latest
```

### Testing with self-signed certificates
In a production environment you should not use self-signed certificates, but for testing it is fast to create your own certificates.

To create a certificate and key in one file with OpenSSL:

```sh
openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout testing.pem -out testing.pem -subj "/CN=localhost" -days 365
```

Next, set the environment variable `TLS_CERTIFICATE`:
```sh
export TLS_CERTIFICATE=$PWD/testing.pem
```

Run Chronograf:

```sh
./chronograf
INFO[0000] Serving chronograf at https://[::]:8888       component=server
```

In the first log message you should see `https` rather than `http`.
