---
title: Deploy an InfluxDB Enterprise cluster on Google Cloud Platform
aliases:
    - /enterprise_influxdb/v1.6/other-options/google-cloud/
menu:
  enterprise_influxdb_1_6:
    name: Deploy on Google Cloud Platform
    weight: 20
    parent: deploy-in-cloud-enterprise
---

For deploying InfluxDB Enterprise clusters on Google Cloud Platform (GCP) infrastructure, InfluxData provides an [InfluxDB Enterprise bring-your-own-license (BYOL) solution](https://console.cloud.google.com/marketplace/details/influxdata-public/influxdb-enterprise-byol) on the [Google Cloud Platform Marketplace](https://cloud.google.com/marketplace/) that makes the installation and setup process easy and straightforward. Clusters deployed through the GCP Marketplace are ready for production.

> **Note:** The [Deployment Manager templates](https://cloud.google.com/deployment-manager/) used for the InfluxDB Enterprise BYOL solution are [open source](https://github.com/influxdata/google-deployment-manager-influxdb-enterprise). Issues and feature requests for the Marketplace deployment should be [submitted through the related GitHub repository](https://github.com/influxdata/google-deployment-manager-influxdb-enterprise/issues/new) (requires a GitHub account) or by contacting [InfluxData support](mailto:Support@InfluxData.com).

## Prerequisites

This guide requires the following:

- A [Google Cloud Platform (GCP)](https://cloud.google.com/) account with access to the [GCP Marketplace](https://cloud.google.com/marketplace/).
- A valid InfluxDB Enterprise license key, or [sign up for a free InfluxDB Enterprise trial for GCP](https://portal.influxdata.com/users/gcp).
- Access to [GCP Cloud Shell](https://cloud.google.com/shell/) or the [`gcloud` SDK and command line tools](https://cloud.google.com/sdk/).

To deploy InfluxDB Enterprise on platforms other than GCP, please see [InfluxDB Enterprise installation options](/enterprise_influxdb/v1.6/introduction/installation_guidelines).

## Deploy a cluster

To deploy an InfluxDB Enterprise cluster, log in to your Google Cloud Platform account and navigate to [InfluxData's InfluxDB Enterprise (BYOL)](https://console.cloud.google.com/partner/editor/influxdata-public/influxdb-enterprise-byol) solution in the GCP Marketplace.

![GCP InfluxDB Enterprise solution page](/img/enterprise/gcp/byol-intro-1.png)

Click __Launch on compute engine__ to open up the configuration page.

![GCP InfluxDB Enterprise configuration page](/img/enterprise/gcp/byol-intro-2.png)

Copy the InfluxDB Enterprise license key to the __InfluxDB Enterprise license key__ field or [sign up for a free InfluxDB Enterprise trial for GCP](https://portal.influxdata.com/users/gcp) to obtain a license key.

Adjust any other fields as desired. The cluster will only be accessible within the network (or subnetwork, if specified) in which it is deployed. The fields in collapsed sections generally do not need to be altered.

Click __Deploy__ to launch the InfluxDB Enterprise cluster.

![GCP InfluxDB Enterprise deployment pending page](/img/enterprise/gcp/byol-intro-3.png)

The cluster will take up to five minutes to fully deploy. If the deployment does not complete or reports an error, read through the list of [common deployment errors](https://cloud.google.com/marketplace/docs/troubleshooting).

![GCP InfluxDB Enterprise deployment complete page](/img/enterprise/gcp/byol-intro-4.png)

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
wget https://dl.influxdata.com/influxdb/releases/influxdb_1.6.3_amd64.deb
sudo dpkg -i influxdb_1.6.3_amd64.deb
```

Now the InfluxDB Enterprise cluster can be accessed using the following command with "Admin username", "Admin password", and "Connection internal IP" values from the deployment screen substituted for `<value>`.

```
influx -username <Admin username> -password <Admin password> -host <Connection internal IP> -execute "CREATE DATABASE test"

influx -username <Admin username> -password <Admin password> -host <Connection internal IP> -execute "SHOW DATABASES"
```

### Next steps

For an introduction to InfluxDB database and the InfluxData Platform, see [Getting started with InfluxDB](/platform/introduction/getting-started).
