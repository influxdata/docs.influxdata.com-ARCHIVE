---
title: Upgrading from Previous Versions

menu:
  chronograf_013:
    name: Upgrading from Previous Versions
    weight: 10
    parent: Administration
---

Users looking to upgrade from versions prior to 0.10 to version 0.13 need to
take a few additional steps.

### For users who wish to maintain their dashboards and visualizations

1. [Install](https://influxdata.com/downloads/) Chronograf 0.10 to upgrade the `chronograf.db` directory
2. [Install](https://influxdata.com/downloads/) Chronograf 0.13

### For users with no attachment to their dashboards and visualizations

1. Remove the `chronograf.db` directory
2. [Install](https://influxdata.com/downloads/) Chronograf 0.13

> **Note:** Chronograf 0.11 made several changes to take into account the [breaking API changes](https://github.com/influxdata/influxdb/blob/master/CHANGELOG.md) released with InfluxDB 0.11.
As a result, we do not recommend using Chronograf 0.13 with InfluxDB versions prior to 0.11.
In general, we recommend maintaining version parity across the TICK stack.
