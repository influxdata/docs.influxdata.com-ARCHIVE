---
title: Chronograf user interface overview
menu:
  chronograf_1_4:
    name: User interface
    weight: 20
    parent: Introduction
---




## Status

### Alert Events per Day - Last 30 Days (graph)

### Alerts - Last 30 days (list)

### News Feed

### Getting Started


## Host list

* # Host(s)
  - Host
  - Status
  - CPU
  - Load
  - Apps
- AutoRefresh Interval (selection list)
- Filter by Host... (field)


## Data explorer

* DB.RetentionPolicy
* Measurement & Tags [Filer (field)]
* Fields
* Group | [selection list]
* Compare: [selection list]
* Fill: [selection list]


## Alerting

###

Alerts
* Name
* Level
* Time
* Host
* Value
*

### Date Range Selection

### Filter Alerts...


### create


## Admin

### Chronograf Admin

#### Current Org

* # User(s) in [Current Org]
  - Username
  - Role
  - Provider
  - Scheme
- Add User (button)

#### All Users

* # User(s) across # Org(s)
  - Username
  - Organizations
  - Provider
  - Scheme
  - SuperAdmin
- Add User (button)

#### All

* # Organization(s)
  - Name
  - Default Role
* Create Organization (button)

#### Org Mappings

* # Map(s)
  - Scheme
  - Provider
  - Provider Org
  - Organization

* Create Mapping (button)

### InfluxDB Admin

#### Databases

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

* Filter Users... (field)
* User
* Password
* Permissions

#### Queries

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

For detail on adding InfluxDB connections, see [Managing InfluxDB connections](/influxdb/v1.4/creating-connections/#managing-influxdb-connections).

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
