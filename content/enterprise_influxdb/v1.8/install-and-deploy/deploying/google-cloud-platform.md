---
title: Deploy an InfluxDB Enterprise cluster on Google Cloud Platform
aliases:
    - /enterprise_influxdb/v1.8/other-options/google-cloud/
    - /enterprise_influxdb/v1.8/install-and-deploy/google-cloud-platform/
menu:
  enterprise_influxdb_1_8:
    name: GCP
    weight: 30
    parent: deploy-in-cloud-enterprise
---

Complete the following steps to deploy an InfluxDB Enterprise cluster on Google Cloud Platform (GCP):

1. [Verify prerequistes](#verify-prerequisites).
2. [Deploy a cluster](#deploy-a-cluster).
3. [Access the cluster](#access-the-cluster).

After deploying your cluster, see [Getting started with InfluxDB](/platform/introduction/getting-started) for an introduction to InfluxDB database and the InfluxData platform.

>**Note:** InfluxDB Enterprise on GCP is a self-managed product. For a fully managed InfluxDB experience, check out [InfluxDB Cloud 2.0](/https://v2.docs.influxdata.com/v2.0/cloud/get-started/).

## Verify prerequisites

Before deploying an InfluxDB Enterprise cluster on GCP, verify you have the following prerequisites:

- A [Google Cloud Platform (GCP)](https://cloud.google.com/) account with access to the [GCP Marketplace](https://cloud.google.com/marketplace/).
- Access to [GCP Cloud Shell](https://cloud.google.com/shell/) or the [`gcloud` SDK and command line tools](https://cloud.google.com/sdk/).

## Deploy a cluster

1. Log in to your Google Cloud Platform account and go to [InfluxDB Enterprise](https://console.cloud.google.com/marketplace/details/influxdata-public/influxdb-enterprise-vm).

2. Click **Launch** to create or select a project to open up your cluster's configuration page.

3. Adjust cluster fields as needed, including:

  - Deployment name: Enter a name for the InfluxDB Enterprise cluster.
  - InfluxDB Enterprise admin username: Enter the username of your cluster administrator.
  - Zone: Select a region for your cluster.
  - Network: Select a network for your cluster.
  - Subnetwork: Select a subnetwork for your cluster, if applicable.

        > **Note:** The cluster is only accessible within the network (or subnetwork, if specified) where it's deployed.

4. Adjust data node fields as needed, including:

  - Data node instance count: Enter the number of data nodes to include in your cluster (we recommend starting with the default, 2).
  - Data node machine type: Select the virtual machine type to use for data nodes (by default, 4 vCPUs). Use the down arrow to scroll through list. Notice the amount of memory available for the selected machine. To alter the number of cores and memory for your selected machine type, click the **Customize** link. For detail, see our recommended [hardware sizing guidelines](/influxdb/v1.8/guides/hardware_sizing/).
  - (Optional) By default, the data node disk type is SSD Persistent Disk and the disk size is 250 GB. To alter these defaults, click More and update if needed.

        > **Note:** Typically, fields in collapsed sections don't need to be altered.

5. Adjust meta node fields as needed, including:

  - Meta node instance count: Enter the number of meta nodes to include in your cluster (we recommend using the default, 3).
  - Meta node machine type: Select the virtual machine type to use for meta nodes (by default, 1 vCPUs). Use the down arrow to scroll through list. Notice the amount of memory available for the selected machine. To alter the number of cores and memory for your selected machine type, click the **Customize** link.
  - By default, the meta node disk type is SSD Persistent Disk and the disk size is 10 GB. Alter these defaults if needed.

6. (Optional) Adjust boot disk options fields is needed. By default the boot disk type is Standard Persistent disk and boot disk is 10 GB .

7. Accept terms and conditions by selecting both check boxes, and then click **Deploy** to launch the InfluxDB Enterprise cluster.

The cluster may take a few minutes to fully deploy. If the deployment does not complete or reports an error, read through the list of [common deployment errors](https://cloud.google.com/marketplace/docs/troubleshooting).

> **Important:** Make sure you save the "Admin username", "Admin password", and "Connection internal IP" values displayed on the screen. They are required to access the cluster.

## Access the cluster

Access the cluster's IP address from the GCP network (or subnetwork) specified when you deployed the cluster. A cluster can only be reached from instances or services in the same GCP network or subnetwork.

1. In the GCP Cloud Shell or `gcloud` CLI, create a new instance to access the InfluxDB Enterprise cluster.

    ```
    gcloud compute instances create influxdb-access --image-family ubuntu-1804-lts --image-project ubuntu-os-cloud
    ```

2. SSH into the instance.

    ```
    gcloud compute ssh influxdb-access
    ```

3. On the instance, install the `influx` command line tool via the InfluxDB open source package.

    ```
    wget https://dl.influxdata.com/influxdb/releases/influxdb_1.8.10_amd64.deb
    sudo dpkg -i influxdb_1.8.0_amd64.deb
    ```

4. Access the InfluxDB Enterprise cluster using the following command with "Admin username", "Admin password", and "Connection internal IP" values from the deployment screen substituted for `<value>`.

    ```
    influx -username <Admin username> -password <Admin password> -host <Connection internal IP> -execute "CREATE DATABASE test"

    influx -username <Admin username> -password <Admin password> -host <Connection internal IP> -execute "SHOW DATABASES"
    ```
