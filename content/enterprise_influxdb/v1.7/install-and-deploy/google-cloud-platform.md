---
title: Deploy an InfluxDB Enterprise cluster on Google Cloud Platform
aliases:
    - /enterprise_influxdb/v1.7/other-options/google-cloud/
    - /enterprise_influxdb/v1.7/other_installation/google_marketplace/
menu:
  enterprise_influxdb_1_7:
    name: Deploy on GCP
    weight: 30
    parent: Install and deploy
---

Complete the following steps to deploy an InfluxDB Enterprise cluster on Google Cloud Platform (GCP):

1. [Verify prerequistes](#verify-prerequisites).
2. [Deploy a cluster](#deploy-a-cluster).
2. [Access the cluster](#access-the-cluster).

After deploying your cluster, see [Getting started with InfluxDB](/platform/introduction/getting-started) for an introduction to InfluxDB database and the InfluxData platform.

## Verify prerequisites

Before deploying an InfluxDB Enterprise cluster on GCP, verify you have the following prerequisites:

- A [GCP](https://console.cloud.google.com/) account with access to the [GCP Marketplace](https://console.cloud.google.com/marketplace).
- A valid InfluxDB Enterprise license key, or [sign up for a free InfluxDB Enterprise trial for GCP](https://portal.influxdata.com/users/gcp).
- Access to [GCP Cloud Shell](https://cloud.google.com/shell/) or the [`gcloud` SDK and command line tools](https://cloud.google.com/sdk/).

## Deploy a cluster

1. Log in to your Google Cloud Platform account and go to [InfluxDB Enterprise](https://console.cloud.google.com/marketplace/details/influxdata-public/influxdb-enterprise-vm).

    ![GCP InfluxDB Enterprise page](/img/enterprise/gcp/intro-1.png)

2. Click **Launch** to create or select a project to open up your cluster's configuration page.

    ![GCP InfluxDB Enterprise configuration page](/img/enterprise/gcp/intro-2.png)

3. Copy the InfluxDB Enterprise license key to the __InfluxDB Enterprise license key__ field or [sign up for a free InfluxDB Enterprise trial for GCP](https://portal.influxdata.com/users/gcp) to obtain a license key.

4. Adjust other fields as needed. (Typically, fields in collapsed sections don't need to be altered).
  The cluster is only accessible within the network (or subnetwork, if specified) where it's deployed.

5. Click **Deploy** to launch the InfluxDB Enterprise cluster.

  <!--![GCP InfluxDB Enterprise deployment pending page](/img/enterprise/gcp/intro-3.png) -->

The cluster may take a few minutes to fully deploy. If the deployment does not complete or reports an error, read through the list of [common deployment errors](https://cloud.google.com/marketplace/docs/troubleshooting).

  <!-- ![GCP InfluxDB Enterprise deployment complete page](/img/enterprise/gcp/intro-4.png) -->

> **Important:** Make sure you save the "Admin username", "Admin password", and "Connection internal IP" values displayed on the screen. They are required to access the cluster.

## Access the cluster

Access the cluster's IP address from the GCP network (or subnetwork) specified when you deployed the cluster. A cluster can only be reached from instances or services in the same GCP network or subnetwork.

1. In the GCP Cloud Shell or `gcloud` CLI, create a new instance to access the InfluxDB Enterprise cluster.

  ```
  gcloud compute instances create influxdb-access --zone us-central1-f --image-family debian-9 --image-project debian-cloud
  ```

2. SSH into the instance.

  ```
  gcloud compute ssh influxdb-access
  ```

3. On the instance, install the `influx` command line tool via the InfluxDB open source package.

  ```
  wget https://dl.influxdata.com/influxdb/releases/influxdb_1.7.3_amd64.deb
  sudo dpkg -i influxdb_1.7.3_amd64.deb
  ```

4. Access the InfluxDB Enterprise cluster using the following command with "Admin username", "Admin password", and "Connection internal IP" values from the deployment screen substituted for `<value>`.

```
influx -username <Admin username> -password <Admin password> -host <Connection internal IP> -execute "CREATE DATABASE test"

influx -username <Admin username> -password <Admin password> -host <Connection internal IP> -execute "SHOW DATABASES"
```
