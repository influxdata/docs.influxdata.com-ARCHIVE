---
title: Options
description: placeholder
menu:
  flux_0_x:
    parent: Language reference
    name: Options
    weight: 110
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.
Any section that is not currently implemented is commented with a `[IMPL#XXX]` where `XXX` is an issue number tracking discussion and progress towards implementation.

An option represents a storage location for any value of a specified type.
Options are mutable.
An option can hold different values during its lifetime.

Below is a list of built-in options currently implemented in the Flux language:

- now
- task
- location

##### now
The `now` option is a function that returns a time value used as a proxy for the current system time.

```js
// Query should execute as if the below time is the current system time
option now = () => 2006-01-02T15:04:05-07:00
```

##### task
The `task` option schedules the execution of a Flux query.

```js
option task = {
    name: "foo",        // Name is required.
    every: 1h,          // Task should be run at this interval.
    delay: 10m,         // Delay scheduling this task by this duration.
    cron: "0 2 * * *",  // Cron is a more sophisticated way to schedule. 'every' and 'cron' are mutually exclusive.
    retry: 5,           // Number of times to retry a failed query.
}
```

##### location
The `location` option sets the default time zone of all times in the script.
The location maps the UTC offset in use at that location for a given time.
The default value is set using the time zone of the running process.

```js
option location = fixedZone(offset:-5h) // Set timezone to be 5 hours west of UTC.
option location = loadLocation(name:"America/Denver") // Set location to be America/Denver.
```

> [IMPL#660](https://github.com/influxdata/platform/issues/660) Implement Location option
