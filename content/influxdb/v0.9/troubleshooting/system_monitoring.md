---
title: System Monitoring
---

To assist with troubleshooting and performance analysis InfluxDB makes available statistical and diagnostic information about the system. For additional information see the [README on GitHub](https://github.com/influxdb/influxdb/blob/master/monitor/README.md).

* [See statistics for your installation with `SHOW STATS`](../query_language/schema_exploration.html#see-statistics-about-your-installation-with-show-stats)
* [Show diagnostic information about your installation with `SHOW DIAGNOSTICS`](../query_language/schema_exploration.html#show-diagnostic-information-about-your-installation-with-show-diagnostics)

## See statistics for your installation with `SHOW STATS`

Show a series of statistics related to your InfluxDB instance

```sql
> SHOW STATS
```

CLI response:

```sh
name: engine
tags: path=/Users/johnzampolin/.influxdb/data/telegraf/default/65, version=bz1
blks_write	blks_write_bytes	blks_write_bytes_c	points_write	points_write_dedupe
----------	----------------	------------------	------------	-------------------
227422		4781938			6382683			227422		227422


name: httpd
tags: bind=:8086
points_written_ok	query_req	query_resp_bytes	req	write_req	write_req_bytes
-----------------	---------	----------------	---	---------	---------------
227684			30		5027			899	869		15178945


name: shard
tags: engine=bz1, id=65, path=/Users/johnzampolin/.influxdb/data/telegraf/default/65
fields_create	series_create	write_points_ok	write_req
-------------	-------------	---------------	---------
0		268		227684		869


name: wal
tags: path=/Users/johnzampolin/.influxdb/wal/_internal/monitor/66
auto_flush	meta_flush
----------	----------
8671		    14


name: wal
tags: path=/Users/johnzampolin/.influxdb/wal/_internal/monitor/67
auto_flush	flush_duration		idle_flush	mem_size	meta_flush	points_flush	points_write	points_write_req	series_flush
----------	--------------		----------	--------	----------	------------	------------	----------------	------------
8659		2.966561441000001	868		934		14		17356		17376		869			17356


name: write
-----------
point_req	point_req_local	req	write_ok
245060		245060		1738	1738


name: runtime
-------------
Alloc		Frees		HeapAlloc	HeapIdle	HeapInUse	HeapObjects	HeapReleased	HeapSys		Lookups	Mallocs		NumGC	NumGoroutine	PauseTotalNs	Sys		TotalAlloc
96657936	19481852	96657936	47718400	108355584	898912		2121728		156073984	7262	20380764	95	50		54495600	168606776	5823932752
```

> **Note:** Depending on your local configuration there may be multiple `name: engine`, `name: shard`, and `name: wal` fields

## Show diagnostic information about your installation with `SHOW DIAGNOSTICS`

Retrieve a collection of diagnostic information helpful for troubleshooting.  

```sql
> SHOW DIAGNOSTICS
```

CLI response:

```sh
name: build
-----------
Branch   Commit				            	  	               Version
0.9.4	   c4f85f84765e27bfb5e58630d0dea38adeacf543	0.9.4.1


name: runtime
-------------
GOARCH	GOMAXPROCS	  GOOS	     version
amd64	 8		          darwin	   go1.5.1


name: network
-------------
hostname
eruditorum.local


name: system
------------
PID	  currentTime		                  started  			         	         uptime
30780	2015-10-16T21:53:42.118130213Z	2015-10-16T19:28:58.069413146Z	2h24m44.048717342s

```
