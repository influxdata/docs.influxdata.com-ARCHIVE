---
title: Creating InfluxDB and Kapacitor connections
menu:
  chronograf_1_4:
    name: Creating InfluxDB and Kapacitor connections
    weight: 30
    parent: Administration
---

## Managing InfluxDB connections

**To create an InfluxDB connection:**

1. Open Chronograf and click **Configuration** (gear icon) in the navigation menu. The Configuration page displays.
2. Click the **Add Source** button. The Add a New Source page opens.
3. Enter values for the following required fields:

* **Connection String**: Enter the hostname or IP address of the InfluxDB instance and the port. The field is prefilled with  `http://localhost:8086`.
* **Name**: Enter the name for this connection.
* **Username**: Enter the username that will be shared for this connection.
* **Password**: Enter the password.
* **Telegraf Database**: Enter the name of the Telegraf database. The field is prefilled with `telegraf`.
* **Make this the default source**: By default, this option is selected and this InfluxDB connection will be used when Chronograf is launched.

4. Click the **Add Source** button. If the connection is valid, the Configuration page displays, including the new InfluxDB connection. If the connection cannot be created, the following error message appears: "Unable to create source: Error contacting source."
5. To specify an active Kapacitor connection, you need to [create Kapacitor connections](#creating-kapacitor-connections) associated with this InfluxDB connection.

>***Note:*** The **Switch Orgs** button at the bottom of the page will not save any fields you have filled out, but will open a list of your organizations to allow you to log into a different organization.

**To edit an InfluxDB connection:**

1. Open Chronograf and click **Configuration** (gear icon) in the navigation menu. The Configuration page displays the available InfluxDB connections.
2. Click the source name that you want to edit and the **Edit Source** page displays.
3. Make any changes and click **Save Changes**. The Configuration page displays.


## Managing Kapacitor connections

Kapacitor is the data processing component of the TICK stack. To use Kapacitor in Chronograf, you need to create Kapacitor connections and configure alert endpoints.

**To create a Kapacitor connection:**

1. Open Chronograf and click **Configuration** (gear icon) in the navigation menu. The Configuration page displays.
2. Click the **Add Config** button for the InfluxDB connection if there are no existing Kapacitor connections or select **Add Kapacitor** in the **Active Kapacitor** dropdown list. The **Configure Kapacitor** page displays.
3. In the **Connection Details** section, enter values for the following required fields:

* **Kapacitor URL**: Enter the hostname or IP address of the Kapacitor instance and the port. The field is prefilled with  `http://localhost:9092`.
* **Name**: Enter the name for this connection.
* **Username**: Enter the username that will be shared for this connection.
* **Password**: Enter the password.

4. Click **Connect**. If the connection is valid, the message "Kapacitor Created! Configuring endpoints is optional." appears. To configure alert endpoints, see [Configuring alert endpoints](#configuring-alert-endpoints).
