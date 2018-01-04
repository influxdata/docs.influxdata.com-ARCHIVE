---
title: Managing Chronograf users
menu:
  chronograf_1_4:
    menu: Managing Chronograf users
    weight: 30
    parent: Administration
---

**On this page**

Managing Chronograf users and roles
* User roles
* SuperAdmin status
* Creating users
* Updating users
* Removing users

## Managing Chronograf users and roles

Chronograf includes four user roles and a SuperAdmin status

* `member`
* `viewer`
* `editor`
* `admin`




## Chronograf user roles

|            | member | viewer | editor | admin |
-------------|--------|--------|--------|-------|--
Dashboards  |  ---   |  V     | CVUR   | CVUR  |
InfluxDB sources  |  --- | V  | CVUR  |  CVUR |
Kapacitor alerts  |  --- | CVUR  | CVUR  |  CVUR |
Users  |   |  |   |  CVUR |


#### Member (role:`member`)

Members are Chronograf users who have been added to organizations without any specified functional roles. Although a member can authenticate, the member cannot access any resources within an organization.

By default, new organizations have a default role of `member`.


#### Viewer (role:`viewer`)

Viewers are Chronograf users who can access resources and use Status, Host List, Data Explorer, Dashboards, and Alerting:

* Status: view
* Host List:
* Data Explorer
* Dashboards: view
* Alerting: create, update
* Sources (InfluxDB): view
* Create and modify Kapacitor alerts
* Access and use Status Page, Host List, Data Explorer, and Alerting.

#### Editor (role:`editor`)

Editors are Chronograf users who can access and use Status Page, Host List, Data Explorer, and Alerting.

* Access resources restricted to their organization
* View, create, update, and remove dashboards
* View, create, update, and remove InfluxDB sources
* Create and modify Kapacitor alerts
*

#### Administrator (role:`admin`)

Administrators are users who can perform administrator functions within an organization. Users in the `admin` role can:

* Access resources restricted to their organization
* View, create, update, and remove dashboards
* View, create, update, and remove sources
* Create, view, and remove users
* Create and update Kapacitor alerts
* Access and use Status Page, Host List, Data Explorer, and Alerting.

####  SuperAdmin (status)

SuperAdmins are unique Chronograf administrators who can perform administrator functions within and across organizations. A user with SuperAdmin status can perform the following operations that are unavailable for other roles:

* Create, view, update, and remove organizations
* Create, view, and remove users in any organizations

> ***Note:*** When a SuperAdmin is added as a member of an organization, the SuperAdmin is restricted to access determined by the standard roles (viewer, editor, and admin). This allows a SuperAdmin to be able to comply with expectations of not accessing resources within a specific organization and, if done, that an audit trail would show access of the resources.
