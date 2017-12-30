---
title: Managing organizations
menu:
  chronograf_1_4:
    weight: 40
    parent: Administration
---

## About organizations

Within Chronograf, organizations are collections of users who share dashboards, sources, and alerts. An organization can be used to represent an entire company, a functional unit, or a team.

Chronograf is installed with a "default" organization which can be configured to let your applications be used as they were in Chronograf versions prior to version 1.4 or to specify users and roles within the "default" organization.

Starting with Chronograf version 1.4, you can create multiple organizations and create customized applications to meet your requirements for different teams, functional units, and other groups.

Chronograf users can be members of one or more organizations.

### Using the "Default" organization

>***Note:*** Chronograf installs with a default organization (named "Default") which can be used to configured to behave like Chronograf versions prior to version 1.4.

To use the default organization:

1) In the navigation bar on the left of the **Chronograf Admin** page, select **Admin** (crown icon) > **Chronograf** to open the Chronograf Admin page.
2) Click the **Organizations** tab and note that the current organization is "Default". You can optionally rename "Default" to another name.
3) Under **Public**, click the radio button to Off so that new users cannot authenticate unless an administrator (with the admin role) adds them to the organization.
4) Under **Default Role**, select the default role for new users (typically, the default is `viewer`).
5) Under **Config**, set the **"All new users are SuperAdmins"** option to **Off**.
6) Click the **Users** tab and add yourself as first user in the organization.
   * **Username**: Enter the email address you'll use for authentication.
   * **Role**: Click member and in the dropdown list, select admin.
   * **SuperAdmin**: Selected, but grayed out since the first user is a SuperAdmin.
   * **Provider**: Enter the OAuth provider that must be used to authenticate. Valid values are `github` and `google`.
   * **Scheme**: Displays `oauth2`, which is the only supported scheme in this release.


### Creating organizations

Required role: SuperAdmin

To create an organization:

1) In the navigation bar of the Chronograf application, select **Admin** (crown icon) > **Chronograf** to open the **Chronograf Admin** page.
2) Click the **Organizations** tab and note that the current organization is "Default". You can rename "Default" to a different name by double-clicking on the name.
3) Under **Public**, click the radio button to **Off** so that new users cannot authenticate unless an administrator (with the admin role) adds them to the organization.
4) Under **Default Role**, select the default role for new users (typically, the default is viewer).
5) Under **Config**, set the **All new users are SuperAdmins** option to **Off**.
6) Click the **Users** tab and add yourself as first user in the organization.
   * **Username**: Enter the email address you'll use for authentication.
   * **Role**: Click **member** and select **admin** from the dropdown list.
   * **SuperAdmin**: Selected and grayed out since the first user is a SuperAdmin.
   * **Provider**: Type in the OAuth provider to be used for authentication (for example, `github` or `google`).
   * **Scheme**: Displays `oauth2`, which is the only supported scheme in this release.

### Removing organizations

Required role: SuperAdmin

To remove an organization:

1) In the navigation bar of the Chronograf application, select **Admin** ("crown" icon) > **Chronograf** to open the **Chronograf Admin** page.
2) Click the **Organizations** tab and note that the current organization is "Default". You can rename "Default" to a different name by double-clicking on the name.
3) Find the organization that you want to remove and delete it by clicking the D
