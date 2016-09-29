---
title: Upgrading from Previous Versions
aliases:
    - chronograf/v1.0/administration/new_features_in_chronograf_0.11/
    - chronograf/v1.0/administration/upgrading_to_chronograf_0.11_from_previous_versions/
menu:
  chronograf_1_0:
    name: Upgrading from Previous Versions
    weight: 10
    parent: Administration
---

If you're using Chronograf versions 0.11, 0.12 or 0.13 there's no need to
upgrade version 1.0.
Versions 0.11 through 1.0 are the same.

Users looking to upgrade from versions prior to 0.10 to version 1.0 need to
take a few additional steps:

### For users who wish to maintain their dashboards and visualizations

1. [Install](https://influxdata.com/downloads/) Chronograf 0.10 to upgrade the `chronograf.db` directory
2. [Install](https://influxdata.com/downloads/) Chronograf 1.0

### For users with no attachment to their dashboards and visualizations

1. Remove the `chronograf.db` directory
2. [Install](https://influxdata.com/downloads/) Chronograf 1.0

> **Note:** Chronograf 0.11 made several changes to take into account the [breaking API changes](https://github.com/influxdata/influxdb/blob/master/CHANGELOG.md) released with InfluxDB 0.11.
As a result, we do not recommend using Chronograf 1.0 with InfluxDB versions prior to 0.11.
In general, we recommend maintaining version parity across the TICK stack.
