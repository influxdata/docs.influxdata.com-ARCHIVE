---
title: Upgrading to Kapacitor v1.0

menu:
  kapacitor_1:
    weight: 30
    parent: administration
---


There are a few breaking changes from v0.12 that may require some work
to upgrade from a v0.12 instance.  These changes are:

* [Changes to Storage](#changes-to-storage)
* [Changes to HTTP API](#changes-to-http-api)
* [Changes to CLI](#changes-to-cli)

> NOTE: You must now use the correct `.`, `|` and `@` operators for property, chain and UDF methods respectively.
See [this](https://docs.influxdata.com/kapacitor/v0.12/introduction/upgrading/#tickscript-chain-operator) for more details.

## Changes to Storage

Changes to how and where task data is store have been made.
In order to safely upgrade to version 0.13 you need to follow these steps:

1. Upgrade InfluxDB to version 0.13 first.
2. Update all TICKscripts to use the new `|` and `@` operators. Once Kapacitor no longer issues any `DEPRECATION` warnings you are ready to begin the upgrade.
The upgrade will work without this step but tasks using the old syntax cannot be enabled, until modified to use the new syntax.
3. Upgrade the Kapacitor binary/package.
4. Configure new database location. By default the location `/var/lib/kapacitor/kapacitor.db` is chosen for package installs or `./kapacitor.db` for manual installs.
Do **not** remove the configuration for the location of the old task.db database file since it is still needed to do the migration.

    ```
    [storage]
    boltdb = "/var/lib/kapacitor/kapacitor.db"
    ```

5. Restart Kapacitor. At this point Kapacitor will migrate all existing data to the new database file.
If any errors occur Kapacitor will log them and fail to startup. This way if Kapacitor starts up you can be sure the migration was a success and can continue normal operation.
The old database is opened in read only mode so that existing data cannot be corrupted.
Its recommended to start Kapacitor in debug logging mode for the migration so you can follow the details of the migration process.

At this point you may remove the configuration for the old `task` `dir` and restart Kapacitor to ensure everything is working.
Kapacitor will attempt the migration on every startup while the old configuration and db file exist, but will skip any data that was already migrated.


## Changes to HTTP API

With this release the API has been updated to what we believe will be the stable version for a 1.0 release.
Small changes may still be made but the significant work to create a RESTful HTTP API is complete.
Many breaking changes introduced, see the [client/API.md](http://github.com/influxdata/kapacitor/blob/master/client/API.md) doc for details on how the API works now.

## Changes to CLI

Along with the API changes, breaking changes where also made to the `kapacitor` CLI command.
Here is a break down of the CLI changes:

* Every thing has an ID now: tasks, recordings, even replays.
    The `name` used before to define a task is now its `ID`.
    As such instead of using `-name` and `-id` to refer to tasks and recordings,
    the flags have been changed to `-task` and `-recording` accordingly.
* Replays can be listed and deleted like tasks and recordings.
* Replays default to `fast` clock mode.
* The record and replay commands now have a `-no-wait` option to start but not wait for the recording/replay to complete.
* Listing recordings and replays displays the status of the respective action.
* Record and Replay command now have an optional flag `-replay-id`/`-recording-id` to specify the ID of the replay or recording.
    If not set then a random ID will be chosen like the previous behavior.
