---
title: Managing Chronograf organizations
menu:
  chronograf_1_4:
    menu: Managing organizations
    weight: 40
    parent: Administration
---

**On this page:**

* [About Chronograf organizations](#about-chronograf-organizations)
* [Using the default organization](#using-the-default-organization)
* [Configuring the default organization](#configuring-the-default-organization)
* [Creating organizations](#creating-organizations)
* [Removing organizations](#removing-organizations)


## About Chronograf organizations

> ***Note:*** Support for multiple organizations and multiple authenticated users is new to Chronograf 1.4. For information about the new organizational user roles and SuperAdmin status, see [Managing Chronograf users](/chronograf/v1.4/administration/managing-chronograf-users/).

A Chronograf organization is a collection of Chronograf users who share Chronograf resources in common, including dashboards, InfluxDB and Kapacitor sources, and alerts. Organizations can be used to represent companies, functional units, projects, or teams. Chronograf users can be members of members of multiple organizations.

## Using the "Default" organization

>***Note:*** This default organization can be used to support Chronograf as configured in versions earlier than 1.4.

During installation, the "Default" organization is created that can be used as-is for many applications. When used as-is, the Chronograf application supports the following behavior:

* Anyone who can open the application in a web browser can use it.
* All users are administrators (`admin` role) with SuperAdmin status.
* Authentication is not required unless OAuth 2.0 authentication is configured.

## Creating organizations

Required role: SuperAdmin

Upon installation Chronograf includes the Default organization, ready to be used as-is for many applications.

Additional organizations can be created by Chronograf administrators with SuperAdmin status to support the requirements of your company, organizational units, teams, and projects.

**To create an organization:**

1) In the navigation bar of the Chronograf application, select **Admin** (crown icon) > **Chronograf** to open the **Chronograf Admin** page.
2) Click the **Organizations** tab and then click the **Create Organization** button.
3) Under **Name**, click on **"Untitled Organization"** and enter the new organization name.
4) Set the **Public** value to **Off** (default is **On**) if you want new users to be able to authenticate only after being explicitly added by an administrator (with `admin` role). **Note:** This option is not available for any organizations than the Default organization.
4) Under **Default Role**, select the default role for new users.
6) Click the **Save** button.

## Configuring organizations

You can configure organizations existing and new organizations in the **Organizations** tab of the **Chronograf Admin** page as follows:

* **Name**: The name of the organization. Click on the organization name to change it.
* **Public**: For the Default organization only, setting **Public** to **Off** requires that new users are explicitly added to the organization by an administrator. Additional organizations require users to be explicitly added by an administrator.
* **Default Role**: The role granted to new users by default. Valid values are `member` (default), `viewer`, `editor`, and `admin`.
* **Config**: **All new users are SuperAdmins**: Enabled by default, turning this to **Off** prevents new users from being granted SuperAdmin status.

Chronograf organizations can provide enhanced security by requiring authentication using JWT and OAuth 2.0 authentication providers.

Related information:

* [Managing Chronograf users](/chronograf/v1.4/administration/managing-chronograf-users/)
* [Managing InfluxDB users](/chronograf/v1.4/administration/managing-influxdb-users/)
* [Managing security](/chronograf/v1.4/administration/managing-security/)

The default Chronograf application is ready to be used. If additional organizations are needed, follow the steps in the section below.

## Removing organizations

Required role: SuperAdmin

**To remove an organization:**

1) In the navigation bar of the Chronograf application, select **Admin** ("crown" icon) > **Chronograf** to open the **Chronograf Admin** page.
2) Click the **Organizations** tab to view a list of organizations.
3) To the right of the the organization that you want to remove, click the **Remove** button (trashcan icon) and then confirm by clicking the **Save** button.
