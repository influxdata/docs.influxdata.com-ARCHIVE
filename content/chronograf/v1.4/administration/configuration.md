---
title: Configuration
menu:
  chronograf_1_4:
    weight: 20
    parent: Administration
---

### Content
* [Usage](#usage)
* [Application Options](#application-options)
  * [host](#host)
  * [port](#port)
  * [cert](#cert)
  * [key](#key)
  * [influxdb-url](#influxdb-url)
  * [influxdb-username](#influxdb-username)
  * [influxdb-password](#influxdb-password)
  * [kapacitor-url](#kapacitor-url)
  * [kapacitor-username](#kapacitor-username)
  * [kapacitor-password](#kapacitor-password)
* [Other Options](#other-options)
  * [develop](#d-develop)
  * [bolt-path](#b-bolt-path)
  * [canned-path](#c-canned-path)
  * [token-secret](#t-token-secret)
  * [auth-duration](#auth-duration)
  * [github-client-id](#i-github-client-id)
  * [github-client-secret](#s-github-client-secret)
  * [github-organization](#o-github-organization)
  * [google-client-id](#google-client-id)
  * [google-client-secret](#google-client-secret)
  * [google-domains](#google-domains)
  * [public-url](#public-url)
  * [heroku-client-id](#heroku-client-id)
  * [heroku-secret](#heroku-secret)
  * [heroku-organization](#heroku-organization)
  * [auth0-domain](#auth0-domain)
  * [auth0-client-id](#auth0-client-id)
  * [auth0-client-secret](#auth0-client-secret)
  * [auth0-organizations](#heroku-organization)
  * [generic-name](#generic-name)
  * [generic-client-id](#generic-client-id)
  * [generic-client-secret](#generic-client-secret)
  * [generic-scopes](#generic-scopes)
  * [generic-domains](#generic-domains)
  * [generic-auth-url](#generic-auth-url)
  * [generic-token-url](#generic-token-url)
  * [generic-api-url](#generic-api-url)
  * [reporting-disabled](#r-reporting-disabled)
  * [log-level](#l-log-level-choice-debug-info-error)
  * [basepath](#p-basepath)
  * [prefix-routes](#prefix-routes)
  * [version](#v-version)
* [Help Option](#help-option)
  * [help](#h-help)

## Usage:
```
chronograf [OPTIONS]
```

## Application Options

### \--host=
The IP that `chronograf` listens on (default: `0.0.0.0`).

**Environment Variable:** `$HOST`
                                              
### \--port=
The port that `chronograf` listens on for insecure connections (default: `8888`).

**Environment Variable:** `$PORT`
                                              
### \--cert=
The file path to PEM encoded public key certificate.

**Environment Variable:** `$TLS_CERTIFICATE`

### \--key=
The file path to private key associated with given certificate.

**Environment Variable:** `$TLS_PRIVATE_KEY`
                                              
### \--influxdb-url=
The location of your InfluxDB instance including `http://`, the IP address, and port.  
Example: `http:///0.0.0.0:8086`.

**Environment Variable:** `$INFLUXDB_URL`

### \--influxdb-username=
The [username](/chronograf/v1.3/administration/user-management/) for your InfluxDB instance.

**Environment Variable:** `$INFLUXDB_USERNAME`

### \--influxdb-password=
The [password](/chronograf/v1.3/administration/user-management/) for your InfluxDB instance.

**Environment Variable:** `$INFLUXDB_PASSWORD`

### \--kapacitor-url=
The location of your Kapacitor instance including `http://`, the IP address, and port.  
Example: `http://0.0.0.0:9092`.

**Environment Variable:** `$KAPACITOR_URL`

### \--kapacitor-username=
The username for your Kapacitor instance.

**Environment Variable:** `$KAPACITOR_USERNAME`

### \--kapacitor-password=
The password for your Kapacitor instance.

**Environment Variable:** `$KAPACITOR_PASSWORD`

## Other Options

### -d, \--develop                               
Run the `chronograf` server in develop mode.

### -b, \--bolt-path=                            
The file path to the boltDB file (default: `/var/lib/chronograf/chronograf-v1-.db`).

**Environment Variable:** `$BOLT_PATH`

### -c, \--canned-path=                          
The path to the directory for [pre-created dashboards](/chronograf/v1.3/troubleshooting/frequently-asked-questions/#what-applications-are-supported-in-chronograf) (default: `/usr/share/chronograf/canned`).

**Environment Variable:** `$CANNED_PATH`

### -t, \--token-secret=                         
The secret for signing tokens.

**Environment Variable:** `$TOKEN_SECRET`

### \--auth-duration=                            
The total duration (in hours) of cookie life for authentication (default: `720h`).
Authentication expires on browser close if `--auth-duration` is set to `0`.

**Environment Variable:** `$AUTH_DURATION`

### -i, \--github-client-id=                     
The Github Client ID for OAuth 2 support.

**Environment Variable:** `$GH_CLIENT_ID`

### -s, \--github-client-secret=                 
The Github Client Secret for OAuth 2 support.

**Environment Variable:** `$GH_CLIENT_SECRET`

### -o, \--github-organization=                  
The Github organization user is required to have an active membership.

**Environment Variable:** `$GH_ORGS`

### \--google-client-id=                         
The Google Client ID for OAuth 2 support.

**Environment Variable:** `$GOOGLE_CLIENT_ID`

### \--google-client-secret=                     
The Google Client Secret for OAuth 2 support.

**Environment Variable:** `$GOOGLE_CLIENT_SECRET`

### \--google-domains=                           
The Google email domain user is required to have an active membership.

**Environment Variable:** `$GOOGLE_DOMAINS`

### \--public-url=                               
The full public URL used to access Chronograf from a web browser (default: `http://localhost:8888`).
Used for Google, Auth0, and some Generic OAuth2 authentication providers.

**Environment Variable:** `$PUBLIC_URL`

### \--heroku-client-id=                         
The Heroku Client ID for OAuth 2 support.

**Environment Variable:** `$HEROKU_CLIENT_ID`

### \--heroku-secret=                            
The Heroku Secret for OAuth 2 support.

**Environment Variable:** `$HEROKU_SECRET`

### \--heroku-organization=                      
The Heroku Organization Memberships a user is required to have for access to Chronograf.
Lists are comma-separated.

**Environment Variable:** `$HEROKU_ORGS`

### \--auth0-domain=                      
The subdomain of your Auth0 client.
This is available on the configuration page for your Auth0 client.
It should look something like https://myauth0client.auth0.com

**Environment Variable:** `$AUTH0_DOMAIN`

### \--auth0-client-id=                      
The Client ID supplied by Auth0 for OAuth 2 support.

**Environment Variable:** `$AUTH0_CLIENT_ID`

### \--auth0-client-secret=                      
The Client Secret supplied by Auth0 for OAuth 2 support.

**Environment Variable:** `$AUTH0_CLIENT_SECRET`

### \--auth0-organizations=                      
The Auth0 Organization that a user must belong to for access to Chronograf.
Organizations are set using an "organization" key in the user's "app_metadata".

Lists are comma-separated and only available when using environment variables.

**Environment Variable:** `$AUTH0_ORGS`

### \--generic-name=                             
The generic OAuth 2 name presented on the login page.

**Environment Variable:** `$GENERIC_NAME`

### \--generic-client-id=                        
The generic OAuth 2 Client ID.
Can be used for own OAuth 2 service.

**Environment Variable:** `$GENERIC_CLIENT_ID`

### \--generic-client-secret=                    
The generic OAuth 2 Client Secret.

**Environment Variable:** `$GENERIC_CLIENT_SECRET`

### \--generic-scopes=                           
The scopes requested by provider of web client (default: `user:email`).

**Environment Variable:** `$GENERIC_SCOPES`

### \--generic-domains=                          
The email domain users' email address to have.  
Example: `example.com`.

**Environment Variable:** `$GENERIC_DOMAINS`

### \--generic-auth-url=                         
The OAuth 2.0 provider's authorization endpoint URL.

**Environment Variable:** `$GENERIC_AUTH_URL`

### \--generic-token-url=                        
The OAuth 2.0 provider's token endpoint URL.

**Environment Variable:** `$GENERIC_TOKEN_URL`

### \--generic-api-url=                          
The URL that returns OpenID UserInfo compatible information.

**Environment Variable:** `$GENERIC_API_URL`

### -r, \--reporting-disabled                    
Disable reporting of usage stats.
Usage stats report OS, arch, version, cluster_id, and uptime information once every 24 hours.

**Environment Variable:** `$REPORTING_DISABLED`

### -l, \--log-level=choice[debug|info|error]    
Set the logging level (default: `info`).

**Environment Variable:** `$LOG_LEVEL`

### -p, \--basepath=                             
The URL path prefix under which all `chronograf` routes will be mounted.

**Environment Variable:** `$BASE_PATH`

### \--prefix-routes                             
Force `chronograf` server to require that all requests to it are prefixed with the value set in `--basepath`.

**Environment Variable:** `$PREFIX_ROUTES`

### -v, \--version                               
Show Chronograf version information.

## Help Option

### -h, \--help
Show the help information for `chronograf`.
