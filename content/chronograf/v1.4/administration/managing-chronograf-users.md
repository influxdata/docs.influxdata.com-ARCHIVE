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

#### InfluxDB and Kapacitor users within Chronograf

Chronograf uses InfluxDB and Kapacitor connections to manage user access control to InfluxDB and Kapacitor resources within Chronograf. The permissions of the InfluxDB and Kapacitor user specified within such a connection determine the capabilities for any Chronograf user with access (i.e., viewers, editors, and administrators) to that connection.

> ***Note:*** Chronograf users are entirely separate from InfluxDB and Kapacitor users. The only association between Chronograf and InfluxDB or Kapacitor users is through an InfluxDB or Kapacitor connection created within Chronograf.

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

By default, new organizations have a default role of `member`. If an organization is in Public mode, then anyone could authenticate and become a member, but not be able to use Chronograf until an administrator adds them to a different role.


#### Viewers (role:`viewer`)

Viewers are Chronograf users with effectively read-only capabilities for Chronograf-owned resources within their current organization:

- View canned dashboards
- View canned layouts
- View InfluxDB connections
- Switch current InfluxDB connection to other available connections
- Access InfluxDB resources through the current connection
- View Kapacitor connections associated with InfluxDB connections
- Access Kapacitor resources through the current connection

For Chronograf-accessed resources, viewers can:

- InfluxDB
  - Read and write time series data
  - Create, view, edit, and delete databases and retention policies
  - Create, view, edit, and delete InfluxDB users
  - View and kill queries
  - _InfluxDB Enterprise_: Create, view, edit, and delete InfluxDB Enterprise roles
- Kapacitor
  - View alerts
  - Create, edit, and delete alert rules

#### Editors (role:`editor`)

Editors are Chronograf users with limited capabilities for Chronograf-owned resources within their current organization:

- Create, view, edit, and delete dashboards
- View canned layouts
- Create, view, edit, and delete InfluxDB connections
- Switch current InfluxDB connection to other available connections
- Access InfluxDB resources through the current connection
- Create, view, edit, and delete Kapacitor connections associated with InfluxDB connections
- Switch current Kapacitor connection to another available connection
- Access Kapacitor resources through the current connection

For Chronograf-accessed resources, editors can:

- InfluxDB
  - Read and write time series data
  - Create, view, edit, and delete databases and retention policies
  - Create, view, edit, and delete InfluxDB users
  - View and kill queries
  - _InfluxDB Enterprise_: Create, view, edit, and delete InfluxDB Enterprise roles
- Kapacitor
  - View alerts
  - Create, edit, and delete alert rules

#### Admins (role:`admin`)

Admins are Chronograf users with all capabilities for the following Chronograf-owned resources within their current organization:

- Create, view, update, and remove Chronograf users
- Create, view, edit, and delete dashboards
- View canned layouts
- Create, view, edit, and delete InfluxDB connections
- Switch current InfluxDB connection to other available connections
- Access InfluxDB resources through the current connection
- Create, view, edit, and delete Kapacitor connections associated with InfluxDB connections
- Switch current Kapacitor connection to another available connection
- Access Kapacitor resources through the current connection

For Chronograf-accessed resources, admins can:

- InfluxDB
  - Read and write time series data
  - Create, view, edit, and delete databases and retention policies
  - Create, view, edit, and delete InfluxDB users
  - View and kill queries
  - _InfluxDB Enterprise_: Create, view, edit, and delete InfluxDB Enterprise roles
- Kapacitor
  - View alerts
  - Create, edit, and delete alert rules

### Cross-organization SuperAdmin status

SuperAdmin status is a Chronograf status that allows any user, regardless of role, to perform all administrator functions both within organizations, as well as across organizations. A user with SuperAdmin status has _unlimited_ capabilities, including for the following Chronograf-owned resources:

* Create, view, update, and remove organizations
* Create, view, update, and remove users within an organization
* Switch into any organization
* Toggle the Public setting of the Default organization
* Toggle the global config setting for `All new users are SuperAdmin`

Important SuperAdmin behaviors:

* SuperAdmin status grants any user (whether `member`, `viewer`, `editor`, or `admin`) the full capabilities of admins and the SuperAdmin capabilities listed above.
* When a Chronograf user with SuperAdmin status creates a new organization or switches into an organization where that user has no role, that SuperAdmin user is automatically assigned the `admin` role by default.
* SuperAdmin users cannot revoke their own SuperAdmin status.
* SuperAdmin users are the only ones who can change the SuperAdmin status of other Chronograf users. Regular admins who do not have SuperAdmin status can perform normal operations on SuperAdmin users (create that user within their organization, change roles, and remove them), but they will not see that these users have SuperAdmin status, nor will any of their actions affect these users' SuperAdmin status.
* If a user has their SuperAdmin status revoked, that user will retain their assigned roles within their organizations.

### Creating users

Role required: `admin`

**To create a user:**

1) Open Chronograf in your web browser and select **Admin (crown icon) > Chronograf**.
1) Click the **Users** tab and then click **Create User**.
1) Add the following user information:
   * **Username**: Enter the username as provided by the OAuth provider.
   * **Role**: Select the Chronograf role.
   * **Provider**: Type in the OAuth provider to be used for authentication. Valid values are: `github`, `google`, and `auth0`.
   * **Scheme**: Displays `oauth2`, which is the only supported authentication scheme in this release.
1) Click **Save** to finish adding the user.

### Updating users

Role required: `admin`

Only a user's role can be updated. A user's username, provider, and scheme cannot be updated.

**To change a user's role:**

1) Open Chronograf in your web browser and select **Admin (crown icon) > Chronograf**.
1) Click the **Users** tab to display the list of users within the current organization.
1) Select a new role for the user. The update is automatically persisted.

### Removing users

Role required: `admin`

**To remove a user:**

1) Open Chronograf in your web browser and select **Admin (crown icon) > Chronograf**.
1) Click the **Users** tab to display the list of users.
1) Hover your cursor over the user you want to remove and then click **Remove** and **Confirm**.
