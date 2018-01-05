---
title: Managing Chronograf users
menu:
  chronograf_1_4:
    menu: Managing Chronograf users
    weight: 30
    parent: Administration
---

**On this page**

[Managing Chronograf users and roles](#managing-chronograf-users-and-roles)
* [Organization-based users](#organization-based-users)
  * [Chronograf-owned resources](#chronograf-owned-resources)
  * [Chronograf-accessed resources](#chronograf-accessed-resources)
  * [Members](#members-role-member)
  * [Viewers](#viewer-role-viewer)
  * [Editors](#editors-role-editor)
  * [Administrators](#administrators-role-admin)
* [Cross-organization SuperAdmin status](#cross-organization-superadmin-status)
* [Creating users](#creating-users)
* [Updating users](#updating-users)
* [Removing users](#removing-users)

## Managing Chronograf users and roles

Chronograf includes four organization-based user roles and one cross-organization SuperAdmin status.

### Organization-based users

Chronograf users are assigned one of the following four organization-based user roles:

- [`member`](#members-role-member)
- [`viewer`](#viewer-role-viewer)
- [`editor`](#editors-role-editor)
- [`admin`](#administrators-role-admin)

Each of these four roles, described in detail below, have different permission levels and rights to use resources that either owned by Chronograf or accessed using Chronograf. These resources are summarized here:

#### Chronograf-owned resources

Chronograf-owned resources are internal resources that are under complete control of Chronograf. These resources include:

- Kapacitor connections
- InfluxDB connections
- Dashboards
- Canned layouts
- Chronograf organizations
- Chronograf users
- Chronograf Status page content, including News Feeds and Getting Started

#### Chronograf-accessed resources

Chronograf-accessed resources are external resources that can be accessed using Chronograf, but are under limited control. Chronograf users with the roles of `viewer`, `editor`, and `admin` have equal access to these resources which include:

- InfluxDB databases, users, queries, and time series data
- Kapacitor alerts and rules (called tasks in Kapacitor)


#### Member (role:`member`)

Members are Chronograf users who have been added to organizations but do not have any functional roles. Members can authenticate, but they cannot access any resources within an organization.

By default, new organizations have a default role of `member`.


#### Viewer (role:`viewer`)

Viewers are Chronograf users with limited permissions for the following Chronograf-owned resources:

- view pre-defined dashboards
- view canned layouts

For Chronograf-accessed resources, viewers can:

- InfluxDB
  - switch the current connection to other available sources
  - view, create, edit, and delete databases
  - view, create, edit, and delete InfluxDB users
  - view and kill queries
- Kapacitor
  - view current connection
  - view alerts
  - create rules

#### Editors (role:`editor`)

Viewers are Chronograf users with limited permissions for the following Chronograf-owned resources:

- create, view, edit, and delete dashboards
- view canned layouts

For Chronograf-accessed resources, editors can:

- InfluxDB
  - switch the current connection to other available sources
  - view, create, edit, and delete databases
  - view, create, edit, and delete InfluxDB users
  - view and kill queries
- Kapacitor
  - view current connection
  - view alerts

#### Administrators (role:`admin`)

Administrators are Chronograf users have all of the capabilities of the viewer and editor roles, but with additional administrator capabilities including permissions for the following Chronograf-owned resources:

- view pre-defined dashboards
- view canned layouts

For Chronograf-accessed resources, administrators can:

- InfluxDB
  - switch the current connection to other available sources
  - view, create, edit, and delete databases
  - view, create, edit, and delete InfluxDB users
  - view and kill queries
- Kapacitor
  - view current connection
  - view alerts

### Cross-organization SuperAdmin status

SuperAdmins are unique Chronograf administrators who can perform administrator functions across organizations and within organizations as administrators (with the `admin` role). A user with SuperAdmin status can perform the following operations that are unavailable for other roles:

* Create, view, update, and remove organizations
* Create, view, and remove users in any organizations

### Creating users

Role required: `admin`

**To create a user:**

1) Open Chronograf in your web browser and select **Admin (crown icon) > Chronograf**.
2) Click the **Users** tab and then click **Create User**.
3) Add the following user information:
   * **Username**: Enter the user name that will be used for authentication.
   * **Role**: Select the Chronograf role.
   * **Provider**: Type in the OAuth provider to be used for authentication. Valid values, depending on your configured authentication providers: `github`, `google`, `heroku`).
   * **Scheme**: Displays `oauth2`, which is the only supported scheme in this release.
3) Click **Save** to finish adding the user.

### Updating users

**To update a user:**

1) Open Chronograf in your web browser and select **Admin (crown icon) > Chronograf**.
2) Click the **Users** tab to display the list of users.
3) Make any required changes for the user.
3) Click **Save** to finish adding the user.

### Removing users

**To remove a user:**

1) Open Chronograf in your web browser and select **Admin (crown icon) > Chronograf**.
2) Click the **Users** tab to display the list of users.
3) At the right side of the user information, click **Remove** and then **Confirm**.
3) Click **Save** to finish adding the user.
