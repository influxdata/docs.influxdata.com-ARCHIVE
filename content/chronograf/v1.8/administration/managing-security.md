---
title: Managing Chronograf security
description: Managing Chronograf security using authentication and authorization with OAuth 2.0 providers (GitHub, Google, Heroku, Okta, and generic). Also covers TLS and HTTPS setup.
aliases: /chronograf/v1.7/administration/security-best-practices/
menu:
  chronograf_1_7:
    name: Managing Chronograf security
    weight: 70
    parent: Administration
---

To enhance security, configure Chronograf to authenticate and authorize with [OAuth 2.0](https://oauth.net/) and use TLS/HTTPS.

* [Configure OAuth 2.0](#configure-oauth-2-0)
  1. [Generate a Token Secret](#generate-a-token-secret)
  2. [Set configurations for your OAuth provider](#set-configurations-for-your-oauth-provider)
  3. [Configure authentication duration](#configure-authentication-duration)
* [Configure TLS (Transport Layer Security) and HTTPS](#configure-tls-transport-layer-security-and-https)

## Configure OAuth 2.0

> After configuring OAuth 2.0, the Chronograf Admin tab becomes visible.
> You can then set up [multiple organizations](https://docs.influxdata.com/chronograf/latest/administration/managing-organizations/)
> and [users](https://docs.influxdata.com/chronograf/latest/administration/managing-influxdb-users/).

Configure Chronograf to use an OAuth 2.0 provider and JWT (JSON Web Token) to authenticate users and enable role-based access controls.

(For more details on OAuth and JWT, see [RFC 6749](https://tools.ietf.org/html/rfc6749) and [RFC 7519](https://tools.ietf.org/html/rfc7519).)

### Generate a Token Secret

To configure any of the supported OAuth 2.0 providers to work with Chronograf,
you must configure the `TOKEN_SECRET` environment variable (or command line option).
Chronograf will use this secret to generate the JWT Signature for all access tokens.

1. Generate a secret, high-entropy pseudo-random string.

    > For example, to do this with OpenSSL, run this command:
    > ```
    > openssl rand -base64 256 | tr -d '\n'
    > ```

2. Set the environment variable:

    ```
    TOKEN_SECRET=<mysecret>
    ```

> ***InfluxEnterprise clusters:*** If you are running multiple Chronograf servers in a high availability configuration,
> set the `TOKEN_SECRET` environment variable on each server to ensure that users can stay logged in.

### JWKS Signature Verification (optional)

If the OAuth provider implements OpenID Connect with RS256 signatures, you need to enable this feature with the `USE_ID_TOKEN` variable
and provide a JSON Web Key Set (JWKS) document (holding the certificate chain) to validate the RSA signatures against.
This certificate chain is regularly rolled over (when the certificates expire), so it is fetched from the `JWKS_URL` on demand.

**Example:**

```sh
export USE_ID_TOKEN=true
export JWKS_URL=https://example.com/adfs/discovery/keys
```

### Set configurations for your OAuth provider

To enable OAuth 2.0 authorization and authentication in Chronograf,
you must set configuration options that are specific for the OAuth 2.0 authentication provider you want to use.

Configuration steps for the following supported authentication providers are provided in these sections below:

* [GitHub](#configure-github-authentication)
* [Google](#configure-google-authentication)
* [Auth0](#configure-auth0-authentication)
* [Heroku](#configure-heroku-authentication)
* [Okta](#configure-okta-authentication)
* [Gitlab](#configure-gitlab-authentication)
* [Azure Active Directory](#configure-azure-active-directory-authentication)
* [Configure Chronograf to use any OAuth 2.0 provider](#configure-chronograf-to-use-any-oauth-2-0-provider)

> If you haven't already, you must first [generate a token secret](#generate-a-token-secret) before proceeding.

---

#### Configure GitHub authentication

1. Follow the steps to [Register a new OAuth application](https://github.com/settings/applications/new)
   on GitHub to obtain your Client ID and Client Secret.
   On the GitHub application registration page, enter the following values:
   - **Homepage URL**: the full Chronograf server name and port.
   For example, to run the application locally with default settings, set the this URL to `http://localhost:8888`.
   - **Authorization callback URL**: the **Homepage URL** plus the callback URL path `/oauth/github/callback`
   (for example, `http://localhost:8888/oauth/github/callback`).

2. Set the Chronograf environment variables with the credentials provided by GitHub:

    ```sh
    export GH_CLIENT_ID=<client-id-from-github>
    export GH_CLIENT_SECRET=<client-secret-from-github>
    ```

3. If you haven't already, set the Chronograf environment with your token secret:

    ```sh
    export TOKEN_SECRET=Super5uperUdn3verGu355!
    ```

Alternatively, set environment variables using the equivalent command line options:

* [`--github-client-id=`](/chronograf/v1.7/administration/config-options/#github-client-id-i)
* [`--github-client-secret=`](/chronograf/v1.7/administration/config-options/#github-client-secret-s)
* [`--token_secret=`](/chronograf/v1.7/administration/config-options/#token-secret-t)

For details on the command line options and environment variables, see [GitHub OAuth 2.0 authentication options](/chronograf/v1.7/administration/config-options#github-specific-oauth-2-0-authentication-options).

##### GitHub organizations (optional)

To require GitHub organization membership for authenticating users, set the `GH_ORGS` environment variable with the name of your organization.

```sh
export GH_ORGS=biffs-gang
```

If the user is not a member of the specified GitHub organization, then the user will not be granted access.
To support multiple organizations, use a comma-delimited list.

```sh
export GH_ORGS=hill-valley-preservation-sociey,the-pinheads
```

> When logging in for the first time, make sure to grant access to the organization you configured.
> The OAuth application can only see membership in organizations it has been granted access to.

##### Example GitHub OAuth configuration

```bash
# GitHub Client ID
export GH_CLIENT_ID=b339dd4fddd95abec9aa

# GitHub Client Secret
export GH_CLIENT_SECRET=260041897d3252c146ece6b46ba39bc1e54416dc

# Secret used to generate JWT tokens
export TOKEN_SECRET=Super5uperUdn3verGu355!

# Restrict to specific GitHub organizations
export GH_ORGS=biffs-gang
```

#### Configure Google authentication

1. Follow the steps in [Obtain OAuth 2.0 credentials](https://developers.google.com/identity/protocols/OpenIDConnect#getcredentials)
   to obtain the required Google OAuth 2.0 credentials, including a Google Client ID and Client Secret, by
2. Verify that Chronograf is publicly accessible using a fully-qualified domain name so that Google can properly redirect users back to the application.
3. Set the Chronograf environment variables for the Google OAuth 2.0 credentials and **Public URL** used to access Chronograf:

    ```sh
    export GOOGLE_CLIENT_ID=812760930421-kj6rnscmlbv49pmkgr1jq5autblc49kr.apps.googleusercontent.com
    export GOOGLE_CLIENT_SECRET=wwo0m29iLirM6LzHJWE84GRD
    export PUBLIC_URL=http://localhost:8888
    ```

4. If you haven't already, set the Chronograf environment with your token secret:

    ```sh
    export TOKEN_SECRET=Super5uperUdn3verGu355!
    ```

Alternatively, the environment variables discussed above can be set using their corresponding command line options:

* [`--google-client-id=`](/chronograf/v1.7/administration/config-options/#google-client-id)
* [`--google-client-secret=`](/chronograf/v1.7/administration/config-options/#google-client-secret)
* [`--public-url=`](/chronograf/v1.7/administration/config-options/#public-url)
* [`--token_secret=`](/chronograf/v1.7/administration/config-options/#token-secret-t)

For details on Chronograf command line options and environment variables, see [Google OAuth 2.0 authentication options](/chronograf/v1.7/administration/config-options#google-specific-oauth-2-0-authentication-options).

##### Optional Google domains

Configure Google authentication to restrict access to Chronograf to specific domains.
Set the `GOOGLE_DOMAINS` environment variable or the [`--google-domains`](/chronograf/v1.7/administration/config-options/#google-domains) command line option.
Separate multiple domains using commas.
For example, to permit access only from `biffspleasurepalace.com` and `savetheclocktower.com`, set the environment variable as follows:

```sh
export GOOGLE_DOMAINS=biffspleasurepalance.com,savetheclocktower.com
```

#### Configure Auth0 authentication

See [OAuth 2.0](https://auth0.com/docs/protocols/oauth2) for details about the Auth0 implementation.

1. Set up your Auth0 account to obtain the necessary credentials.
   1. From the Auth0 user dashboard, click **Create Application**.
   2. Choose **Regular Web Applications** as the type of application and click **Create**.
   3. In the **Settings** tab, set **Token Endpoint Authentication** to **None**.
   4. Set **Allowed Callback URLs** to `https://www.example.com/oauth/auth0/callback` (substituting `example.com` with the [`PUBLIC_URL`](/chronograf/v1.7/administration/config-options/#general-authentication-options) of your Chronograf instance)
   5. Set **Allowed Logout URLs** to `https://www.example.com` (substituting `example.com` with the [`PUBLIC_URL`](/chronograf/v1.7/administration/config-options/#general-authentication-options) of your Chronograf instance)
   <!-- ["OIDC Conformant"](https://auth0.com/docs/api-auth/intro#how-to-use-the-new-flows). -->

2. Set the Chronograf environment variables based on your Auth0 client credentials:

    * `AUTH0_DOMAIN` (Auth0 domain)
    * `AUTH0_CLIENT_ID` (Auth0 Client ID)
    * `AUTH0_CLIENT_SECRET` (Auth0 client Secret)
    * `PUBLIC_URL` (Public URL, used in callback URL and logout URL above)

3. If you haven't already, set the Chronograf environment with your token secret:

    ```sh
    export TOKEN_SECRET=Super5uperUdn3verGu355!
    ```

Alternatively, the environment variables discussed above can be set using their corresponding command line options:

* [`--auth0-domain`](/chronograf/v1.7/administration/config-options/#auth0-specific-oauth-2-0-authentication-options)
* [`--auth0-client-id`](/chronograf/v1.7/administration/config-options/#auth0-specific-oauth-2-0-authentication-options)
* [`--auth0-client-secret`](/chronograf/v1.7/administration/config-options/#auth0-specific-oauth-2-0-authentication-options)
* [`--public-url`](/chronograf/v1.7/administration/config-options/#general-authentication-options)

##### Auth0 organizations (optional)

Auth0 can be customized to the operator's requirements, so it has no official concept of an "organization."
Organizations are supported in Chronograf using a lightweight `app_metadata` key that can be inserted into Auth0 user profiles automatically or manually.

To assign a user to an organization, add an `organization` key to the user `app_metadata` field with the value corresponding to the user's organization.
For example, you can assign the user Marty McFly to the "time-travelers" organization by setting `app_metadata` to `{"organization": "time-travelers"}`.
This can be done either manually by an operator or automatically through the use of an [Auth0 Rule](https://auth0.com/docs/rules) or a [pre-user registration Auth0 Hook](https://auth0.com/docs/hooks/concepts/pre-user-registration-extensibility-point).

Next, you will need to set the Chronograf [`AUTH0_ORGS`](/chronograf/v1.7/administration/config-options/#auth0-organizations) environment variable to a comma-separated list of the allowed organizations.
For example, if you have one group of users with an `organization` key set to `biffs-gang` and another group with an `organization` key set to `time-travelers`, you can permit access to both with this environment variable: `AUTH0_ORGS=biffs-gang,time-travelers`.

An `--auth0-organizations` command line option is also available, but it is limited to a single organization and does not accept a comma-separated list like its environment variable equivalent.

#### Configure Heroku authentication

1. Obtain a client ID and application secret for Heroku by following the guide posted [here](https://devcenter.heroku.com/articles/oauth#register-client).
2. Set the Chronograf environment variables based on your Heroku client credentials:

    ```sh
    export HEROKU_CLIENT_ID=<client-id-from-heroku>
    export HEROKU_SECRET=<client-secret-from-heroku>
    ```

3. If you haven't already, set the Chronograf environment with your token secret:

    ```sh
    export TOKEN_SECRET=Super5uperUdn3verGu355!
    ```

##### Heroku organizations (optional)

To restrict access to members of specific Heroku organizations,
use the `HEROKU_ORGS` environment variable (or associated command line option).
Multiple values must be comma-separated.

For example, to permit access from the `hill-valley-preservation-society` organization and `the-pinheads` organization,
use the following environment variable:

```sh
export HEROKU_ORGS=hill-valley-preservation-sociey,the-pinheads
```

#### Configure Okta authentication

1. Create an Okta web application by following the steps in the Okta documentation: [Implement the Authorization Code Flow](https://developer.okta.com/docs/guides/implement-auth-code/overview/).
  1. In the **General Settings** section, find the **Allowed grant types** listing and select
     only the **Client acting on behalf of a user:** **Authorization Code** option.
  2. In the **LOGIN** section, set the **Login redirect URIs* and **Initiate login URI** to `http://localhost:8888/oauth/okta/callback` (the default callback URL for Chronograf).

2. Set the following Chronograf environment variables:

    ```bash
    GENERIC_NAME=okta

    # The client ID is provided in the "Client Credentials" section of the Okta dashboard.
    GENERIC_CLIENT_ID=<okta_client_ID>

    # The client secret is in the "Client Credentials" section of the Okta dashboard.
    GENERIC_CLIENT_SECRET=<okta_client_secret>

    GENERIC_AUTH_URL=https://dev-553212.oktapreview.com/oauth2/default/v1/authorize
    GENERIC_TOKEN_URL=https://dev-553212.oktapreview.com/oauth2/default/v1/token
    GENERIC_API_URL=https://dev-553212.oktapreview.com/oauth2/default/v1/userinfo
    PUBLIC_URL=http://localhost:8888
    TOKEN_SECRET=secretsecretsecret
    GENERIC_SCOPES=openid,profile,email
    ```

3. If you haven't already, set the Chronograf environment with your token secret:

    ```sh
    export TOKEN_SECRET=Super5uperUdn3verGu355!
    ```

#### Configure GitLab authentication

1. In your GitLab profile, [create a new OAuth2 authentication service](https://docs.gitlab.com/ee/integration/oauth_provider.html#adding-an-application-through-the-profile).
   1. Provide a name for your application, then enter your publicly accessible Chronograf URL with the `/oauth/gitlab/callback` path as your GitLab **callback URL**.
      (For example, `http://<your_chronograf_server>:8888/oauth/gitlab/callback`.)
   2. Click **Submit** to save the service details.
   3. Make sure your application has **openid** and **read_user** scopes.

2. Copy the provided **Application Id** and **Secret** and set the following environment variables:

    > In the examples below, note the use of `gitlab-server-example.com` and `chronograf-server-example.com` in urls.
    > These should be replaced by the actual URLs used to access each service.

    ```bash
    GENERIC_NAME="gitlab"
    GENERIC_CLIENT_ID=<gitlab_application_id>
    GENERIC_CLIENT_SECRET=<gitlab_secret>
    GENERIC_AUTH_URL="https://gitlab.com/oauth/authorize"
    GENERIC_TOKEN_URL="https://gitlab.com/oauth/token"
    TOKEN_SECRET=<mytokensecret>
    GENERIC_SCOPES="api,openid,read_user"
    PUBLIC_URL="http://<chronograf-host>:8888"
    GENERIC_API_URL="https://gitlab.com/api/v3/user"
    ```

    The equivalent command line options are:

    ```bash
    --generic-name=gitlab
    --generic-client-id=<gitlab_application_id>
    --generic-client-secret=<gitlab_secret>
    --generic-auth-url=https://gitlab.com/oauth/authorize
    --generic-token-url=https://gitlab.com/oauth/token
    --token-secret=<mytokensecret>
    --generic-scopes=openid,read_user
    --generic-api-url=https://gitlab.com/api/v3/user
    --public-url=http://<chronograf-host>:8888/
    ```

#### Configure Azure Active Directory authentication

1. [Create an Azure Active Directory application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application).
   Note the following information: `<APPLICATION-ID>`, `<TENANT-ID>`, and `<APPLICATION-KEY>`.
   You'll need these to define your Chronograf environment.

2. Be sure to register a reply URL in your Azure application settings.
   This should match the calling URL from Chronograf.
   Otherwise, you will get an error stating no reply address is registered for the application.
   For example, if Chronograf is configured with a `GENERIC_NAME` value of AzureAD, the reply URL would be `http://localhost:8888/AzureAD/callback`.

3. After completing the application provisioning within Azure AD, you can now complete the configuration with Chronograf.
   Using the metadata from your Azure AD instance, proceed to export the following environment variables:

    Set the following environment variables in `/etc/default.chronograf`:

    ```
    GENERIC_TOKEN_URL=https://login.microsoftonline.com/<<TENANT-ID>>/oauth2/token
    TENANT=<<TENANT-ID>>
    GENERIC_NAME=AzureAD
    GENERIC_API_KEY=userPrincipalName
    GENERIC_SCOPES=openid
    GENERIC_CLIENT_ID=<<APPLICATION-ID>>
    GENERIC_AUTH_URL=https://login.microsoftonline.com/<<TENANT-ID>>/oauth2/authorize?resource=https://graph.windows.net
    GENERIC_CLIENT_SECRET=<<APPLICATION-KEY>>
    TOKEN_SECRET=secret
    GENERIC_API_URL=https://graph.windows.net/<<TENANT-ID>>/me?api-version=1.6
    PUBLIC_URL=http://localhost:8888
    ```

    Note: If you’ve configured TLS/SSL, modify the `PUBLIC_URL` to ensure you're using HTTPS.

#### Configure Chronograf to use any OAuth 2.0 provider

Chronograf can be configured to work with any OAuth 2.0 provider, including those defined above, by using the generic configuration options below.
Additionally, the generic provider implements OpenID Connect (OIDC) as implemented by Active Directory Federation Services (AD FS).

When using the generic configuration, some or all of the following environment variables (or corresponding command line options) are required (depending on your OAuth 2.0 provider):

* `GENERIC_CLIENT_ID`: Application client [identifier](https://tools.ietf.org/html/rfc6749#section-2.2) issued by the provider
* `GENERIC_CLIENT_SECRET`: Application client [secret](https://tools.ietf.org/html/rfc6749#section-2.3.1) issued by the provider
* `GENERIC_AUTH_URL`: Provider's authorization [endpoint](https://tools.ietf.org/html/rfc6749#section-3.1) URL
* `GENERIC_TOKEN_URL`: Provider's token [endpoint](https://tools.ietf.org/html/rfc6749#section-3.2) URL used by the Chronograf client to obtain an access token
* `USE_ID_TOKEN`: Enable OpenID [id_token](https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.3.3) processing
* `JWKS_URL`: Provider's JWKS [endpoint](https://tools.ietf.org/html/rfc7517#section-4.7) used by the client to validate RSA signatures
* `GENERIC_API_URL`: Provider's [OpenID UserInfo endpoint](https://connect2id.com/products/server/docs/api/userinfo)] URL used by Chronograf to request user data
* `GENERIC_API_KEY`: JSON lookup key for [OpenID UserInfo](https://connect2id.com/products/server/docs/api/userinfo)] (known to be required for Microsoft Azure, with the value `userPrincipalName`)
* `GENERIC_SCOPES`: [Scopes](https://tools.ietf.org/html/rfc6749#section-3.3) of user data required for your instance of Chronograf, such as user email and OAuth provider organization
  - Multiple values must be space-delimited, e.g. `user:email read:org`
  - These may vary by OAuth 2.0 provider
  - Default value: `user:email`
* `PUBLIC_URL`: Full public URL used to access Chronograf from a web browser, i.e. where Chronograf is hosted
  - Used by Chronograf, for example, to construct the callback URL
* `TOKEN_SECRET`: Used to validate OAuth [state](https://tools.ietf.org/html/rfc6749#section-4.1.1) response. (see above)

##### Optional environment variables

The following environment variables (and corresponding command line options) are also available for optional use:

* `GENERIC_DOMAINS`: Email domain where email address must include.
* `GENERIC_NAME`: Value used in the callback URL in conjunction with `PUBLIC_URL`, e.g. `<PUBLIC_URL>/oauth/<GENERIC_NAME>/callback`
  - This value is also used in the text for the Chronograf Login button
  - Default value is `generic`
  - So, for example, if `PUBLIC_URL` is `https://localhost:8888` and `GENERIC_NAME` is its default value, then the callback URL would be `https://localhost:8888/oauth/generic/callback`, and the Chronograf Login button would read `Log in with Generic`
  - While using Chronograf, this value should be supplied in the `Provider` field when adding a user or creating an organization mapping.

##### Example: OIDC with AD FS

See [Enabling OpenID Connect with AD FS 2016](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/development/enabling-openid-connect-with-ad-fs) for a walk through of the server configuration.

Exports for Chronograf (e.g. in `/etc/default.chronograf`):

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
```

> _**Note:**_ Do not use special characters for the GENERIC_CLIENT_ID as AD FS will split strings here, finally resulting in an identifier mismatch.

### Configure authentication duration

By default, user authentication remains valid for 30 days using a cookie stored in the web browser.
To configure a different authorization duration, set a duration using the `AUTH_DURATION` environment variable.

**Example:**

To set the authentication duration to 1 hour, use the following shell command:
```sh
export AUTH_DURATION=1h
```

The duration uses the Go (golang) [time duration format](https://golang.org/pkg/time/#ParseDuration), so the largest time unit is `h` (hours).
So to change it to 45 days, use:

```sh
export AUTH_DURATION=1080h
```

To require re-authentication every time the browser is closed, set `AUTH_DURATION` to `0`.
This makes the cookie transient (aka "in-memory").

## Configure TLS (Transport Layer Security) and HTTPS

The TLS (Transport Layer Security) cryptographic protocol is supported in Chronograf to provides server authentication, data confidentiality, and data integrity.
Using TLS secures traffic between a server and web browser and enables the use of HTTPS.

InfluxData recommends using HTTPS to communicate securely with Chronograf applications.
If you are not using a TLS termination proxy, you can run your Chronograf server with TLS connections.

Chronograf includes command line and environment variable options for configuring TLS (Transport Layer Security) certificates and key files.
Use of the TLS cryptographic protocol provides server authentication, data confidentiality, and data integrity.
When configured, users can use HTTPS to securely communicate with your Chronograf applications.

> ***Note:*** Using HTTPS helps guard against nefarious agents sniffing the JWT and using it to spoof a valid user against the Chronograf server.

### Configuring TLS for Chronograf

Chronograf server has command line and environment variable options to specify the certificate and key files.
The server reads and parses a public/private key pair from these files.
The files must contain PEM-encoded data.

All Chronograf command line options have corresponding environment variables.

**To configure Chronograf to support TLS:**

1. Specify the certificate file using the `TLS_CERTIFICATE` environment variable (or the `--cert` CLI option).
2. Specify the key file using the `TLS_PRIVATE_KEY` environment variable (or `--key` CLI option).

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
