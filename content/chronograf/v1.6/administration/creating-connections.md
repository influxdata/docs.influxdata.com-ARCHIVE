---
title: Creating InfluxDB and Kapacitor connections
description: Creating and managing InfluxDB and Kapacitor connections for use with Chronograf.
menu:
  chronograf_1_6:
    name: Creating InfluxDB and Kapacitor connections
    weight: 50
    parent: Administration
---

Connections to InfluxDB and Kapacitor can be configured through the Chronograf user interface (UI) or with JSON configuration files.

## Managing InfluxDB connections using the Chronograf UI

To create an InfluxDB connection in the Chronograf UI:

1. Open Chronograf and click **Configuration** (wrench icon) in the navigation menu.
2. Click **Add Connection**.

  ![Chronograf connections landing page](/img/chronograf/v1.6/connection-landing-page.png)

3. Enter values for the following fields:

    ![InfluxDB connection credentials](/img/chronograf/v1.6/connection-influxdb.png)

    * **Connection String**: Enter the hostname or IP address of the InfluxDB instance and the port. The field is prefilled with  `http://localhost:8086`.
    * **Name**: Enter the name for this connection.
    * **Username**: Enter the username that will be shared for this connection.
      *Only required if [authorization is enabled](/influxdb/latest/administration/authentication_and_authorization/) on the InfluxDB instance to which you're connecting.*
    * **Password**: Enter the password.
      *Only required if [authorization is enabled](/influxdb/latest/administration/authentication_and_authorization/) on the InfluxDB instance to which you're connecting.*
    * **Telegraf Database**: Enter the name of the Telegraf database. The field is prefilled with `telegraf`.
    * **Default Retention Policy**: Enter the name of the default [retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp). If none is provided, it assumes `autogen`.
    * **Make this the default source**: By default, this option is selected and this InfluxDB connection will be used when Chronograf is launched.

4. Click **Add Connection**.
   If the connection is valid, the Configuration page displays, including the new InfluxDB connection.
   If the connection cannot be created, the following error message appears:
   "Unable to create source: Error contacting source."
   If this occurs, ensure all connection credentials are correct and that the InfluxDB instance is running and accessible.

>***Note:*** The **Switch Orgs** button at the bottom of the page will not save any fields you have filled out, but will open a list of your organizations to allow you to log into a different organization.

