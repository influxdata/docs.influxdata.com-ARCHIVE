---
title: Event Handler Setup

menu:
  kapacitor_1_2:
    weight: 0
    parent: guides
---

Integrate Kapacitor into your monitoring system by sending [alert messages](/kapacitor/v1.2/nodes/alert_node/#message) to supported event handlers.
Currently, Kapacitor can send alert messages to specific log files and specific URLs, as well as to applications like [Slack](https://slack.com/) and [HipChat](https://www.hipchat.com/).


This document offers step-by-step instructions for setting up event handlers with Kapacitor, including the relevant configuration options and [TICKscript](/kapacitor/v1.2/tick/) syntax.
Currently, this document doesn't cover every supported event handler, but we will continue to add content to this page over time.
For a complete list of the supported event handlers and for additional information, please see the [event handler reference documentation](/kapacitor/v1.2/nodes/alert_node/).

<table style="width:100%">
  <tr>
    <td><a href="#hipchat-setup">HipChat Setup</a></td>
    <td><a href="#telegram-setup">Telegram Setup</a></td>
  </tr>
</table>

## HipChat Setup

[HipChat](https://www.hipchat.com/) is Atlassian's web service for group chat, video chat, and screen
sharing.
Configure Kapacitor to send alert messages to a HipChat room.

### Requirements

To configure Kapacitor with HipChat, you need:

* your HipChat subdomain name
* your HipChat room name
* a HipChat API access token for sending notifications

> ##### HipChat API Access Token
><br>
The following steps describe how to create the API access token.
>
**1.** From the HipChat home page, access `Account settings` by clicking on the
person icon in the top right corner.
>
**2.** Select `API access` from the items in the left menu sidebar.
>
**3.** Under `Create new token`, enter a label for your token (it can be anything).
>
**4.** Under `Create new token`, select `Send Notification` as the Scope.
>
**5.** Click `Create`.
>
Your token appears in the table just above the `Create new token` section:
>
![HipChat token](/img/kapacitor/hipchat-token.png)

### Configuration

In the `[hipchat]` section of Kapacitor's configuration file, set:

* `enabled` to `true`
* `subdomain` in the `url` setting to your HipChat subdomain

The optional configuration settings are:

`room`  
&emsp;&emsp;Set to your HipChat room.
This serves as the default chat id if the TICKscript doesn't specify a chat id.  
`token`  
&emsp;&emsp;Set to your HipChat [API access token](#hipchat-api-access-token).
This serves as the default token if the TICKscript doesn't specify an API access token.  
`global`  
&emsp;&emsp;Set to `true` to send all alerts to HipChat without needing to specify HipChat in TICKscripts.  
`state-changes-only`  
&emsp;&emsp;Set to `true` to only send an alert to HipChat if the alert state changes.
This setting only applies if the `global` setting is also set to `true`.

#### Sample Configuration
```javascript
    [hipchat]
      enabled = true
      url = "https://my-subdomain.hipchat.com/v2/room"
      room = "my-room"
      token = "mytokentokentokentoken"
      global = false
      state-changes-only = false
```

### TICKscript Syntax

```
|alert()
    .hipChat()
        .room('<HipChat-room>')
        .token('<HipChat-API-token>')
```

The `.room()` and `.token()` specifications are optional.
If they aren't set in the TICKscript, they default to the `room` and
`token` settings in the `[hipchat]` section of the configuration file.
Note that if `global` is set to `true` in the configuration file, there's no
need to specify `.hipChat()` in the TICKscript; Kapacitor sends all alerts to HipChat
by default.

`.room('<HipChat-room>')`  
&emsp;&emsp;&emsp;Sets the HipChat room.  
`.token('<HipChat-API-token>')`  
&emsp;&emsp;&emsp;Sets the HipChat [API access token](#hipchat-api-access-token).

### Examples

#### Example 1: Send alerts to the HipChat room set in the configuration file

Configuration file:
```
[hipchat]
  enabled = true
  url = "https://testtest.hipchat.com/v2/room"
  room = "my-alerts"
  token = "tokentokentokentokentoken"
  global = false
  state-changes-only = true
```

TICKscript:
```
stream
    |from()
        .measurement('cpu')
    |alert()
        .crit(lambda: "usage_idle" <  97)
        .message('Hey, check your CPU')
        .hipChat()
```

The setup sends `Hey, check your CPU` to the `my-alerts` room associated with
the `testest` subdomain.

#### Example 2: Send alerts to the HipChat room set in the TICKscript

Configuration file:
```
[hipchat]
  enabled = true
  url = "https://testtest.hipchat.com/v2/room"
  room = "my-alerts"
  token = "tokentokentokentokentoken"
  global = false
  state-changes-only = true
```

TICKscript:
```
stream
    |from()
        .measurement('cpu')
    |alert()
        .crit(lambda: "usage_idle" <  97)
        .message('Hey, check your CPU')
        .hipChat()
        .room('random')
```

The setup sends `Hey, check your CPU` to the `random` room associated with
the `testest` subdomain.
Notice that `.room()` in the TICKscript overrides the `room` setting in the
configuration file.

## Telegram Setup

