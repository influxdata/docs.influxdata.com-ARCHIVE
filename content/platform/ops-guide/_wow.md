---
title: Enterprise operations guide
description: placeholder
menu:
  platform:
    name: Operations guide
    weight: 10
---

This is the ops guide


## Gather metrics and logs


### Gather cluster statistics


### Gather log data



## Monitor and measure



## Troubleshoot

### Out-of-memory (OOM) loop

### Runaway series cardinality

### Hinted Handoff (HH) queue

#### Buildup of HH size

#### Get alerted when HH queue is growing

### Disk space

#### Disk space issues

#### Get alerted before disk space is unavailable

### IOPS

* Graphs related to IOPS
* Don't run out
* Alerts
* Max read and write limits based on environment

### Log analysis

#### Cache max memory size

#### HHQ blocked --> you're out of IOPS

### Volume of reads and writes

* Write heavy
* Read heavy
* Mixed workload
* Observability metrics to determine ratios

### Not batching writes

* if HTTP write requests equals the number of values per minute, batching is not happening
* * HTTP writes should exceed values by 10:1 or even 100:1
