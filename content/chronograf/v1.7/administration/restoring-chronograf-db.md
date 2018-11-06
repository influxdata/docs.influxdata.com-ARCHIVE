---
title: Restoring a Chronograf database
description: 'An outline of the process required to roll the Chronoraf internal database back to a previous version and/or rerun update migrations.'
menu:
  chronograf_1_7:
    weight: 110
    parent: Administration
---

Chronograf uses [Bolt](https://github.com/boltdb/bolt) to store Chronograf-specific key-value data.
Generally speaking, you should never have to manually administer your internal Chronograf database.
However, rolling back to a previous version of Chronograf does require restoring
the data and data-structure specific to that version.

Chronograf's internal database, `chronograf-v1.db`, is stored at your specified
[`--bolt-path`](/chronograf/v1.7/administration/config-options/#bolt-path-b) which,
by default, is the current working directory where the `chronograf` binary is executed.
In the upgrade process, an unmodified backup of your Chronograf data is stored inside the
`backup` directory before any necessary migrations are run.
This is done as a convenience in case issues arise with the data migrations
or the upgrade process in general.

The `backup` directory is a sibling of your `chronograf-v1.db` file.
Each backup file is appended with the corresponding Chronograf version.
For example, if you moved from Chronograf 1.4.4.2 to 1.7.0, there will be a
file called `backup/chronograf-v1.db.1.4.4.2`.

_**Chronograf backup directory structure**_
```
chronograf-working-dir/
├── chronograf-v1.db
├── backup/
|   ├── chronograf-v1.db.1.4.4.0
|   ├── chronograf-v1.db.1.4.4.1
|   └── chronograf-v1.db.1.4.4.2
└── ...
```

## Rolling back to a previous version
If there is an issue during the upgrade process or you simply want/need to roll
back to an earlier version of Chronograf, you must restore the data file
associated with that specific version, then downgrade and restart Chronograf.

The process is as follows:

### 1. Locate your desired backup file
Inside your `backup` directory, locate the database file with a the appended Chronograf
version that corresponds to the version to which you are rolling back.
For example, if rolling back to 1.4.4.2, find `backup/chronograf-v1.db.1.4.4.2`.

### 2. Stop your Chronograf server
Stop the Chronograf server by killing the `chronograf` process.

### 3. Replace your current database with the backup
Remove the current database file and replace it with the desired backup file:

```bash
# Remove the current database
rm chronograf-v1.db

# Replace it with the desired backup file
cp backup/chronograf-v1.db.1.4.4.2 chronograf-v1.db
```

### 4. Install the desired Chronograf version
Install the desired Chronograf version.
Chronograf releases can be viewed and downloaded either from the
[InfluxData downloads](https://portal.influxdata.com/downloads#chronograf)
page or from the [Chronograf releases](https://github.com/influxdata/chronograf/releases)
page on Github.

### 5. Start the Chronograf server
Restart the Chronograf server.
Chronograf will use the `chronograf-v1.db` in the current working directory.

## Rerunning update migrations
This process can also be used to rerun Chronograf update migrations.
Go through steps 1-5, but on [step 3](#3-replace-your-current-database-with-the-backup)
select the backup you want to use as a base for the migrations.
When Chronograf starts again, it will automatically run the data migrations
required for the installed version.
