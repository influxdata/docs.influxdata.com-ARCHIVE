---
title: Scraping and Discovery

menu:
  kapacitor_1_3:
    weight: 0
    parent: pull_metrics
---

Kapacitor supports discovering and scraping remote targets.
Currently only Prometheus style targets are supported.

>NOTE: Scraping and Discovery is currently under technical preview.
This means that there may be changes to the configuration and behavior in subsequent releases.

## Scraping

Scraping is the action of making a request to a target for metrics about the target.
As an example your application could expose a `/metrics` endpoint on its HTTP API that returns statistics about the running application.

## Discovery

Discovery is the action of querying a system for a list of known targets to scrape.
For example DNS can be used for discovery.

## Pulling metrics

By combining discovery with scraping Kapacitor enables your metrics gathering infrastructure to pull metrics off target instead of requiring them to push metrics out to InfluxDB.
Pulling metrics has various advantages in very dynamic environments where a target may have a very short lifecycle.


## Configuring Scrapers and Discoverers


A single scraper will scrape the targets from a single discoverer.
Configuring both scrapers and discoverers comes down to configuring each individually and then informing the scraper about the discoverer.

Below are all the configuration options for a scraper.

```
[[scraper]]
  enabled = false
  name = "myscraper"
  # ID of the discoverer to use
  discoverer-id = ""
  # The kind of discoverer to use
  discoverer-service = ""
  db = "mydb"
  rp = "myrp"
  type = "prometheus"
  scheme = "http"
  metrics-path = "/metrics"
  scrape-interval = "1m0s"
  scrape-timeout = "10s"
  username = ""
  password = ""
  bearer-token = ""
  ssl-ca = ""
  ssl-cert = ""
  ssl-key = ""
  ssl-server-name = ""
  insecure-skip-verify = false
```


### Available Discoverers

Kapacitor supports the following service for discovery:

| Name             | Description                                                                                                               |
| ----             | -----------                                                                                                               |
| azure            | Discover targets hosted in [Azure](https://azure.microsoft.com/).                                                         |
| consul           | Discover targets using [Consul](https://www.consul.io/) service discovery.                                                |
| dns              | Discover targets via DNS queries.                                                                                         |
| ec2              | Discover targets hosted in [AWS EC2](https://aws.amazon.com/ec2/).                                                        |
| file-discovery   | Discover targets listed in files.                                                                                         |
| gce              | Discover targets hosted in [GCE](https://cloud.google.com/compute/).                                                      |
| kubernetes       | Discover targets hosted in [Kubernetes](https://kubernetes.io/).                                                          |
| marathon         | Discover targets using [Marathon](https://mesosphere.github.io/marathon/) service discovery.                              |
| nerve            | Discover targets using [Nerve](https://github.com/airbnb/nerve) service discovery.                                        |
| serverset        | Discover targets using [Serversets](https://github.com/twitter/finagle/tree/master/finagle-serversets) service discovery. |
| static-discovery | Statically list targets.                                                                                                  |
| triton           | Discover targets using [Triton](https://github.com/joyent/triton) service discovery.                                      |


See the example [configuration file](https://github.com/influxdata/kapacitor/blob/master/etc/kapacitor/kapacitor.conf) for details on configuring each discoverer.
