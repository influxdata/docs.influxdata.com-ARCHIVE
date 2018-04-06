---
title: Upgrading to Chronograf 0.12 from versions <= 0.4
newversionredirect: administration/upgrading/
menu:
  chronograf_012:
    name: Upgrading to Chronograf 0.12 from versions <= 0.4
    weight: 10
    parent: Administration
---

Changes in Chronograf 0.12 require users looking to upgrade from versions prior to 0.10 to take a few additional steps.

### For users who wish to maintain their dashboards and visualizations

1. [Install](https://influxdata.com/downloads/) Chronograf 0.10 to upgrade the `chronograf.db` directory
2. [Install](https://influxdata.com/downloads/) Chronograf 0.12

### For users with no attachment to their dashboards and visualizations

1. Remove the `chronograf.db` directory
2. [Install](https://influxdata.com/downloads/) Chronograf 0.12

> **Note:** Chronograf 0.11 made several changes to take into account the [breaking API changes](https://github.com/influxdata/influxdb/blob/master/CHANGELOG.md) released with InfluxDB 0.11.
As a result, we do not recommend using Chronograf 0.12 with InfluxDB versions prior to 0.11.
In general, we recommend maintaining version parity across the TICK stack.
