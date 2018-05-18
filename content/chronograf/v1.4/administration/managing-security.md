---
title: Managing Chronograf security
description: Managing Chronograf security using authentication and authorization with OAuth 2.0 providers (GitHub, Google, Heroku, Okta, and generic). Also covers TLS and HTTPS setup.
aliases: /chronograf/v1.4/administration/security-best-practices/
menu:
  chronograf_1_4:
    name: Managing Chronograf security
    weight: 70
    parent: Administration
---

**On this page**

* [Chronograf security](#chronograf-security)
* [OAuth 2.0 providers with JWT tokens](#oauth-2-0-providers-with-jwt-tokens)
* [OAuth 2.0 providers](#oauth-2-0-providers)
  * [Configuring GitHub authentication](#configuring-github-authentication)
  * [Configuring Google authentication](#configuring-google-authentication)
  * [Configuring Auth0 authentication](#configuring-auth0-authentication)
  * [Configuring Heroku authentication](#configuring-heroku-authentication)
  * [Configuring Okta authentication](#configuring-okta-authentication)
  * [Configuring Generic authentication](#configuring-generic-authentication)
* [Configuring authentication duration](#configuring-authentication-duration)
* [Configuring TLS (Transport Layer Security) and HTTPS](#configuring-tls-transport-layer-security-and-https)
  - [Testing with self-signed certificates](#testing-with-self-signed-certificates)

## Chronograf security

Role-based access control in Chronograf and enhanced security are provided using two configurable options:

* OAuth 2.0 providers with JWT tokens
* TLS (Transport Layer Security) for HTTPS

Both of these options are discussed in the following sections.

> ***Note:*** All measures of Chronograf security are enforced by the server. Any direct requests to the Chronograf server will be subjected to, and thus must comply with, any configured security options.

## OAuth 2.0 providers with JWT tokens

[OAuth 2.0](https://tools.ietf.org/html/rfc6749) providers and [JWT (JSON Web Token)](https://tools.ietf.org/html/rfc7519) tokens are used in Chronograf to provide the authorization and authentication of Chronograf users and role-based access control.

To configure any of the supported OAuth 2.0 providers to work with Chronograf, you must also configure the `TOKEN_SECRET` environment variable (or command line option), which is used for generating and validating JWT tokens.

**To set the TOKEN_SECRET option:**

Set the value of the TOKEN_SECRET environment variable to a secure, arbitrary string. Chronograf will use this secret to generate the JWT Signature for all access tokens.

**Example:** `TOKEN_SECRET=Super5uperUdn3verGu355!`

**JWKS Signature Verification**
If the provider implements OpenID Connect with RS256 signatures (as Microsoft AD FS does), you need to enable `id_token` support and provide a JWKS document (holding the certificate chain), to validate the RSA signatures against. This certificate chain is regularly rolled over (when the certificates expire), so it is fetched from the JWKS_URL on demand.

**Example:**

```sh
export USE_ID_TOKEN=true
export JWKS_URL=https://example.com/adfs/discovery/keys
```

> ***InfluxEnterprise clusters:*** If you are running multiple Chronograf servers in a high availability configuration, set the `TOKEN_SECRET` environment variable on each server to ensure that users can stay logged in.

## OAuth 2.0 providers

OAuth 2.0 authorization and authentication in Chronograf require you to specify configuration options for OAuth 2.0 authentication providers you want to use.

Configuration steps, including required and optional configuration options, for the following supported authentication providers are provided in these sections below:

* [GitHub](#configuring-github-authentication)
* [Google](#configuring-google-authentication)
* [Auth0](#configuring-auth0-authentication)
* [Heroku](#configuring-heroku-authentication)
* [Okta](#configuring-okta-authentication)
* [Generic](#configuring-generic-authentication)

> ***Note:*** Each of the following OAuth 2.0 provider configurations require the `TOKEN_SECRET` you created in the previous section.

### Configuring GitHub authentication

Chronograf supports using the [GitHub OAuth 2.0 authentication](https://developer.github.com/apps/building-oauth-apps/) to request authorization and provide authentication. To use GitHub authentication, you need to register a GitHub application and use the assigned Client ID and Client Secret.


#### Overview

Chronograf has five environment variables (and corresponding command line options) for use with GitHub OAuth 2.0 authentication. The steps below show you how to set the required values for:

* `TOKEN_SECRET` (secret used for generating and validating JWT tokens)
* `GH_CLIENT_ID` (GitHub Client ID)
* `GH_CLIENT_SECRET` (GitHub Client Secret)

Optionally, you can specify values for these two environment variables (or corresponding command line options):

* `AUTH_DURATION` (authorization duration)
* `GH_ORGS` (GitHub organizations)

For details on the command line options and environment variables, see [GitHub OAuth 2.0 authentication options](/chronograf/v1.4/administration/config-options#github-oauth-2-0-authentication-options).

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

1. Follow the [Register your app](https://github.com/settings/applications/new) steps at the GitHub Developer website to register your GitHub application and obtain your assigned Client ID and Client Secret.

    * `Homepage URL`: should include the full Chronograf server name and port. For example, if you are running it locally with the default settings, it would be `http://localhost:8888`.
    * `Authorization callback URL`: The `Homepage URL` plus the callback URL path `/oauth/github/callback`. Example: `http://localhost:8888/oauth/github/callback`

2. Set the Chronograf environment variables (or corresponding command line options) for the GitHub OAuth 2.0 credentials:

    * `GH_CLIENT_ID` (GitHub Client ID)
    * `GH_CLIENT_SECRET` (GitHub Client Secret)

    **Example:**

    ```sh
    export GH_CLIENT_ID=b339dd4fddd95abec9aa
    export GH_CLIENT_SECRET=260041897d3252c146ece6b46ba39bc1e54416dc
    ```

3. Set the Chronograf environment variable (or corresponding command line option) required for JWT support:

    * `TOKEN_SECRET` (Secret used for generating and validating JWT tokens)

    **Example:**
    ```sh
    export TOKEN_SECRET=Super5uperUdn3verGu355!
    ```

    Alternatively, these environment variables can be set using the equivalent command line options:

    * [`--github-client-id=`](/chronograf/v1.4/administration/configuration/#github-client-id)
    * [`--github-client-secret=`](/chronograf/v1.4/administration/configuration/#github-client-secret)
    * [`--token_secret=`](/chronograf/v1.4/administration/config-options.md#--token-secret---t)

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

### Configuring Google authentication

Chronograf supports using the [Google OAuth 2.0 authentication proivder](https://developers.google.com/identity/protocols/OAuth2) to request authorization and provide authentication. To use Google authentication, you need to register a Google application and use the assigned Client ID and Client Secret, as well as specify a Public URL.

#### Overview

Chronograf supports the use of the [Google OAuth 2.0 protocol](https://developers.google.com/identity/protocols/OAuth2) for authentication and authorization. The steps below guide you in creating the following required Chronograf environment variables (or corresponding command line options):

* `GOOGLE_CLIENT_ID` (Google Client ID)
* `GOOGLE_CLIENT_SECRET` (Google Client Secret)
* `PUBLIC_URL` (Public URL)

Optionally, you can restrict access to specific domains using the following environment variable (or corresponding command line option):

* `GOOGLE_DOMAINS` (Google domains)

For details on Chronograf command line options and environment variables, see [Google OAuth 2.0 authentication options](/chronograf/v1.4/config-options#google-oauth-2-0-authentication-options).


#### Creating Google OAuth 2.0 applications

The following steps will guide you in configuring Google OAuth 2.0 authorization and authentication support in Chronograf.

**To create a Google OAuth 2.0 application:**

1. Obtain the required Google OAuth 2.0 credentials, including a Google Client ID and Client Secret, by following the steps in [Obtain Oauth 2.0 credentials](https://developers.google.com/identity/protocols/OpenIDConnect#getcredentials).
2. Verify that Chronograf is publicly accessible using a fully-qualified domain name so that Google can properly redirect users back to the application.
3. Set the Chronograf environment variables (or corresponding command line options) for the Google OAuth 2.0 credentials and Public URL:

    * `GOOGLE_CLIENT_ID` (Google client ID)
    * `GOOGLE_CLIENT_SECRET` (Google client Secret)
    * `PUBLIC_URL` (Public URL -- the URL used to access Chronograf)

    **Example:**  
    ```sh
    export GOOGLE_CLIENT_ID= 812760930421-kj6rnscmlbv49pmkgr1jq5autblc49kr.apps.googleusercontent.com
    export GOOGLE_CLIENT_SECRET= wwo0m29iLirM6LzHJWE84GRD
    export PUBLIC_URL=http://localhost:8888
```

4. Set the Chronograf environment variable (or corresponding command line option) required for JWT support:

    * `TOKEN_SECRET` (Secret used for generating and validating JWT tokens)

    **Example:**  
    ```sh
    export TOKEN_SECRET=Super5uperUdn3verGu355!
    ```

    Alternatively, the environment variables discussed above can be set using their corresponding command line options:

    * [`--google-client-id=`](/chronograf/v1.4/administration/configuration/#google-client-id)
    * [`--google-client-secret=`](/chronograf/v1.4/administration/configuration/#google-client-secret)
    * [`--public-url=`](/chronograf/v1.4/administration/configuration/#public-url)
    * [`--token_secret=`](chronograf/v1.4/administration/config-options.md#--token-secret---t)

#### Optional Google domains

Similar to GitHub organization restrictions, Google authentication can be configured to restrict access to Chronograf to specific domains.
These are configured using the `GOOGLE_DOMAINS` environment variable or the [`--google-domains`](/chronograf/v1.4/administration/configuration/#google-domains) command line options.
Multiple domains are separated using commas.
For example, to permit access only from `biffspleasurepalace.com` and `savetheclocktower.com`, the `GOOGLE_DOMAINS` environment variable is:
```sh
export GOOGLE_DOMAINS=biffspleasurepalance.com,savetheclocktower.com
```

### Configuring Auth0 authentication

[Auth0](https://auth0.com/) implements identity protocol support for OAuth 2.0. See [OAuth 2.0](https://auth0.com/docs/protocols/oauth2) for details about the Auth0 implementation.

#### Creating an Auth0 application

The following steps will guide you in configuring Auth0 OAuth 2.0 authorization and authentication support in Chronograf.

**To create an Auth0 OAuth 2.0 application:**

1. Create an Auth0 account and [register an Auth0 client](https://auth0.com/docs/clients) within their dashboard. Auth0 clients should be configured with the following settings:
    * **Regular Web Applications** as the type of application.
    * **Token Endpoint Authentication** set to **None**.
    * **Allowed Callback URLs**: `https://www.example.com/oauth/auth0/callback` (substituting `example.com` with the [`PUBLIC_URL`](/chronograf/v1.4/administration/config-options/#general-authentication-options) of your Chronograf instance)
    * **Allowed Logout URLs**: `https://www.example.com` (substituting `example.com` with the [`PUBLIC_URL`](/chronograf/v1.4/administration/config-option/#general-authentication-options) of your Chronograf instance)
    * ["OIDC Conformant"](https://auth0.com/docs/api-auth/intro#how-to-use-the-new-flows).

2. Set the Chronograf environment variables (or corresponding command line options) based on your Auth0 client credentials:

    * `AUTH0_DOMAIN` (Auth0 domain)
    * `AUTH0_CLIENT_ID` (Auth0 client ID)
    * `AUTH0_CLIENT_SECRET` (Auth0 client Secret)
    * `PUBLIC_URL` (Public URL, used in callback URL and logout URL above)

    The equivalent command line options are:

    * [`--auth0-domain`](/chronograf/v1.4/administration/config-options/#auth0-specific-oauth-2-0-authentication-options)
    * [`--auth0-client-id`](/chronograf/v1.4/administration/config-options/#auth0-specific-oauth-2-0-authentication-options)
    * [`--auth0-client-secret`](/chronograf/v1.4/administration/config-options/#auth0-specific-oauth-2-0-authentication-options)
    * [`--public-url`](/chronograf/v1.4/administration/config-options/#general-authentication-options)

3. Set the Chronograf environment variable (or corresponding command line option) required for JWT support:

    * [`TOKEN_SECRET`](/chronograf/v1.4/administration/config-options/#general-authentication-options) (Secret used for generating and validating JWT tokens)

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

Next, you will need to set the Chronograf [`AUTH0_ORGS`](/chronograf/v1.4/administration/configuration/#auth0-client-secret) environment variable to a comma-separated list of the allowed organizations.
For example, if you have one group of users with an `organization` key set to `biffs-gang` and another group with an `organization` key set to `time-travelers`, you can permit access to both with this environment variable: `AUTH0_ORGS=biffs-gang,time-travelers`.

An `--auth0-organizations` command line option is also available, but it is limited to a single organization and does not accept a comma-separated list like its environment variable equivalent.

### Configuring Heroku authentication

To enable Chronograf support using the Heroku OAuth 2.0 provider:

#### Creating Heroku Applications

To obtain a client ID and application secret for Heroku, follow the guide posted [here](https://devcenter.heroku.com/articles/oauth#register-client).
Once your application has been created, those two values should be inserted into the following environment variables (or associated command line option):

* `HEROKU_CLIENT_ID`
* `HEROKU_SECRET`

#### Optional Heroku organizations

To restrict access to members of specific Heroku organizations, use
the `HEROKU_ORGS` environment variable (or associated command line option). Multiple values must be comma-separated.

**Example**

To permit access from the `hill-valley-preservation-society` organization and `the-pinheads` organization, we would use the following environment variable:

```sh
export HEROKU_ORGS=hill-valley-preservation-sociey,the-pinheads
```
### Configuring Okta authentication

[Okta](https://developer.okta.com/) is a popular, OAuth 2.0 compliant authorization and authentication provider that can be used with Chronograf to allow access based on granted scopes and permissions.

**To enable Chronograf support using an Okta OAuth 2.0 application:**

1. Create a new Okta web app following the steps in the following Okta documentation: [Implement the Authorization Code Flow](https://developer.okta.com/authentication-guide/implementing-authentication/auth-code).

  * In the **General Settings** section, find the **Allowed grant types** listing and select
  only the **Client acting on behalf of a user:** **Authorization Code** option.
  * In the **LOGIN** section, set the **Login redirect URIs* and **Initiate login URI** to `http://localhost:8888/oauth/okta/callback`
    - This is the callback URL for Chronograf.

2. Set the following Chronograf environment variables (or associated command line options):

  * `GENERIC_NAME=okta`
  * `GENERIC_CLIENT_ID=<okta_client_ID>``
    - The **Client ID** value is in the **Client Credentials** section.
  * `GENERIC_CLIENT_SECRET=<okta_client_secret>``
    - The **Client secret** value is in the **Client Credentials** section.
  * `GENERIC_AUTH_URL=https://dev-553212.oktapreview.com/oauth2/default/v1/authorize`
  * `GENERIC_TOKEN_URL=https://dev-553212.oktapreview.com/oauth2/default/v1/token`
  * `GENERIC_API_URL=https://dev-553212.oktapreview.com/oauth2/default/v1/userinfo`
  * `PUBLIC_URL=http://localhost:8888`
  * `TOKEN_SECRET=secretsecretsecret`
  * `GENERIC_SCOPES=openid,profile,email`

3. Restart the Chronograf service.

Your users should now be able to sign into Chronograf using the new Okta provider.

### Configuring Generic authentication

#### Configuring Chronograf to use any OAuth 2.0 provider

Chronograf can be configured to work with any OAuth 2.0 provider, including those defined above, by using the Generic configuration options below.
Additionally, the generic provider implements OpenID Connect (OIDC) as implemented by Active Directory Federation Services (AD FS).

Depending on your OAuth 2.0 provider, many or all of the following environment variables (or corresponding command line options) are required by Chronograf when using the Generic configuration:

* `GENERIC_CLIENT_ID`: Application [client identifier](https://tools.ietf.org/html/rfc6749#section-2.2) issued by the provider
* `GENERIC_CLIENT_SECRET`: Application [client secret](https://tools.ietf.org/html/rfc6749#section-2.3.1) issued by the provider
* `GENERIC_AUTH_URL`: Provider's [authorization endpoint](https://tools.ietf.org/html/rfc6749#section-3.1) URL
* `GENERIC_TOKEN_URL`: Provider's [token endpoint](https://tools.ietf.org/html/rfc6749#section-3.2) URL used by the Chronograf client to obtain an access token
* `USE_ID_TOKEN`: Enable OpenID Connect [id_token](https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.3.3) processing
* `JWKS_URL`: OAuth 2.0 provider's [JWKS endpoint](https://tools.ietf.org/html/rfc7517#section-4.7) is used by the client to validate RSA signatures
* `GENERIC_API_URL`: Provider's OpenID Connect [UserInfo endpoint](https://connect2id.com/products/server/docs/api/userinfo)] URL used by Chronograf to request user data
* `GENERIC_API_KEY`: JSON claim (used to lookup a unique identifier in the identity provider) for OpenID Connect [UserInfo endpoint](https://connect2id.com/products/server/docs/api/userinfo)] (known to be required for Microsoft Azure, with the value `userPrincipalName`)
* `GENERIC_SCOPES`: [Scopes](https://tools.ietf.org/html/rfc6749#section-3.3) of user data required for your instance of Chronograf, such as user email and OAuth 2.0 provider organization
  - Multiple values must be space-delimited, e.g. `user:email read:org`
  - These may vary by OAuth 2.0 provider
  - Default value: `user:email`
* `PUBLIC_URL`: Full public URL used to access Chronograf from a web browser, i.e., where Chronograf is hosted
  - Used by Chronograf, for example, to construct the callback URL
* `TOKEN_SECRET`: Used to validate OAuth [state](https://tools.ietf.org/html/rfc6749#section-4.1.1) response. (see above)

#### Optional environment variables

The following environment variables (and corresponding command line options) are also available for optional use:

* `GENERIC_DOMAINS`: Email domains required in email addresses.
* `GENERIC_NAME`: Value used in the callback URL in conjunction with `PUBLIC_URL`, e.g. `<PUBLIC_URL>/oauth/<GENERIC_NAME>/callback`.
  - This value is also used in the text for the Chronograf Login button.
  - Default value is `generic`.
  - So, for example, if `PUBLIC_URL` is `https://localhost:8888` and `GENERIC_NAME` is its default value, then the callback URL would be `https://localhost:8888/oauth/generic/callback`, and the Chronograf Login button would read `Log in with Generic`
  - While using Chronograf, this value should be supplied in the `Provider` field when adding a user or creating an organization mapping.


#### Examples
##### OpenID Connect (OIDC) / Active Directory Federation Services (AD FS)

See [Enabling OpenID Connect with AD FS 2016](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/development/enabling-openid-connect-with-ad-fs) for a walk through of the server configuration.

Exports for Chronograf (e.g. in /etc/default.chronograf):
```sh
PUBLIC_URL="https://example.com:8888"
GENERIC_CLIENT_ID="chronograf"
GENERIC_CLIENT_SECRET="KW-TkvH7vzYeJMAKj-3T1PdHx5bxrZnoNck2KlX8"
GENERIC_AUTH_URL="https://example.com/adfs/oauth2/authorize"
GENERIC_TOKEN_URL="https://example.com/adfs/oauth2/token"
GENERIC_SCOPES="openid"
GENERIC_API_KEY="upn"
USE_ID_TOKEN="true"
JWKS_URL="https://example.com/adfs/discovery/keys"
TOKEN_SECRET="ZNh2N9toMwUVQxTVEe2ZnnMtgkh3xqKZ"

> ***Note:*** Do not use special characters for the GENERIC_CLIENT_ID as AD FS will split strings here, finally resulting in an identifier mismatch.

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

## Configuring TLS (Transport Layer Security) and HTTPS

The TLS (Transport Layer Security) cryptographic protocol is supported in Chronograf to provides server authentication, data confidentiality, and data integrity. Using TLS secures traffic between a server and web browser and enables the use of HTTPS.

InfluxData recommends using HTTPS to communicate securely with Chronograf applications.
If you are not using a TLS termination proxy, you can run your Chronograf server with TLS connections.

Chronograf includes command line and environment variable options for configuring TLS (Transport Layer Security) certificates and key files. Use of the TLS cryptographic protocol provides server authentication, data confidentiality, and data integrity. When configured, users can use HTTPS to securely communicate with your Chronograf applications.

> ***Note:*** Using HTTPS helps guard against nefarious agents sniffing the JWTand using it to spoof a valid user against the Chronograf server.

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
