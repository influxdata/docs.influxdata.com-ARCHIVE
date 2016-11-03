---
title: Upgrading from Previous Versions
aliases:
    - chronograf/v1.1/administration/new_features_in_chronograf_0.11/
    - chronograf/v1.1/administration/upgrading_to_chronograf_0.11_from_previous_versions/
menu:
  chronograf_1_1:
    name: Upgrading from Previous Versions
    weight: 10
    parent: Administration
---

# A New Chronograf

The new [open source version of Chronograf](https://github.com/influxdata/chronograf) is not a continuation of the previous closed source product.
They address similar needs, so we have kept the name, but the code is all new.

Please read the [blog post from Paul Dix](https://www.influxdata.com/announcing-the-new-chronograf-a-ui-for-the-tick-stack-and-a-complete-open-source-monitoring-solution), our CTO, to understand how Chronograf is evolving and what to expect in the coming releases.

## Upgrading

There is no path for upgrading from the closed source Chronograf (versions 0.4 through 1.0)
to the open source Chronograf product (version 1.1-alpha+).
To get up and running with the new open source Chronograf, please visit the [README](https://github.com/influxdata/chronograf/blob/master/README.md) in the GitHub repository.
All documentation will live in that repository during the 1.1-alpha release.

Future releases of the new Chronograf product will be drop-in upgrades. During the initial 1.1-alpha release there will be multiple patch releases every 2 weeks with bug fixes and new features based on what early adopters are requesting. We know this is breaking with semantic versioning, but felt it was best for the platform as a whole. Future versions of this new Chronograf will have a superset of functionality from the closed source 1.0 release.

<br>
# The Old Chronograf is Deprecated

There will be no further development on the original closed source Chronograf product. Chronograf 1.0 will be the final release of this product.

Users can continue to use the deprecated, closed source Chronograf product (versions 0.4 through 1.0).
The documentation is available under `Chronograf Versions` in the left hand navigation bar.
