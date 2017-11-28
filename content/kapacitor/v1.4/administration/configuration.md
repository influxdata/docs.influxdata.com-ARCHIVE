---
title: Configuration

menu:
  kapacitor_1_4:
    weight: 10
    parent: administration
---

# Configuring the Kapacitor Service

The Kapacitor service is configured using key value pairs organized into groups.
The main means for declaring values for configuration keys is in the configuration
file.  On a POSIX system this is by default located by the path
`/etc/kapacitor/kapacitor.conf`.  The values declared in this file can be
overridden by environment variables beginning with the token `KAPACITOR_`.  Some
can also be dynamically altered using the REST API.  

## The Kapacitor Configuration File

Sample file available at github.

`$ kapacitord config`

## Kapacitor Environment variables

## Configuration with REST
