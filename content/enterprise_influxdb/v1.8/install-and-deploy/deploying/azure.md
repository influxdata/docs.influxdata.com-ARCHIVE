---
title: Deploy an InfluxDB Enterprise cluster on Azure Cloud Platform
menu:
  enterprise_influxdb_1_8:
    name: Deploy on Azure Cloud Platform
    weight: 20
    parent: deploy-in-cloud-enterprise
---

For deploying InfluxDB Enterprise clusters on Microsoft Azure Cloud Platform infrastructure, InfluxData provides an [InfluxDB Enterprise app](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/influxdata.influxdb-enterprise-cluster) on the [Azure Cloud Platform Marketplace](https://azuremarketplace.microsoft.com/) that makes the installation and setup process easy and straightforward. Clusters are deployed through an Azure Marketplace subscription and are ready for production. Billing occurs through your Azure subscription.

> **Note:** The Azure Resource Manager (ARM) templates used for InfluxDB Enterprise are [open source](https://github.com/influxdata/azure-resource-manager-influxdb-enterprise). Issues and feature requests for the Marketplace deployment should be [submitted through the related GitHub repository](https://github.com/influxdata/azure-resource-manager-influxdb-enterprise/issues/new) (requires a GitHub account) or by contacting [InfluxData support](mailto:Support@InfluxData.com).

## Prerequisites

This guide requires the following:

- Microsoft Azure account with access to the [Azure Marketplace](https://azuremarketplace.microsoft.com/).
- SSH access to the cluster instances

To deploy InfluxDB Enterprise on platforms other than Azure, see [Deploy InfluxDB Enterprise clusters](/enterprise_influxdb/v1.8/install-and-deploy/_index).

## Deploy a cluster

1. Log in to your Azure Cloud Platform account and search for InfluxData's InfluxDB Enterprise solution.

2. On the InfluxDB Enterprise (Official Version) page, click **Create**.

3. Select the subscription to use for your InfluxDB Enterprise cluster, and then select the resource group to access the cluster.

   **Tip:** We recommend creating a new resource group to use for your InfluxDB Enterprise cluster.

4. Select instance details, including the cluster region, user name of the cluster administrator, authentication type. For password authentication, enter your user name and password. For SSH public key authentication, enter your user name and SSH key.

5. Click **Next: Cluster Configuration**, and then enter details including the database admin username and password, the number of meta and data nodes, and the VM size for both meta and data nodes.

6. Click **Next: External Access & Chronograf**, and then do the following:

   - To install Chronograf as a separate node, select **Yes**. Otherwise, select **No**.
   - Select the appropriate access for your load balancer: **External** to allow external Internet access; otherwise, select **Internal**.

7. Click **Next: Review + create** to validate your cluster configuration details. If validation passes, your InfluxDB Enterprise cluster is deployed.

> **Note:** Make sure to save the admin credentials. They will be required when attempting to access the cluster.

## Access the cluster

The cluster's IP address is only reachable within the virtual network (or subnetwork) specified in the solution configuration. A cluster can only be reached from instances or services within the same virtual network or subnetwork in which it was provisioned.

Using your command prompt, create a new instance to use to access the InfluxDB Enterprise cluster.

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
