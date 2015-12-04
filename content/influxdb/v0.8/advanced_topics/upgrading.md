---
title: Upgrading from previous versions
---

## Upgrading from 0.7 to 0.8

Version 0.8 of InfluxDB made some changes to how the underlying storage works. We also introduced [shard spaces](sharding_and_storage.html). In order to upgrade to 0.8 you'll have to do a few things to get your data moved over and take advantage of these new features.

The first thing you should do is back up your data. Shut down InfluxDB and make copies of the `raft` and `wal` directories. The underlying `db/shard_db` directory won't be modified in any way so you should be safe without backing up the raw database files.

Install version 0.8 and start InfluxDB up. *Note* that you can only upgrade using version 0.8.0, 0.8.1, 0.8.2, or 0.8.3. That means you should upgrade to one of those versions, migrate your data, then upgrade to the most recent 0.8 release.

If you have a cluster, shut all of them down upgrade them all and start them back up. Note that none of your old data will show up in queries at this point. Don't be alarmed, we're going to kick off a background migration to move it over. We chose to do it this way so you could have a small amount of down time for accepting writes and let the migration progress while you're still ingesting data.

The upgraded Influx will be able to take writes as soon as it starts. Since you haven't created a shard space yet, a default one will be created for you. You'll probably want to create some shard spaces.

If you want the same shard space structure as version 0.7, it had two shard spaces built in: long term and short term. Their configuration would look like this:

```json
{
  "name": "long_term",
  "retentionPolicy": "inf",
  "shardDuration": "30d",
  "regex": "/^[A-Z].*/",
  "replicationFactor": 1,
  "split": 1
}

{
  "name": "short_term",
  "retentionPolicy": "inf",
  "shardDuration": "7d",
  "regex": "/.*/",
  "replicationFactor": 1,
  "split": 1
}
```

Shard spaces belong to a database. So you'll have different spaces for each database you have in Influx. To add these shard spaces to a database called `test` simply run these commands:

```bash
curl -X POST "http://localhost:8086/cluster/shard_spaces/test?u=root&p=root" \
  -d '{
  "name": "short_term",
  "retentionPolicy": "inf",
  "shardDuration": "7d",
  "regex": "/.*/",
  "replicationFactor": 1,
  "split": 1}'

curl -X POST "http://localhost:8086/cluster/shard_spaces/test?u=root&p=root" \
  -d '{
  "name": "long_term",
  "retentionPolicy": "inf",
  "shardDuration": "30d",
  "regex": "/^[A-Z].*/",
  "replicationFactor": 1,
  "split": 1}'
```

And to verify they've been created:

```
curl "http://localhost:8086/cluster/shard_spaces?u=root&p=root"
```

Notice that the least specific shard space (or the default case `.*`) was created first. When creating shard spaces the order should go from least to most specific. They're evaluated in the reverse order they were created.

## Kicking off the migration

Now that you have shard spaces set up, let's get your data migrated over. Simply do this:

```
curl -X POST "http://localhost:8086/cluster/migrate_data?u=root&p=root"
```

That'll kick off a migration in the background. It will look in your `db/shard_db` directory for the shards there. It will migrate each of them highest number to lowest. This will generally mean that most recent data will be migrated first. You should be able to perform writes and queries against Influx while this is running.

__NOTE:__ By default the migration routine will pause for 100ms after 10,000 points have been migrated. We put this in so that the migration wouldn't completely overwhelm your server. You can adjust this with the query parameter `pause` like this:

```
# no pause
curl -X POST "http://localhost:8086/cluster/migrate_data?u=root&p=root&pause=0s"

# bigger pause
curl -X POST "http://localhost:8086/cluster/migrate_data?u=root&p=root&pause=1s"
```

You can use `u`, `ms`, `s`, and `m` units on the pause time.

As each shard is migrated a marker file will be written to `db/shard_db/00001/MIGRATED` where `00001` is whatever the shard number is. Note that the old shard numbers may not be the same as the new shard numbers. New shards can be found at `db/shard_db_v2`. You can also keep an eye on the log to see how the migration is progressing. Depending on how much data you have, migration could take a considerable amount of time.

__NOTE:__ The old data will still remain on disk after it is migrated. You'll want to go through and remove that manually once things are done. Any directory that has a `MIGRATED` file in it should be safe to delete.