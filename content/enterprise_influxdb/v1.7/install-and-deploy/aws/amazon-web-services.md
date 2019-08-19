---
title: Deploy an InfluxDB Enterprise cluster on Amazon Web Services
menu:
  enterprise_influxdb_1_7:
    name: Deploy on Amazon Web Services
    weight: 20
    parent: deploy-in-cloud-enterprise
---


1. Log into the AWS console.
2. From Services, selext CloudFormation.
3. In the lefthand navigation menu, select **Stacks**.
4. Click **Create Stack**.

## Step 1: Specify template

1. In the Prepare template section, select **Template is ready**.
2. In the Specify template section, upload the template. ???
3. Click **Next**.

## Step 2: Specify stack details

In the Stack name section, enter a name for your stack.
Parameters section:

  - Network Configuration.
      - VPC ID: Click the dropdown menu to fill in your VPC. (??? is this a secret? gunnar)
      - Subnets: Select three subnets.
      - SSH Key Name: Create a key pair at Services > EC2 > Key Pairs.
      - SSH Access CIDR: Enter 0.0.0.0/0 to allow all traffic.

    - InfluxDB Configuration.
      - InfluxDB Enterprise License Key: BYOL only?
      - InfluxDB Administrator Username:
      - InfluxDB Administrator Password:
      - InfluxDB Enterprise Version: Defaults to current version
      - Telegraf Version: Defaults to current version
      - InfluxDB Data Node Disk Size: Defaults to 250.
      - InfluxDB Data Node Disk IOPS: Defaults to 1000.

    - Other parameters
      - Availability Zones: You must select these in the same order as the subnets. ??? What does this mean again? And they also automatically alphabetize themselves still.
      - DataNodeInstanceType: Defaults to m5.large
      - MetaNodeInstanceType: t3.small
      - MonitorInstanceType: t3- 
