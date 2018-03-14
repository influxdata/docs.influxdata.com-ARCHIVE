---
title: Chronograf user interface overview
menu:
  chronograf_1_4:
    name: User interface
    weight: 20
    parent: guides
---


This page covers user and administrator functionality available using the Chronograf user interface.



### Alert Events per Day - Last 30 Days (graph)

### Alerts - Last 30 days (list)

### News Feed

### Getting Started

## Status

![Status display](/img/chronograf/chrono-status.png)


## Host list

![Host List (screenshot)](/img/chronograf/chrono-cluster-hostlist.png)

* # Host(s)
  - Host
  - Status
  - CPU
  - Load
  - Apps
- AutoRefresh Interval (selection list)
- Filter by Host... (field)


#### What does the status column indicate on the Host List page?

The status icon is a high-level measure of your host's health.
If Chronograf has not received data from a host for the past minute,
the status icon is red.
If Chronograf has received data from a host within the past minute,
the status icon is green.

#### Why is my host's status red when data are still arriving?

There are several possible explanations for an inaccurate red status icon:

The status icon depends on your host's local time in UTC.
Use the Network Time Protocol (NTP) to synchronize time between hosts;
if the hosts’ clocks aren’t synchronized with NTP, the status icon can be inaccurate.

The status icon turns red when Chronograf has not received data from a host for the past minute.
Chronograf uses data from Telegraf to perform that calculation.
By default, Telegraf sends data in ten-second intervals; you can change that interval setting in Telegraf's [configuration file](/telegraf/latest/administration/configuration/).
If you configure the setting to an interval that's greater than one minute, Chronograf assumes that the host is not reporting data and changes the status icon to red.


## Data Explorer

![Data Explorer](/img/chronograf/chrono-data-explorer.png)

* DB.RetentionPolicy
* Measurement & Tags [Filer (field)]
* Fields
* Group | [selection list]
* Compare: [selection list]
* Fill: [selection list]

## Dashboards

![Dashboard display](/img/chronograf/chrono-dashboard-display.png)

![Dashboard edit](/img/chronograf/chrono-dashboard-edit.png)

![Dashboard listing](/img/chronograf/chrono-dashboards-listing.png)

### Why does the query builder break after I add my template variable to a query?

Currently, adding a [template variable](/chronograf/latest/guides/dashboard-template-variables/) to a cell's query renders the query builder unusable.
If you click on a database in the builder's **Databases** column after adding a template variable to your query, Chronograf simply overwrites your existing query.
Note that this behavior does not apply to Chronograf's pre-created template variable: `:dashboardTime:`.

This is a known issue and it will be fixed in a future release.



## Alerting

### Alerts

![Databases](/img/chronograf/chrono-alerts.png)

Alerts
* Name
* Level
* Time
* Host
* Value

### Date Range Selection

### Filter Alerts...


### create


## Admin

### Chronograf Admin

![Current Org](/img/chronograf/chrono-admin-current-org.png)

#### Current Org

![Current Org](/img/chronograf/chrono-admin-current-org.png)

* # User(s) in [Current Org]
  - Username
  - Role
  - Provider
  - Scheme
- Add User (button)

See [Managing Chronograf organizations](/chronograf/v1.4/administration/managing-organizations)

#### All Users

![All Users](/img/chronograf/chrono-admin-all-users.png)

* # User(s) across # Org(s)
  - Username
  - Organizations
  - Provider
  - Scheme
  - SuperAdmin
- Add User (button)

See [Managing Chronograf users](/chronograf/v1.4/administration/managing-chronograf-users)

#### All Orgs

![All Orgs](/img/chronograf/chrono-admin-all-orgs.png)

* # Organization(s)
  - Name
  - Default Role
* Create Organization (button)

See [Managing Chronograf organizations](/chronograf/v1.4/administration/managing-organizations)

#### Org Mappings

![Org Mappings](/img/chronograf/chrono-admin-org-mappings.png)

* # Map(s)
  - Scheme
  - Provider
  - Provider Org
  - Organization

* Create Mapping (button)

See [Mapping organizations](/chronograf/v1.4/administration/managing-organizations/#mapping-organizations)

### InfluxDB Admin

#### Databases

![InfluxDB Databases](/img/chronograf/chrono-influxdb-admin-databases.png)

* # Database(s)
  - Database name
  - Retention Policy
    - Add Retention Policy (button)
      - Retention Policy
      - Duration
      - Monitor
        - Delete Monitor (button)
      - Create/Cancel (buttons)
  - Duration
- Create Database (button)

#### Users

![InfluxDB Users](/img/chronograf/chrono-influxdb-admin-users.png)

* Filter Users... (field)
* User
* Password
* Permissions

See [Managing InfluxDB users](/chronograf/v1.4/administration/managing-influxdb-users)

#### Queries

![InfluxDB Queries](/img/chronograf/chrono-influxdb-admin-queries.png)

* Database
* Query
* Running
* Kill (button)

## Configuration

* Connections for \[Default\]
  - InfluxDB Connection
  - Kapacitor Connection
- Add Connection (button)

### Add a New InfluxDB Connection

For details on adding InfluxDB connections, see [Managing InfluxDB connections](/influxdb/v1.4/creating-connections/#managing-influxdb-connections).

* Connection String
* Name
* Username
* Password
* Telegraf Database
* Make this the default connection
* Add Connection (button)
* Switch Orgs (button)

## \[User\]

* Account
  - Authentication
  - Log out
* Switch Organizations
* Default (member)
