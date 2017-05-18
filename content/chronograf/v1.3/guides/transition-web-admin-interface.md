---
title: Transition from InfluxDB's Web Admin Interface
menu:
  chronograf_1_3:
    weight: 50
    parent: Guides
---

Versions 1.3+ of [InfluxDB](/influxdb/v1.2/) and [InfluxEnterprise](/enterprise_influxdb/v1.2/) no longer support the [web admin interface](/influxdb/v1.2/tools/web_admin/), the builtin user interface for writing and querying data in InfluxDB.
Chronograf replaces the web admin interface with improved tooling for querying data and database management.

The next sections describe the Chronograf features that relate to the web admin interface:

* [Query Templates](#query-templates)
* [Database and Retention Policy Management](#database-and-retention-policy-management)
* [User Management](#user-management)

## Query Templates

### Web Admin Interface

In the web admin interface, users chose the target database in the top right corner and selected from a set of query templates in the `Query Templates` dropdown.
The templates included queries with no user-provided values (example: [`SHOW MEASUREMENTS`](/influxdb/v1.2/query_language/schema_exploration/#show-measurements)) and queries with user-provided values (example: [`SHOW TAG KEYS FROM "<measurement_name>"`](/influxdb/v1.2/query_language/schema_exploration/#show-tag-keys)).

![WAI Query Templates](/img/chronograf/v1.3/g-admin-webtemplates.png)

### Chronograf

In Chronograf, the same `Query Templates` dropdown appears in the Data Explorer.
To use query templates, select a query from the set of available queries and insert the relevant user-provided values.
Note that unlike the web admin interface, Chronograf does not have a database dropdown; the query must specify the target database.

![Chronograf Query Templates](/img/chronograf/v1.3/g-admin-chronotemplates.png)

## Database and Retention Policy Management

### Web Admin Interface

In the web admin interface, the `Query Template` dropdown was the only way to manage databases and [retention policies](/influxdb/v1.2/concepts/glossary/#retention-policy-rp) (RP):

![WAI DBRP Management](/img/chronograf/v1.3/g-admin-webdbrp.png)

### Chronograf

In Chronograf, the `Admin` page includes a complete user interface for database and RP management.
The `Admin` page allows users to view, create, and delete databases and RPs without having to learn the relevant query syntax.
The GIF below shows the process of creating a database, creating an RP, and deleting that database.

![Chronograf DBRP Management](/img/chronograf/v1.3/g-admin-chronodbrp.gif)

Note that, like the web admin interface, Chronograf's [`Query Templates` dropdown](#chronograf) includes the database- and RP-related queries.

## User Management

### Web Admin Interface

In the web admin interface, the `Query Template` dropdown was the only way to manage users:

![WAI User Management](/img/chronograf/v1.3/g-admin-webuser.png)

### Chronograf

In Chronograf, the `Admin` page includes a complete interface for user management.
The `Admin` page supports both OSS InfluxDB users and InfluxEnterprise users; see the [User Management](/chronograf/v1.3/administration/user-management/) page for more information.
The `Admin` page allows users to:

* View, create, and delete users
* Change user passwords
* Assign and remove permissions to or from a user
* Create, edit, and delete roles (available in InfluxEnterprise only)
* Assign and remove roles to or from a user (available in InfluxEnterprise only)

![Chronograf User Management i](/img/chronograf/v1.3/g-admin-chronousers1.png)

Note that, like the web admin interface, Chronograf's [`Query Templates` dropdown](#chronograf) includes the user-related queries.
