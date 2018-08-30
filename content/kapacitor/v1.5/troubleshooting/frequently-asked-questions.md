---
title: Kapacitor frequently asked questions

menu:
  kapacitor_1_5:
    name: Frequently asked questions (FAQ)
    weight: 10
    parent: Troubleshooting
---

This page addresses frequent sources of confusion or important things to know related to Kapacitor.
Where applicable, it links to outstanding issues on Github.

**Administration**  
[Is the alert state and alert data lost happen updating a script?](#is-the-alert-state-and-alert-data-lost-happen-when-updating-a-script)  

**TICKscript**  
[Batches work but streams do not. Why?](#batches-work-but-streams-do-not-why)  
[Is there a limit on the number of scripts Kapacitor can handle?](#is-there-a-limit-on-the-number-of-scripts-kapacitor-can-handle)  

**Performance**  
[Do you get better performance with running one complex script or having multiple scripts running in parallel?](#do-you-get-better-performance-with-running-one-complex-script-or-having-multiple-scripts-running-in-parallel)  

## Administration

### Is the alert state and alert data lost happen when updating a script?
Kapacitor will remember the last level of an alert, but other state-like data, such as data buffered in a window, will be lost.

## TICKscript

### Batches work but streams do not. Why?
Make sure port `9092` is open to inbound connections.
Streams are a `PUSH`'d to port `9092` so it must be allowed through the firewall.

### Is there a limit on the number of scripts Kapacitor can handle?
There is no software limit, but it will be limited by available server resources.

## Performance

### Do you get better performance with running one complex script or having multiple scripts running in parallel?
Taking things to the extreme, best-case is one task that consumes all the data and does all the work since there is added overhead when managing multiple tasks.
However, significant effort has gone into reducing the overhead of each task.
Use tasks in a way that makes logical sense for your project and organization.
If you run into performance issues with multiple tasks, [let us know](https://github.com/influxdata/kapacitor/issues/new). _**As a last resort**_, merge tasks into more complex tasks.

### Do template-based scripts use less resources or are they just an ease-of-use tool?
Templates are just an ease of use tool and make no difference in regards to performance.
