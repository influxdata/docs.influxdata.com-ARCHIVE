---
title: Configuration

menu:
  chronograf_1_1:
    name: Configuration
    weight: 20
    parent: Administration
---

## Using Configuration Files

A default TOML-formatted Chronograf config file can be generated using the `-sample-config` flag:

```
chronograf -sample-config > chronograf.generated.conf
```

The generated sample configuration file has pretty clear inline comments, like this:

```
# Chronograf configuration

# TCP address that Chronograf should bind to.
# Bind to localhost by default, so that Chronograf should be inaccessible from the public internet.
# If you do want Chronograf to be accessible to the public internet on port 10000, use the next line:
# Bind = "0.0.0.0:10000" # <- This will expose Chronograf to the public internet. Use with caution!
# Can be overridden with environment variable CHRONOGRAF_BIND.
Bind = "127.0.0.1:10000"

# Path to local database file to use or create for storing Chronograf application data.
# Can be overridden with environment variable CHRONOGRAF_LOCAL_DATABASE.
LocalDatabase = "/opt/chronograf/chronograf.db"

# Maximum response size in bytes, for queries that pass through Chronograf.
# Setting this to a reasonable value will ensure that your browser does not crash
# if a query results in an excessively large response.
# If you do have a query that is too large, you will see an error message about the
# query response being too large.
# Can be overridden with environment variable CHRONOGRAF_QUERY_RESPONSE_BYTES_LIMIT.
QueryResponseBytesLimit = 2500000
```

To launch Chronograf with your configuration file, use the `-config` option:

```
chronograf -config chronograf.generated.conf
```

By default, Chronograf will look for configuration files in these locations:

* Debian or RPM package: `/opt/chronograf/config.toml`
* OS X via Homebrew: `/usr/local/etc/chronograf.toml`
* Standalone OS X binary: `chronograf-0.x.x/chronograf.toml`
