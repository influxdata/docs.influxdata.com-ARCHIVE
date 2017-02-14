---
title: Upgrading from Previous Versions
menu:
  enterprise_1_2:
    weight: 0
    parent: Administration
---

## Upgrading from version 1.1 to 1.2

The 1.2 release is a drop-in replacement for 1.1 with no data migration
required - just download and install the
[1.2 packages](https://portal.influxdata.com/licenses) and restart the processes.
We recommend that you review the
[Changelog](/enterprise/v1.2/about-the-project/release-notes-changelog/) prior
to upgrading.

Because of
[some changes](/enterprise/v1.2/about-the-project/release-notes-changelog/)
to the data node's configuration file, installing the new data package will
prompt you to either keep or overwrite your current configuration file.
We recommend that you keep a copy of your current configuration file and
migrate any customizations to the new 1.2 configuration file.

<dt>Please note that upgrading meta nodes to version 1.2.2 is a one-way process.
Because of changes to the [meta service](/enterprise/v1.2/concepts/glossary/#meta-service), reverting a meta node from version 1.2.2 to a previous version is not supported.
</dt>

## Upgrading from versions prior to 1.1 to 1.2

Please review the [1.1 documentation](/enterprise/v1.1/administration/upgrading/)
if you're upgrading to version 1.2 from a version prior to 1.1.
