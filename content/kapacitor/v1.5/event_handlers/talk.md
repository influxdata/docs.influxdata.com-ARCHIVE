---
title: Talk Event Handler
description: The Talk event handler allows you to send Kapacitor alerts to Talk. This doc includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: Talk
    weight: 16
    parent: event-handlers
---

[Talk](https://jianliao.com/site) is a service that aggregates information into
a centralized hub.
Kapacitor can be configured to send alert messages to Talk.

## Conifiguration
Configuration as well as default [option](#options) values for the Talk event
handler are set in your `kapacitor.conf`.
Below is an example config:

```toml
[talk]
  enabled = true
  url = "https://jianliao.com/v2/services/webhook/uuid"
  author_name = "Kapacitor"
```

#### `enabled`
Set to `true` to enable the Talk event handler.

#### `url`
The Talk webhook URL.

#### `author_name`
The default authorName.


## Options
The following Talk event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.talk()` in a TICKscript.

| Name  | Type   | Description    |
| ----  | ----   | -----------    |
| Title | string | Message title. |
| Text  | string | Message text.  |

### Example Handler File
```yaml
id: handler-id
topic: topic-name
kind: talk
options:
  title: 'Message Title'
  text: 'This is the text included in the message.'
```

### Example TICKscript
```js
|alert()
  // ...
  .talk()
    .title('Message Title')
    .text('This is the text included in the message.')
```

## Talk Setup
Create a new incoming webhook to allow Kapacitor to send alerts to Talk.

1. [Sign into your Talk account](https:/account.jianliao.com/signin).
2. Under the "Team" tab, click “Integrations”.
3. Select “Customize service” and click the Incoming Webhook “Add” button.
4. Choose the topic to connect with and click “Confirm Add” button.
5. Once the service is created, you’ll see the “Generate Webhook url”.
6. Place the generated Webhook URL as the `url` in the `[talk]` section of your
   `kapacitor.conf`.

## Using the Talk event handler
With the Talk event handler enabled and configured in your `kapacitor.conf`,
use the `.talk()` attribute in your TICKscripts to send alerts to Talk or define
a Talk handler that subscribes to a topic and sends published alerts to Talk.

### Send alerts to Talk from a TICKscript

The following TICKscript sends the message, "Hey, check your CPU", to Talk
whenever idle CPU usage drops below 10% using the `.talk()` event handler.

_**talk-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .talk()
      .title('Alert from Kapacitor')      
```

### Send alerts to Talk from a defined handler

The following setup sends an alert to the `cpu` topic with the message,
"Hey, check your CPU".
A Talk handler is added that subscribes to the `cpu` topic and publishes all
alert messages to Talk.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an alert message to the `cpu` topic any time idle CPU
usage drops below 10%.

_**cpu\_alert.tick**_
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the Talk event
handler to send alerts to Talk.

_**talk\_cpu\_handler.yaml**_
```yaml
id: talk-cpu-alert
topic: cpu
kind: talk
options:
  title: Alert from Kapacitor
```

Add the handler:

```bash
kapacitor define-topic-handler talk_cpu_handler.yaml
```
