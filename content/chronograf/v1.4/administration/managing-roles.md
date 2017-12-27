---
title: Managing roles
menu:
  chronograf_1_4:
    weight: 30
    parent: Administration
---


## Chronograf predefined roles

Chronograf includes the following five predefined roles, listed in order of increasing functionality:

* member
* viewer
* editor
* admin
* superadmin


### Non-administrator roles

#### `member`

When a user is created in Chronograf, the default user is member. A `member` exists and can authenticate, but cannot access any content within Chronograf.

During


#### `viewer`

The `viewer` role in Chronograf enables a user to be able to access and view all of the available dashboards within an organization.


#### `editor`

The `editor` role in Chronograf grants a user the ability to:

* create and modify dashboards
* create and modify Kapacitor Alerts


### Administrator roles

#### `admin`

In addition to rights granted to other roles, users assigned the `admin` role can also:

* Create, view, and remove admin and non-admin users
* view, create, and delete admin and non-admin users
* Change user passwords
* Assign admin and remove admin permissions to or from a user


####  `superadmin`

A user with `superadmin` privileges can perform the following:

* create or remove organizations
* create, view, and remove superadmin users
