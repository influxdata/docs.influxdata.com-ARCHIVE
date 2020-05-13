---
title: AWS configuration options
aliases:
    - /enterprise_influxdb/v1.7/other-options/config-options/
    - /enterprise_influxdb/v1.7/install-and-deploy/deploying/aws/config-options/
menu:
  enterprise_influxdb_1_7:
    name: AWS configuration options
    weight: 30
    parent: deploy-on-aws
---
When deploying InfluxDB Enterprise on AWS using the template described in [Deploy an InfluxDB Enterprise cluster on Amazon Web Services](/enterprise_influxdb/v1.7/install-and-deploy/aws/setting-up-template), the following configuration options are available:

- **VPC ID**: The VPC ID of your existing Virtual Private Cloud (VPC).
- **Subnets**: A list of SubnetIds in your Virtual Private Cloud (VPC) where nodes will be created. The subnets must be in the same order as the availability zones they reside in. For a list of which availability zones correspond to which subnets, see the [Subnets section of your VPC dashboard](https://console.aws.amazon.com/vpc/home?region=us-east-1#subnets:sort=SubnetId).
- **Availability Zones**: Availability zones to correspond with your subnets above. The availability zones must be in the same order as their related subnets. For a list of which availability zones correspond to which subnets, see the [Subnets section of your VPC dashboard](https://console.aws.amazon.com/vpc/home?region=us-east-1#subnets:sort=SubnetId).
- **SSH Key Name**: An existing key pair to enable SSH access for the instances. For details on how to create a key pair, see [Creating a Key Pair Using Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair).
- **InfluxDB ingress CIDR**: The IP address range that can be used to connect to the InfluxDB API endpoint. To allow all traffic, enter 0.0.0.0/0.
- **SSH Access CIDR**: The IP address range that can be used to SSH into the EC2 instances. To allow all traffic, enter 0.0.0.0/0.
- **InfluxDB Enterprise License Key**: Your InfluxDB Enterprise license key. Applies only to BYOL.
- **InfluxDB Administrator Username**: Your InfluxDB administrator username. Applies only to BYOL.
- **InfluxDB Administrator Password**: Your InfluxDB administrator password. Applies only to BYOL.
- **InfluxDB Enterprise Version**: The version of InfluxDB. Defaults to current version. <!--Is this going to be taken out?-->
- **Telegraf Version**: The version of Telegraf. Defaults to current version.
- **InfluxDB Data Node Disk Size**: The size in GB of the EBS io1 volume each data node. Defaults to 250.
- **InfluxDB Data Node Disk IOPS**: The IOPS of the EBS io1 volume on each data node. Defaults to 1000.
- **DataNodeInstanceType**: The instance type of the data node. Defaults to m5.large.
- **MetaNodeInstanceType**: The instance type of the meta node. Defaults to t3.small.
- **MonitorInstanceType**: The instance type of the monitor node. Defaults to t3.large.
