---
title: Managing Chronograf roles
menu:
  chronograf_1_4:
    weight: 30
    parent: Administration
---


## Chronograf user roles

Chronograf includes the following user roles, listed in order of increasing persmission levels:

* `member`
* `viewer`
* `editor`
* `admin`
* SuperAdmin

Within an organization, the valid roles are member, viewer, editor, and admin. In order to manage organizations and users across all organizations, the SuperAdmin role allows special permissions.

#### Member (`member`)

Members are Chronograf users who have been added to organizations without any specified functional roles. Although a member can authenticate, the member cannot access any content within an organization.

By default, new organizations are created with `member` as the default role.


#### Viewer (`viewer`)

Viewers (given the `viewer` role) are Chronograf who can:

* Access content restricted to their organization
* View dashboards
* View sources
* Access and use Status Page, Host List, Data Explorer, and Alerting.

#### Editor (`editor`)

Editors are Chronograf users who can:

* Access content restricted to their organization
* View, create, update, and remove dashboards
* View, create, update, and remove sources
* Create and modify Kapacitor alerts
* Access and use Status Page, Host List, Data Explorer, and Alerting.

#### Administrator (`admin`)

Administrators are users who can perform administrator functions within an organization. Users in the `admin` role can:

* Access restricted to content and users in their organization
* View, create, update, and remove dashboards
* View, create, update, and remove sources
* Create, view, and remove users
* Create and update Kapacitor alerts
* Access and use Status Page, Host List, Data Explorer, and Alerting.

####  SuperAdmin

SuperAdmins are a unique Chronograf administrators who can perform administrator functions within and across organizations. A SuperAdmin can perform two important functions:

* Create, view, update, and remove organizations
* Create, view, and remove users in any organizations

When a SuperAdmin is added as a user of an organization, the SuperAdmin is restricted by the limitations of the role. This allows a SuperAdmin to be able to comply with expectations of not accessing content within a specific organization and, if done, that an audit trail would show access of the content.
