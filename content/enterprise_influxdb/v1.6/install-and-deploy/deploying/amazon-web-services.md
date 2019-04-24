---
title: Deploy an InfluxDB Enterprise cluster on Amazon Web Services
menu:
  enterprise_influxdb_1_6:
    name: Deploy on Amazon Web Services
    weight: 20
    parent: deploy-in-cloud-enterprise
---


## Deploy an InfluxDB Enterprise cluster on Amazon Web Services

InfluxData recommends using the Terraform [InfluxDB AWS Module](https://github.com/gruntwork-io/terraform-aws-influx)to deploy a single InfluxDB Enterprise cluster or a multi-cluster architecture on Amazon Web Services.

### InfluxDB AWS Module (Terraform)

The [InfluxDB AWS Module] is the official module for deploying InfluxDB Enterprise on AWS using [Terraform](https://www.terraform.io/) and [Packer](https://www.packer.io/).

The [InfluxDB AWS Module](https://registry.terraform.io/modules/gruntwork-io/influx/aws/), maintained by [Gruntwork](http://www.gruntwork.io/), was written using a combination of Terraform and scripts (mostly bash) and includes automated tests, documentation, and examples.

For details on using this Terraform module to deploy InfluxDB Enterprise clusters, see the [InfluxDB AWS Module repository](https://github.com/gruntwork-io/terraform-aws-influx).