## Managing InfluxDB connections using .src files
Chronograf stores InfluxDB connection details `.src` files that can also be created manually.
`.src` files are simple JSON files that contain key-value paired connection details.
The location of `.src` files is defined by the [`--resources-path`](/chronograf/v1.6/administration/config-options/#resources-path)
command line option, which is, by default, the same as the [`--canned-path`](/chronograf/v1.6/administration/config-options/#canned-path-c).
An `.src` files contains the details for a single InfluxDB connection.

Create a new file named `example.src` (the filename is arbitrary) and place it at Chronograf's `resource-path`.
All `.src` files should contain the following:

```json
{
  "id": "10000",
  "name": "My InfluxDB",
  "username": "test",
  "password": "test",
  "url": "http://localhost:8086",
  "type": "influx",
  "insecureSkipVerify": false,
  "default": true,
  "telegraf": "telegraf",
  "organization": "example_org"
}
```

#### `id`  
A unique, stringified non-negative integer.
Using a 4 or 5 digit number is recommended to avoid interfering with existing datasource IDs.

#### `name`  
Any string you want to use as the display name of the source.

#### `username`  
Username used to access the InfluxDB server or cluster.
*Only required if [authorization is enabled](/influxdb/latest/administration/authentication_and_authorization/) on the InfluxDB instance to which you're connecting.*

#### `password`  
Password used to access the InfluxDB server or cluster.
*Only required if [authorization is enabled](/influxdb/latest/administration/authentication_and_authorization/) on the InfluxDB instance to which you're connecting.*

#### `url`  
URL of the InfluxDB server or cluster.

#### `type`  
Defines the type or distribution of InfluxDB to which you are connecting.
Below are the following options:

| InfluxDB Distribution | `type` Value        |
| --------------------- | ------------        |
| InfluxDB OSS          | `influx`            |
| InfluxDB Enterprise   | `influx-enterprise` |

#### `insecureSkipVerify`  
Skips the SSL certificate verification process.
Set to `true` if you are using a self-signed SSL certificate on your InfluxDB server or cluster.

#### `default`  
Set to `true` if you want the connection to be the default data connection used upon first login.

#### `telegraf`  
The name of the Telegraf database on your InfluxDB server or cluster.

#### `organization`  
The ID of the organization you want the data source to be associated with.

### Environment variables in .src files
`.src` files support the use of environment variables to populate InfluxDB connection details.
Environment variables can be loaded using the `"{{ .VARIABLE_KEY }}"` syntax:

```JSON
{
  "id": "10000",
  "name": "My InfluxDB",
  "username": "{{ .INFLUXDB_USER }}",
  "password": "{{ .INFLUXDB_PASS }}",
  "url": "{{ .INFLUXDB_URL }}",
  "type": "influx",
  "insecureSkipVerify": false,
  "default": true,
  "telegraf": "telegraf",
  "organization": "example_org"
}
```

## Managing Kapacitor connections using the Chronograf UI

Kapacitor is the data processing component of the TICK stack.
To use Kapacitor in Chronograf, create Kapacitor connections and configure alert endpoints.
To create a Kapacitor connection using the Chronograf UI:

1. Open Chronograf and click **Configuration** (wrench icon) in the navigation menu.
2. Next to an existing [InfluxDB connection](#managing-influx-db-connections), click **Add Kapacitor Connection** if there are no existing Kapacitor connections or select **Add Kapacitor Connection** in the **Kapacitor Connection** dropdown list.

![Add a new Kapacitor connection in Chronograf](/img/chronograf/v1.6/connection-kapacitor.png)

3. In the **Connection Details** section, enter values for the following fields:

    ![Add a new Kapacitor connection details in Chronograf](/img/chronograf/v1.6/connection-kapacitor-details.png)

    * **Kapacitor URL**: Enter the hostname or IP address of the Kapacitor instance and the port. The field is prefilled with  `http://localhost:9092`.
    * **Name**: Enter the name for this connection.
    * **Username**: Enter the username that will be shared for this connection.
      *Only required if [authorization is enabled](/kapacitor/latest/administration/security/#kapacitor-authentication-and-authorization) on the Kapacitor instance or cluster to which you're connecting.*
    * **Password**: Enter the password.
      *Only required if [authorization is enabled](/kapacitor/latest/administration/security/#kapacitor-authentication-and-authorization) on the Kapacitor instance or cluster to which you're connecting.*

4. Click **Connect**. If the connection is valid, the message "Kapacitor Created! Configuring endpoints is optional." appears. To configure alert endpoints, see [Configuring alert endpoints](/chronograf/v1.6/guides/configuring-alert-endpoints/).

## Managing Kapacitor connections using .kap files

Chronograf stores Kapacitor connection details `.kap` files that can also be created manually.
`.kap` files are simple JSON files that contain key-value paired connection details.
The location of `.kap` files is defined by the `--resources-path` command line option, which is, by default, the same as the [`--canned-path`](/chronograf/v1.6/administration/config-options/#canned-path-c).
A `.kap` files contains the details for a single InfluxDB connection.

Create a new file named `example.kap` (the filename is arbitrary) and place it at Chronograf's `resource-path`.
All `.kap` files should contain the following:

```json
{
  "id": 10000,
  "srcID": 10000,
  "name": "My Kapacitor",
  "url": "http://localhost:9092",
  "active": true,
  "organization": "example_org"
}
```

#### `id`
A unique, stringified non-negative integer.
Using a 4 or 5 digit number is recommended to avoid interfering with existing datasource IDs.

#### `srcID`
The unique, stringified non-negative integer `id` of the InfluxDB server or cluster with which the Kapacitor service is associated.

#### `name`
Any string you want to use as the display name of the Kapacitor connection.

#### `url`
URL of the Kapacitor server.

#### `active`
If `true`, specifies that this is the Kapacitor connection that should be used when displaying Kapacitor-related information in Chronograf.

#### `organization`
The ID of the organization you want the Kapacitor connection to be associated with.

### Environment variables in .kap files
`.kap` files support the use of environment variables to populate Kapacitor connection details.
Environment variables can be loaded using the `"{{ .VARIABLE_KEY }}"` syntax:

```JSON
{
  "id": 10000,
  "srcID": 10000,
  "name": "My Kapacitor",
  "url": "{{ .KAPACITOR_URL }}",
  "active": true,
  "organization": "example_org"
}
```
