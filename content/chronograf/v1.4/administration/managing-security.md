---
title: Managing security

aliases: /chronograf_1_4/security-best-practices/

menu:
  chronograf_1_4:
    weight: 50
    parent: Administration
---

On this page

* [Using Chronograf with OAuth 2.0 Authentication](#chronograf-with-oauth-2-0-authentication)
    * [Configuration](#configuration)
        * [JWT Signature](#jwt-signature)
        * [GitHub](#github)
        * [Google](#google)
        * [Heroku](#heroku)
        * [Auth0](#auth0)
        * [Generic](#generic)
        * [Optional: Configure an Authentication Duration](#optional-configure-an-authentication-duration)
* [TLS](#tls)
  * [Running Chronograf with TLS](#running-chronograf-with-tls)
  * [Testing with Self-Signed Certificates ](#testing-with-self-signed-certificates)

## Using Chronograf with OAuth 2.0 authentication

To manage organizations and users in Chronograf, you need to configure an OAuth 2.0 authentication provider.

### Configuring a JWT Signature and OAuth 2.0 provider

Configure the JWT signature and the OAuth provider to use authentication in Chronograf.

>**Note:**
If you're using the [`--basepath` option](/chronograf/v1.4/administration/configuration/#p-basepath) when starting Chronograf,
add the same basepath to the callback URL of any OAuth provider that you configure.

### JWT Signature

A [JWT](https://tools.ietf.org/html/rfc7519) signature is required for all OAuth 2.0 autentication providers.

To create a JWT signature, assign `TOKEN_SECRET` to a random string.

Example:

```sh
export TOKEN_SECRET=supersupersecret
```

*Keep this random string around!*

You'll need it each time you start a Chronograf server because it is used to verify user authorization.
If you are running multiple Chronograf servers in an HA configuration, set the `TOKEN_SECRET` environment variable on each server to allow users to stay logged in.
If you want to log all users out every time the server restarts, change the value of `TOKEN_SECRET` to a different value on each restart.


### GitHub

#### Overview

```sh
export AUTH_DURATION=1h                                           # force login every hour
export TOKEN_SECRET=supersupersecret                              # Signing secret
export GH_CLIENT_ID=b339dd4fddd95abec9aa                          # GitHub client ID
export GH_CLIENT_SECRET=260041897d3252c146ece6b46ba39bc1e54416dc  # GitHub client secret
export GH_ORGS=biffs-gang                                         # Restrict to GH orgs
```

#### Creating a GitHub OAuth 2.0 application

To create a GitHub OAuth Application, follow the [Register your app](https://developer.github.com/guides/basics-of-authentication/#registering-your-app) instructions.
Essentially, you'll register your application [here](https://github.com/settings/applications/new).

The `Homepage URL` should include Chronograf's full server name and port.
If you are running it locally for example, make it `http://localhost:8888`.

The `Authorization callback URL` must be the location of the `Homepage URL` plus `/oauth/github/callback`.
For example, if `Homepage URL` was `http://localhost:8888`, then the `Authorization callback URL` should be `http://localhost:8888/oauth/github/callback`.

GitHub provides a `Client ID` and `Client Secret`.
To register these values with Chronograf set the following environment variables:

* `GH_CLIENT_ID`
* `GH_CLIENT_SECRET`

For example:
```sh
export GH_CLIENT_ID=b339dd4fddd95abec9aa
export GH_CLIENT_SECRET=260041897d3252c146ece6b46ba39bc1e54416dc
```

#### Optional GitHub organizations

To require an organization membership for a user, set the `GH_ORGS` environment variables:
```sh
export GH_ORGS=biffs-gang
```
If the user is not a member, then the user will not be allowed access.
To support multiple organizations, use a comma-delimited list like in this example:
```sh
export GH_ORGS=hill-valley-preservation-sociey,the-pinheads
```

### Google

#### Creating Google OAuth Application
Obtain a client ID and an application secret by following the steps under "Basic Steps" [here](https://developers.google.com/identity/protocols/OAuth2).
Chronograf will also need to be publicly accessible via a fully qualified domain name so that Google properly redirects users back to the application.
This information should be set in the following environment variables:

* `GOOGLE_CLIENT_ID`
* `GOOGLE_CLIENT_SECRET`
* `PUBLIC_URL`

Alternatively, this can also be set using the command line switches:

* [`--google-client-id`](/chronograf/v1.4/administration/configuration/#google-client-id)
* [`--google-client-secret`](/chronograf/v1.4/administration/configuration/#google-client-secret)
* [`--public-url`](/chronograf/v1.4/administration/configuration/#public-url)

#### Optional Google domains

Similar to GitHub's organization restriction, Google authentication can be restricted to permit access to Chronograf from only specific domains.
These are configured using the `GOOGLE_DOMAINS` environment variable or the [`--google-domains`](/chronograf/v1.4/administration/configuration/#google-domains) switch.
Multiple domains are separated using commas.
For example, if we wanted to permit access only from `biffspleasurepalace.com` and `savetheclocktower.com`, the environment variable would be set as follows:
```sh
export GOOGLE_DOMAINS=biffspleasurepalance.com,savetheclocktower.com
```

### Heroku

#### Creating a Heroku application

To obtain a client ID and application secret for Heroku, follow the guide posted [here](https://devcenter.heroku.com/articles/oauth#register-client).
Once your application has been created, those two values should be inserted into the following environment variables:

* `HEROKU_CLIENT_ID`
* `HEROKU_SECRET`

The equivalent command line switches are:

* [`--heroku-client-id`](/chronograf/v1.4/administration/configuration/#heroku-client-id)
* [`--heroku-secret`](/chronograf/v1.4/administration/configuration/#heroku-secret)

#### Optional Heroku organizations

Like the other OAuth2 providers, access to Chronograf via Heroku can be restricted to members of specific Heroku organizations.
This is controlled using the `HEROKU_ORGS` environment variable or the [`--heroku-organizations`](/chronograf/v1.4/administration/configuration/#heroku-organization) switch and is comma-separated.
If we wanted to permit access from the `hill-valley-preservation-society` organization and `the-pinheads` organization, we would use the following environment variable:
```sh
export HEROKU_ORGS=hill-valley-preservation-sociey,the-pinheads
```

### Auth0

#### Creating an Auth0 application

To begin authenticating Chronograf users with Auth0, you will need to have an Auth0 account and [register an Auth0 client](https://auth0.com/docs/clients) within their dashboard.

Auth0 clients should be configured as `Regular Web Applications` with the `Token Endpoint Authentication` set to `None`.
Clients must have the `Allowed Callback URLs` set to `https://www.example.com/oauth/auth0/callback` and the `Allowed Logout URLs` to `https://www.example.com`, substituting `example.com` for the [`PUBLIC_URL`](/chronograf/v1.4/administration/configuration/#public-url) of your Chronograf instance.

Finally, clients must be set to be ["OIDC Conformant"](https://auth0.com/docs/api-auth/intro#how-to-use-the-new-flows).

Click **Save**, and then take note of your Domain, Client ID, and Secret at the top of the page.
These should be inserted into the following environment variables:

* `AUTH0_DOMAIN`
* `AUTH0_CLIENT_ID`
* `AUTH0_CLIENT_SECRET`

The equivalent command line switches are:

* [`--auth0-domain`](/chronograf/v1.4/administration/configuration/#auth0-domain)
* [`--auth0-client-id`](/chronograf/v1.4/administration/configuration/#auth0-client-id)
* [`--auth0-client-secret`](/chronograf/v1.4/administration/configuration/#auth0-client-secret)

#### Optional Auth0 organizations

Auth0 can be customized to the operator's requirements, so it has no official concept of an "organization."
Organizations are supported in Chronograf using a lightweight `app_metadata` key that can be inserted into Auth0 user profiles automatically or manually.

To assign a user to an organization, add an `organization` key to the user `app_metadata` field with the value corresponding to the user's organization.
For example, we can assign the user Marty McFly to the "time-travelers" organization by setting `app_metadata` to `{"organization": "time-travelers"}`.
This can be done either manually by an operator or automatically through the use of an [Auth0 Rule](https://auth0.com/docs/rules/metadata-in-rules#updating-app_metadata) or a [pre-user registration Auth0 Hook](https://auth0.com/docs/hooks/extensibility-points/pre-user-registration).

Next, you will need to set the Chronograf [`AUTH0_ORGS`](/chronograf/v1.4/administration/configuration/#auth0-client-secret) environment variable to a comma-separated list of the allowed organizations.
    For example, if you have one group of users with an `organization` key set to `biffs-gang` and another group with an `organization` key set to `time-travelers`, you can permit access to both with this environment variable: `AUTH0_ORGS=biffs-gang,time-travelers`.

An `--auth0-organizations` command line switch is also available, but it is limited to a single organization and does not accept a comma-separated list like its environment variable equivalent.

### Generic

#### Creating OAuth Application using your own provider

The generic OAuth2 provider is very similar to the GitHub provider, but,
you are able to set your own authentication, token, and API URLs.
The callback URL path will be `/oauth/generic/callback`.
So, if your Chronograf is hosted at `https://localhost:8888` then the full callback URL would be  `https://localhost:8888/oauth/generic/callback`.

The generic OAuth2 provider requires several settings:

* `GENERIC_CLIENT_ID` : this application's client [identifier](https://tools.ietf.org/html/rfc6749#section-2.2) issued by the provider
* `GENERIC_CLIENT_SECRET` : this application's [secret](https://tools.ietf.org/html/rfc6749#section-2.3.1) issued by the provider
* `GENERIC_AUTH_URL` : OAuth 2.0 provider's authorization [endpoint](https://tools.ietf.org/html/rfc6749#section-3.1) URL
* `GENERIC_TOKEN_URL` : OAuth 2.0 provider's token endpoint [endpoint](https://tools.ietf.org/html/rfc6749#section-3.2) is used by the client to obtain an access token
* `TOKEN_SECRET` : Used to validate OAuth [state](https://tools.ietf.org/html/rfc6749#section-4.1.1) response. (see above)

#### Optional Scopes

By default Chronograf will ask for the `user:email` [scope](https://tools.ietf.org/html/rfc6749#section-3.3) of the client.
If your provider scopes email access under a different scope or scopes provide them as comma-separated values in the `GENERIC_SCOPES` environment variable.
```sh
export GENERIC_SCOPES="openid,email" # Requests access to openid and email scopes
```

#### Optional Email domains

The generic OAuth2 provider has a few optional parameters.

* `GENERIC_API_URL` : URL that returns [OpenID UserInfo JWT](https://connect2id.com/products/server/docs/api/userinfo) (specifically email address)
* `GENERIC_DOMAINS` : Email domains user's email address must use.

#### Configuring the look of the login page

To configure the copy of the login page button text, set the `GENERIC_NAME` environment variable.
For example, with
```sh
export GENERIC_NAME="Hill Valley Preservation Society"
```
the button text will be `Login with Hill Valley Preservation Society`.

### Optional: Configure an Authentication Duration

By default, authentication will remain valid for 30 days via a cookie stored in the browser.
Configure that duration with the `AUTH_DURATION` environment variable.
For example, to change it to 1 hour, use:
```sh
export AUTH_DURATION=1h
```
The duration uses the Go (golang) [time duration format](https://golang.org/pkg/time/#ParseDuration), so the largest time unit is `h` (hours). So to change it to 45 days, use:
```sh
export AUTH_DURATION=1080h
```
Additionally, for greater security, if you want to require re-authentication every time the browser is closed, set `AUTH_DURATION` to `0`. This makes the cookie transient (aka "in-memory").

## TLS

Chronograf supports TLS (Transport Layer Security) to securely communicate between the browser and server using HTTPS.

We recommend using HTTPS with Chronograf.
If you are not using a TLS termination proxy, you can run Chronograf's server with TLS connections.

### Running Chronograf with TLS

Chronograf server has command line and environment variable options to specify the certificate and key files.
The server reads and parses a public/private key pair from these files.
The files must contain PEM-encoded data.

All Chronograf command line options have corresponding environment
variables.

To specify the certificate file, either use the `--cert` CLI option or `TLS_CERTIFICATE` environment variable.

To specify the key file either use the `--key` CLI option or `TLS_PRIVATE_KEY`
environment variable.

To specify the certificate and key if both are in the same file, use either the `--cert`
CLI option or `TLS_CERTIFICATE` environment variable.

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

### Testing with Self-Signed Certificates
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
