---
title: Getting Started
menu:
  enterprise_1:
    weight: 20
    parent: Introduction
---

Now that you successfully [installed and set up](/enterprise/v1.0/introduction/installation/) InfluxEnterprise, visit
`http://<your_web_console_server's_IP_address>:3000` to get started with the
web console!

When you first visit the web console, it prompts you to create a Global
Admin user as well as your first database.

#### 1. Create a Global Admin user

The first user that you create is assigned to the Global Admin role.
The Global Admin role is one of InfluxEnterprise’s built-in roles.
It comes with every permission available, including the ability to add and
remove nodes, copy shards, read data, write data, delete data, and create users
and roles.

![Create Global Admin](/img/enterprise/create_global_admin.png)

#### 2. Create your first database

Next, create your first InfluxEnterprise database.
A database is a logical container for retention policies, continuous queries,
and time series data.

The first input sets the database name.
Feel free to call your database anything you want.

The next three inputs determine the `DEFAULT` retention policy for your
database. A retention policy describes how long InfluxDB keeps your data
(the Duration) and how many copies of your data are stored in the cluster
(the Replication Factor).
A database can have several retention policies; InfluxDB writes to the `DEFAULT`
retention policy if the write does not specify a retention policy.

Note that this step is optional. Click `Skip` if you’d like to hold off on
creating a database.
You can always create one later.

![Create database](/img/enterprise/create_database.png)
