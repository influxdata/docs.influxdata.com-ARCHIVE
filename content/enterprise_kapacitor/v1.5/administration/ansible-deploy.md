---
title: Deploy Kapacitor Enterprise using Ansible
description: Deploy and manage Kapacitor Enterprise, including configuration, licensing, authentication, and other specified tasks.

menu:
  enterprise_kapacitor_1_5:
    name: Configuration
    weight: 1
    parent: Administration
---

## Overview

Use Ansible to automate the deployment, management, and administration of Kapacitor Enterprise cluster on Linux:

- Download and install Kapacitor(#download-and-install-kapacitor)
- Generate and install configuration files(#generate-and-install-configuration-files)
- Manage the Kapacitor service(#manage-the-kapacitor-service)
- Specify a directory to upload TICK scripts
- Manage defined tasks

## Download and install Kapacitor

Use the `ansible-galaxy` command to download and install the `influxdata.kapacitor` role from the Galaxy website:

```sh
ansible-galaxy install influxdata.kapacitor
```

## Generate and install configuration files

How?

## Manage the Kapacitor service

How?

## Specify a directory to upload TICK scripts

Specify a directory to upload TICK scripts to in your Kapacitor playbook:

```sh
 [vars]
 kapacitor_tick_src_dir: '../../shared/files/tick'
```

## Manage defined tasks

How?
