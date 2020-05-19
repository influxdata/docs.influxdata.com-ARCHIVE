---
title: Deploy an InfluxDB Enterprise cluster on Azure Cloud Platform
menu:
  enterprise_influxdb_1_8:
    name: Azure
    weight: 20
    parent: deploy-in-cloud-enterprise
---

For deploying InfluxDB Enterprise clusters on Microsoft Azure cloud computing service, InfluxData provides an [InfluxDB Enterprise application](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/influxdata.influxdb-enterprise-cluster) on the [Azure Marketplace](https://azuremarketplace.microsoft.com/) that makes the installation and setup process easy and straightforward. Clusters are deployed through an Azure Marketplace subscription and are ready for production. Billing occurs through your Azure subscription.

> **Note:** The Azure Resource Manager (ARM) templates used in the InfluxDB Enterprise offering on Azure Marketplace are [open source](https://github.com/influxdata/azure-resource-manager-influxdb-enterprise). Issues and feature requests for the Azure Marketplace deployment should be [submitted through the related GitHub repository](https://github.com/influxdata/azure-resource-manager-influxdb-enterprise/issues/new) (requires a GitHub account) or by contacting [InfluxData Support](mailto:support@influxdata.com).

## Prerequisites

This guide requires the following:

- Microsoft Azure account with access to the [Azure Marketplace](https://azuremarketplace.microsoft.com/).
- SSH access to cluster instances.

To deploy InfluxDB Enterprise clusters on platforms other than Azure, see [Deploy InfluxDB Enterprise](/enterprise_influxdb/v1.8/install-and-deploy/_index).

## Deploy a cluster

1. Log in to your Azure Cloud Platform account and navigate to [InfluxData's InfluxDB Enterprise (Official Version) application](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/influxdata.influxdb-enterprise-cluster) on Azure Marketplace.

2. Click **Get It Now**, read and agree to the terms of use, and then click **Continue**. Once in the Azure Portal, click **Create**.

3. Select the subscription to use for your InfluxDB Enterprise cluster. Then select a resource group and region where the cluster resources will be deployed.

    > **Tip:** If you do not know which resource group to use, we recommend creating a new one for the InfluxDB Enterprise cluster.

4. In the Instance Details section, set the OS username and SSH authentication type you will use to access the cluster VMs. For password authentication, enter a username and password. For SSH public key authentication, copy an SSH public key. The cluster VMs are built from an Ubuntu base image.

5. Click **Next: Cluster Configuration**, and then enter details including the InfluxDB admin username and password, the number of meta and data nodes, and the VM size for both meta and data nodes. We recommend using the default VM sizes and increasing the data node VM size if you anticipate needing more resources for your workload.

    > **Note:** Make sure to save the InfluxDB admin credentials. They will be required to access InfluxDB.

6. Click **Next: External Access & Chronograf**, and then do the following:

   - To create a separate instance to monitor the cluster and run [Chronograf](https://www.influxdata.com/time-series-platform/chronograf/), select **Yes**. Otherwise, select **No**.

          > **Note:** Adding a Chronograf instance will also configure that instance as an SSH bastion. All cluster instances will only be accessible through the Chronograf instance.

   - Select the appropriate access for the InfluxDB load balancer: **External** to allow external Internet access; otherwise, select **Internal**.

        {{% warn %}}The cluster uses HTTP by default. You must configure HTTPS after the cluster has been deployed.{{% /warn %}}

7. Click **Next: Review + create** to validate your cluster configuration details. If validation passes, your InfluxDB Enterprise cluster is deployed.

    > **Note:** Some Azure accounts may have vCPU quotas limited to 10 vCPUs available in certain regions. Selecting VM sizes larger than the default can cause a validation error for exceeding the vCPU limit for the region.

## Access InfluxDB

Once the cluster is created, access the InfluxDB API at the IP address associated with the load balancer resource (`lb-influxdb`). If external access was configured during setup, the load balancer is publicly accessible. Otherwise, the load balancer is only accessible to the cluster's virtual network.

Use the load balancer IP address and the InfluxDB admin credentials entered during the cluster creation to interact with InfluxDB Enterprise via the [`influx` CLI](https://docs.influxdata.com/influxdb/v1.8/tools/shell/) or use the InfluxDB's [query](https://docs.influxdata.com/influxdb/v1.8/guides/query_data/) and [write](https://docs.influxdata.com/influxdb/v1.8/guides/write_data/) HTTP APIs.

## Access the cluster

The InfluxDB Enterprise cluster's VMs are only reachable within the virtual network using the SSH credentails provided during setup.

If a Chronograf instance has been added to the cluster, the Chronograf instance is publically accessible via SSH. The other VMs can then be reached from the Chronograf VM.

### Next steps

For an introduction to the InfluxDB database and the InfluxData Platform, see [Getting started with InfluxDB](/platform/introduction/getting-started).
