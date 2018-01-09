---
title: Managing Chronograf users
menu:
  chronograf_1_4:
    name: Managing Chronograf users
    weight: 50
    parent: Administration
---

**On this page**

[Managing Chronograf users and roles](#managing-chronograf-users-and-roles)
* [Organization-bound users](#organization-bound-users)
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

Starting with Chronograf 1.4, Chronograf includes the ability to create usesrs using role-based access control. Chronograf now has four organization-bound user roles and one cross-organization SuperAdmin status. Within an organization, Chronograf users can be created and assigned roles, updated, and removed by administrators (with the `admin` role) or anyone with SuperAdmin status.

### Organization-bound users

Chronograf users are assigned one of the following four organization-bound user roles, listed here in order of increasing permissions:

- [`member`](#members-role-member)
- [`viewer`](#viewer-role-viewer)
- [`editor`](#editors-role-editor)
- [`admin`](#administrators-role-admin)

Each of these four roles, described in detail below, have different permission levels and rights to use resources either owned by Chronograf or accessed using Chronograf. These resources are summarized below.

#### Chronograf-owned resources

Chronograf-owned resources include internal resources that are under full control by Chronograf. These resources include:

- Kapacitor connections
- InfluxDB connections
- Dashboards
- Canned layouts
- Chronograf organizations
- Chronograf users
- Chronograf Status Page content for News Feeds and Getting Started

#### Chronograf-accessed resources

Chronograf-accessed resources include external resources that can be accessed using Chronograf, but are under limited control by Chronograf. Chronograf users with the roles of `viewer`, `editor`, and `admin` have equal access to these resources which include:

- InfluxDB databases, users, queries, and time series data
- Kapacitor alerts and rules (called tasks in Kapacitor)


#### Members (role:`member`)

Members are Chronograf users who have been added to organizations but do not have any functional roles. Members can authenticate, but they cannot access any resources within an organization.

By default, new organizations have a default role of `member`.


#### Viewers (role:`viewer`)

Viewers are Chronograf users with limited permissions for Chronograf-owned resources and can:

- View predefined dashboards
- View canned layouts
- Use InfluxDB connections
- Use Kapacitor connections

For Chronograf-accessed resources, viewers can:

- InfluxDB
  - Create, view, edit, and delete databases
  - Create, view, edit, and delete InfluxDB users
  - View and kill queries
- Kapacitor
  - View current connection
  - View alerts
  - Create alert rules

#### Editors (role:`editor`)

Viewers are Chronograf users with limited permissions for the following Chronograf-owned resources:

- Create, view, edit, and delete dashboards
- Create, view, edit, and delete layouts
- Create, use, switch, edit, and delete InfluxDB connections
- Create, use, switch, edit, and delete Kapacitor connections

For Chronograf-accessed resources, editors can:

- InfluxDB
  - Create, view, edit, and delete databases
  - Create, view, edit, and delete InfluxDB users
  - View and kill queries
- Kapacitor
  - Create, view, edit, and delete alerts
  - Create, view, edit, and delete alert rules

#### Administrators (role:`admin`)

Administrators are Chronograf users have all of the capabilities of viewers and editors, but with additional administrator capabilities including permissions for the following Chronograf-owned resources:

- Create, view, edit, and delete dashboards
- Create, view, edit, and delete layouts
- Create, use, switch, edit, and delete InfluxDB connections
- Create, use, switch, edit, and delete Kapacitor connections
- Create, update, and remove Chronograf users

For Chronograf-accessed resources, administrators can:

- InfluxDB
  - Create, viiew, edit, and delete databases
  - Create, view, edit, and delete InfluxDB users
  - View and kill queries
- Kapacitor
  - View current connection
  - View alerts

### Cross-organization SuperAdmin status

SuperAdmins are unique Chronograf administrators who can perform administrator functions across organizations and within organizations as administrators (with the `admin` role). A user with SuperAdmin status can perform the following operations that are unavailable for other roles:

* Create, view, update, and remove organizations
* Create, view, update, and remove users in any organizations

When a Chronograf user with SuperAdmin status creates a new organization, the SuperAdmin user will appear in that organization with the `admin` role by default. Since the SuperAdmin status is not a role, the role can be changed to any other role (including `member`, `viewer`, or `editor`). Due to the SuperAdmin status, however, this user effective;y has the permissions of the `admin` role. If the user has the SuperAdmin status revoked, then that user will retain whatever role has been assigned in an organization.

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
