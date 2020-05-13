---
title: Deploy an InfluxDB Enterprise cluster on Amazon Web Services
aliases:
    - /enterprise_influxdb/v1.7/other-options/setting-up-template/
    - /enterprise_influxdb/v1.7/install-and-deploy/deploying/aws/setting-up-template/
menu:
  enterprise_influxdb_1_7:
    name: Deploy on Amazon Web Services
    weight: 30
    parent: deploy-on-aws
---

Follow these steps to deploy an InfluxDB Enterprise cluster on AWS.

## Step 1: Specify template

After you complete the marketplace flow, you'll be directed to the Cloud Formation Template.

1. In the Prepare template section, select **Template is ready**.
2. In the Specify template section, the **Amazon S3 URL** field is automatically populated with either the BYOL or integrated billing template, depending on the option you selected in the marketplace.
3. Click **Next**.

## Step 2: Specify stack details

1. In the Stack name section, enter a name for your stack.
2. Complete the Network Configuration section:
  - **VPC ID**: Click the dropdown menu to fill in your VPC.
  - **Subnets**: Select three subnets.
  - **Availability Zones**: Select three availability zones to correspond with your subnets above. The availability zones must be in the same order as their related subnets. For a list of which availability zones correspond to which subnets, see the [Subnets section of your VPC dashboard](https://console.aws.amazon.com/vpc/home?region=us-east-1#subnets:sort=SubnetId).
  - **SSH Key Name**: Select an existing key pair to enable SSH access for the instances. For details on how to create a key pair, see [Creating a Key Pair Using Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair).
  - **InfluxDB ingress CIDR**: Enter the IP address range that can be used to connect to the InfluxDB API endpoint. To allow all traffic, enter 0.0.0.0/0.
  - **SSH Access CIDR**: Enter the IP address range that can be used to SSH into the EC2 instances. To allow all traffic, enter 0.0.0.0/0.
3. Complete the **InfluxDB Configuration** section:
  - **InfluxDB Enterprise License Key**: Applies only to BYOL. Enter your InfluxDB Enterprise license key.
  - **InfluxDB Administrator Username**: Applies only to BYOL. Enter your InfluxDB administrator username.
  - **InfluxDB Administrator Password**: Applies only to BYOL. Enter your InfluxDB administrator password.
  - **InfluxDB Enterprise Version**: Defaults to current version. <!--IS this going to be taken out?-->
  - **Telegraf Version**: Defaults to current version.
  - **InfluxDB Data Node Disk Size**: The size in GB of the EBS io1 volume each data node. Defaults to 250.
  - **InfluxDB Data Node Disk IOPS**: The IOPS of the EBS io1 volume on each data node. Defaults to 1000.
4. Review the **Other Parameters** section and modify if needed. The fields in this section are all automatically populated and shouldn't require changes.
  - **DataNodeInstanceType**: Defaults to m5.large.
  - **MetaNodeInstanceType**: Defaults to t3.small.
  - **MonitorInstanceType**: Defaults to t3.large.
5. Click **Next**.

## Step 3: Configure stack options

1. In the **Tags** section, enter any key-value pairs you want to apply to resources in the stack.
2. Review the **Permissions** and **Advanced options** sections. In most cases, there's no need to modify anything in these sections.
3. Click **Next**.

## Step 4: Review

1. Review the configuration options for all of the above sections.
2. In the **Capabilities** section, check the box acknowledging that AWS CloudFormation might create IAM resources.
3. Click **Create stack**.
