---
title: AWS architecture
menu:
  enterprise_influxdb_1_7:
    name: AWS architecture
    weight: 30
    parent: aws
---

[Stacked Graph Controls](/img/influxdb/aws-marketplace-influxdb-enterprise.png)

auto scaling groups: each one only has one instance on purpose that it manages. should never have more than one instance.  ** important to note in the docs for people making changes. each time an instance spins up it automatically ssigns itself an EBS and ENI (see image)
