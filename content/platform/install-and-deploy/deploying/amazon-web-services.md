---
title: Deploy an InfluxDB Enterprise cluster on Amazon Web Services
description: Use the Terraform InfluxDB AWS Module to deploy single or multi- cluster architectures on Amazon Web Services.
menu:
  platform:
    name: Deploy InfluxDB Enterprise clusters on Amazon Web Services
    parent: deploy-platform
    weight: 3
---

InfluxData recommends using the Terraform [InfluxDB AWS Module](https://github.com/gruntwork-io/terraform-aws-influx) to deploy a single InfluxDB Enterprise cluster or a multi-cluster architecture  on Amazon Web Services.

### InfluxDB AWS Module (Terraform)

The [InfluxDB AWS Module] is the official module for deploying InfluxDB Enterprise on AWS using [Terraform](https://www.terraform.io/) and [Packer](https://www.packer.io/).

The InfluxDB AWS Module, maintained by [Gruntwork](http://www.gruntwork.io/), was written using a combination of Terraform and scripts (mostly bash) and includes automated tests, documentation, and examples.

For details on using this Terraform module to deploy InfluxDB Enterprise clusters, see the [InfluxDB AWS Module repository](https://github.com/gruntwork-io/terraform-aws-influx).
