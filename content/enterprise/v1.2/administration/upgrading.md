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
[a small change](/enterprise/v1.2/about-the-project/release-notes-changelog/#features)
to the data node's configuration file, installing the new data package will
prompt you to either keep or overwrite your current configuration file.
We recommend that you keep a copy of your current configuration file and
migrate any customizations to the new 1.2 configuration file.

Please note that upgrading meta nodes from version 1.1 to 1.2 is a one-way
process.
If you plan on downgrading from version 1.2 to version 1.1, the upgrading
and downgrading process requires
[additional steps](#).

## Upgrading from versions prior to 1.1 to 1.2

Please review the [1.1 documentation](/enterprise/v1.1/administration/upgrading/)
if you're upgrading to version 1.2 from a version prior to 1.1.

## Upgrade steps for users who plan to downgrade from version 1.2 to 1.1

Summary: Safely upgrade from version 1.1 to 1.2 and downgrade from version
1.2 to 1.1

Assumptions: Working on version 1.1.1, Ubuntu 16.04

### Upgrade from version 1.1.1 to 1.2.X

#### Step 1: Backup the 1.1.1 cluster

```
Example (influxd-ctl [...])
```

Backup syntax differs in version 1.1.X and version 1.2.X.
Be sure to use the backup syntax outlined in the 1.1.x documentation.
LINK

#### Step 2: Verify that the backup succeeded
```
Example (ls <backup_dir>)
```

#### Step 3: Download and install the 1.2.x packages

Data nodes:
```
wget [...]
sudo dpkg -i [...]
```

Meta nodes:
```
wget [...]
sudo dpkg -i [...]
```

Note about configuration changes between the versions.
Recommend keep a copy of the v1.1.1 configuration file and migrate any
customizations to the 1.2.X configuraiton file.

#### Step 4: Restart the meta and data nodes

On each data node:
```
service influxdb restart
```

On each meta node:
```
service influxdb-meta restart
```

#### Step 5: Verify that the cluster is upgraded

```
influxd-ctl show

Example output with the right version number
```

### Downgrade from version 1.2.X to 1.1.1

#### Step 1: Stop the processes?

```
Example
```

#### Step 2: Install version 1.1.1

Data nodes:
```

```

Meta nodes:
```

```

#### Step 3: Restore the v1.1.1 backup?

```
influxd-ctl restore [...]
```

Note about using the the v1.1.1 restore syntax.

#### Step 4: Start the meta and data processes
On each meta node:
```

```

On each data node:
```

```

#### Step 5: Verify
