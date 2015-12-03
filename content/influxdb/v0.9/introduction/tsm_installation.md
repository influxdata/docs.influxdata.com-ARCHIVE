---
title: Installation with the TSM Tree Storage Engine
---

<dt>The new storage engine is for testing purposes only at this point. Until the 0.9.5 release is made, assume that any data could be corrupted or lost and that you may have to blow away your data when upgrading from one nightly build to another.</dt>

First, you'll need to install the nightly build, available on the <a href="/download/index.html" target="_">download page</a>.

Once you've installed the nightly, you'll need to enable the new storage engine in the config and start with a fresh database. Set the `engine` config setting to `tsm1` in <a href="https://github.com/influxdb/influxdb/blob/master/etc/config.sample.toml#L43" target="_">the config here</a>.

Once you've done that you're ready to start testing it out. Every write fsyncs the write ahead log, so you'll get the best performance if you batch points together in write requests. You can batch thousands together. We've tested up to 10k point batches with success.

The level of compression you'll get depends on the shape of your data and the precision of your timestamps. It's useful to test with different scenarios.
