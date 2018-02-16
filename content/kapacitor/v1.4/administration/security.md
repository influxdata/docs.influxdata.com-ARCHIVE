---
title: Security

menu:
  kapacitor_1_4:
    weight: 12
    parent: administration
---

# Overview

This document covers the basics of securing the open-source distribution of
Kapacitor.  For information about security with Kapacitor Enterprise see the
Kapacitor Enterprise documentation.

When seeking to secure Kapacitor it is assumed that the Kapacitor server will be
communicating with an already secured InfluxDB server.  It will also make its
tasks and alerts available to a Chronograf installation.  

The following discussion will cover configuring Kapacitor to communicate with a
secure InfluxDB server; enabling TLS/SSL in Kapacitor; and connecting an SSL enabled
Kapacitor server to Chronograf.  

Authentication and Authorization are not fully implemented in the open-source
distribution, but are available as a feature of Kapacitor Enterprise.  

## Secure InfluxDB and Kapacitor

## Kapacitor Security

### Kapacitor over TLS/SSL

### Kapacitor Authentication and Authorization

The following applies to the open-source distribution of Kapacitor.  While it is
possible to add parameters such as `username`, `password` and `auth-enabled` to
the section `[http]` of the configuration file, `kapacitor.conf`, and while the
kapacitor server will then expect a username and password to be supplied when
connecting, the authorization and authentication handler in the open-source
distribution does not enforce checks against a user-store, nor does it verify
access permissions to resources using an Access Control List (ACL).  

A true authentication and authorization handler is available only in the
Kapacitor Enterprise distribution.      

## Secure Kapacitor and Chronograf
