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

Each of these four roles, described in detail below, have different permission levels and rights to use the following Chronograf-owned or Chronograf-accessed resources.

#### Chronograf-owned resources

Chronograf-owned resources include internal resources that are under the full control of Chronograf, including:

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
- Kapacitor alerts and alert rules (called tasks in Kapacitor)


#### Members (role:`member`)

Members are Chronograf users who have been added to organizations but do not have any functional permissions. Members can authenticate, but they cannot access any resources within an organization and thus cannot use Chronograf.

By default, organizations have a default role of `member`. If an organization is in Public mode, then anyone could authenticate and become a member, but not be able to use Chronograf until an administrator adds them to a different role.


#### Viewers (role:`viewer`)

Viewers are Chronograf users with mostly read-only permissions for Chronograf-owned resources who can:

- View canned dashboards
- View canned layouts
- Access InfluxDB sources through existing InfluxDB connections
- Use Kapacitor connections

For Chronograf-accessed resources, viewers can:

- InfluxDB
  - Create, view, edit, and delete databases
  - Create, view, edit, and delete InfluxDB users
  - Create, view, edit, and delete InfluxDB Enterprise roles
  - View and kill queries
- Kapacitor
  - View current connection
  - View alerts
  - Create, edit, and delete alert rules

#### Editors (role:`editor`)

Editors are Chronograf users with limited permissions for Chronograf-owned resources who can:

- Create, view, edit, and delete dashboards
- View canned layouts
- Create, edit, and delete layouts (requires command line access to file system)
- Create, use, edit, and delete InfluxDB connections
- Switch current InfluxDB connection to other available connections
- Create, view, edit, and delete InfluxDB Enterprise roles
- Create, use, edit, and delete Kapacitor connections
- Switch current Kapacitor connection to another available connection

For Chronograf-accessed resources, editors can:

- InfluxDB
  - Create, view, edit, and delete databases
  - Create, view, edit, and delete InfluxDB users
  - View and kill queries
- Kapacitor
  - View alerts
  - Create, edit, and delete alert rules

#### Administrators (role:`admin`)

Administrators are Chronograf users have all of the capabilities of viewers and editors, but with additional administrator capabilities including permissions for the following Chronograf-owned resources:

- Create, view, edit, and delete dashboards
- View canned layouts
- Create, edit, and delete layouts (requires command line access to file system)
- Create, use, edit, and delete InfluxDB connections
- Switch current InfluxDB connection to other available connections
- Create, view, edit, and delete InfluxDB Enterprise roles
- Create, use, edit, and delete Kapacitor connections
- Switch current Kapacitor connection to another available connection
- Create, update, and remove Chronograf users

For Chronograf-accessed resources, administrators can:

- InfluxDB
  - Create, viiew, edit, and delete databases
  - Create, view, edit, and delete InfluxDB users
  - View and kill queries
- Kapacitor
  - View current connection
  - View alerts
  - Create, edit, and delete alert rules

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
