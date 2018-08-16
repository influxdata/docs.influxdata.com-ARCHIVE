---
title: Kapacitor Subscription Management
description: placholder
menu:
  kapacitor_1_5:
    parent: Administration
    weight: 100
---


- kapacitor subscription names
- kapacitor checks for matching subscriptions, if it doesn't find one, it'll have influxdb create a new one.


```toml
[[influxdb]]

  # ...

  # Turn off all subscriptions
  disable-subscriptions = false

  # Subscription mode is either "cluster" or "server"
  subscription-mode = "cluster"

  # Which protocol to use for subscriptions
  # one of 'udp', 'http', or 'https'.
  subscription-protocol = "http"

  # Subscriptions resync time interval
  # Useful if you want to subscribe to new created databases
  # without restart Kapacitord
  subscriptions-sync-interval = "1m0s"

  # ...

  [influxdb.subscriptions]
    # Set of databases and retention policies to subscribe to.
    # If empty will subscribe to all, minus the list in
    # influxdb.excluded-subscriptions
    #
    # Format
    # db_name = <list of retention policies>
    #
    # Example:
    my_database = [ "default", "longterm" ]
  [influxdb.excluded-subscriptions]
    # Set of databases and retention policies to exclude from the subscriptions.
    # If influxdb.subscriptions is empty it will subscribe to all
    # except databases listed here.
    #
    # Format
    # db_name = <list of retention policies>
    #
    # Example:
    my_database = [ "default", "longterm" ]
```
