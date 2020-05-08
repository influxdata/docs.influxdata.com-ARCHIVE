---
title: Deploy an InfluxDB Enterprise cluster on Azure Cloud Platform
menu:
  enterprise_influxdb_1_8:
    name: Deploy on Azure Cloud Platform
    weight: 20
    parent: deploy-in-cloud-enterprise
---

For deploying InfluxDB Enterprise clusters on Microsoft Azure Cloud Platform infrastructure, InfluxData provides an [InfluxDB Enterprise app](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/influxdata.influxdb-enterprise-cluster) on the [Azure Cloud Platform Marketplace](https://azuremarketplace.microsoft.com/) that makes the installation and setup process easy and straightforward. Clusters deployed through the Azure Marketplace are ready for production.

> **Note:** The [Deployment Manager templates](https://cloud.google.com/deployment-manager/) used for the InfluxDB Enterprise are [open source](https://github.com/influxdata/azure-resource-manager-influxdb-enterprise). Issues and feature requests for the Marketplace deployment should be [submitted through the related GitHub repository](https://github.com/influxdata/azure-resource-manager-influxdb-enterprise/issues/new) (requires a GitHub account) or by contacting [InfluxData support](mailto:Support@InfluxData.com).

## Prerequisites

This guide requires the following:

- Microsoft Azure account with access to the [Azure Marketplace](https://cloud.google.com/marketplace/).
- A valid InfluxDB Enterprise license key, or [sign up for a free InfluxDB Enterprise trial](?).
- Access to [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal-preview/9n0dx20hk701), cmd.exe, or [PowerShell](https://github.com/PowerShell/PowerShell).

To deploy InfluxDB Enterprise on platforms other than Azure, see [Deploy InfluxDB Enterprise clusters in containers](/enterprise_influxdb/v1.8/install-and-deploy/_index).

## Deploy a cluster

To deploy an InfluxDB Enterprise cluster, log in to your Google Cloud Platform account and navigate to [InfluxData's InfluxDB Enterprise (BYOL)](https://console.cloud.google.com/partner/editor/influxdata-public/influxdb-enterprise-byol) solution in the GCP Marketplace.

Click __Launch on compute engine__ to open up the configuration page.

Copy the InfluxDB Enterprise license key to the __InfluxDB Enterprise license key__ field or [sign up for a free InfluxDB Enterprise trial for GCP](https://portal.influxdata.com/users/gcp) to obtain a license key.

Adjust any other fields as desired. The cluster will only be accessible within the network (or subnetwork, if specified) in which it is deployed. The fields in collapsed sections generally do not need to be altered.

Click __Deploy__ to launch the InfluxDB Enterprise cluster.

The cluster will take up to five minutes to fully deploy. If the deployment does not complete or reports an error, read through the list of [common deployment errors](https://cloud.google.com/marketplace/docs/troubleshooting).

Your cluster is now deployed!

> **Note:** Make sure you save the "Admin username", "Admin password", and "Connection internal IP" values displayed on the screen. They will be required when attempting to access the cluster.

## Access the cluster

The cluster's IP address is only reachable from within the GCP network (or subnetwork) specified in the solution configuration. A cluster can only be reached from instances or services within the same GCP network or subnetwork in which it was provisioned.

Using the GCP Cloud Shell or `gcloud` CLI, create a new instance that will be used to access the InfluxDB Enterprise cluster.

```
gcloud compute instances create influxdb-access --zone us-central1-f --image-family debian-9 --image-project debian-cloud
```

SSH into the instance.

```
gcloud compute ssh influxdb-access
```

On the instance, install the `influx` command line tool via the InfluxDB open source package.

```
wget https://dl.influxdata.com/influxdb/releases/influxdb_1.8.0_amd64.deb
sudo dpkg -i influxdb_1.8.0_amd64.deb
```

Now the InfluxDB Enterprise cluster can be accessed using the following command with "Admin username", "Admin password", and "Connection internal IP" values from the deployment screen substituted for `<value>`.

```
influx -username <Admin username> -password <Admin password> -host <Connection internal IP> -execute "CREATE DATABASE test"

influx -username <Admin username> -password <Admin password> -host <Connection internal IP> -execute "SHOW DATABASES"
```

### Next steps

For an introduction to InfluxDB database and the InfluxData Platform, see [Getting started with InfluxDB](/platform/introduction/getting-started).
