---
title: chronograf cli
description:
menu:
  chronograf_1_8:
    name: chronograf CLI
    parent: Tools
    weight: 10

---

The `chronograf` command line interface (CLI) includes ???.

## Usage
```
chronograf [flags]
```

## Chronograf service flags

| Flag                  | Description                                                                               | Default                                 | Env. Variable      |
|-----------------------|-------------------------------------------------------------------------------------------|-----------------------------------------|--------------------|
| `--host`              | IP the Chronograf service listens on                                                      | `0.0.0.0`                               | `$HOST`            |
| `--port`              | Port the Chronograf service listens on for insecure connections                           | `8888`                                  | `$PORT`            |
| `--b`,`--bolt-path`   | File path to the BoltDB file                                                              | `./chronograf-v1.db`                    | `$BOLT_PATH`       |
| `--c`,`--canned-path` | File path to the directory of canned dashboard files                                      | `/usr/share/chronograf/canned`          | `$CANNED_PATH`     |
| `--resources-path`    | Path to directory of canned dashboards, sources, Kapacitor connections, and organizations | `/usr/share/chronograf/resources`       | `$RESOURCES_PATH`  |
| `--b`, `--basepath`   | URL path prefix under which all Chronograf routes will be mounted.                        |                                         | `$BASE_PATH`       |
| `--status-feed-url`   | URL of JSON feed to display as a news feed on the client status page                      | `https://www.influxdata.com/feed/json` | `$STATUS_FEED_URL` |
| `--v`, `--version`    | Displays the version of the Chronograf service                                           |                                         |                    |
