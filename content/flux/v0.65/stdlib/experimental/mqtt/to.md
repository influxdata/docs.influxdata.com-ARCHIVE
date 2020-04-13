---
title: mqtt.to() function
description: >
  The `mqtt.to()` function outputs data to an MQTT broker using MQTT protocol.
menu:
  flux_0_65:
    name: mqtt.to
    parent: MQTT
weight: 301
---

The `mqtt.to()` function outputs data to an MQTT broker using MQTT protocol.

_**Function type:** Output_

```js
import "experimental/mqtt"

mqtt.to(
  broker: "tcp://localhost:8883",
  topic: "example-topic",
  message: "Example message",
  qos: 0,
  clientid: "flux-mqtt",
  username: "username",
  password: "password",
  name: "name-example",
  timeout: 1s,
  timeColumn: "_time",
  tagColumns: ["tag1", "tag2"],
  valueColumns: ["_value"]
)
```

## Parameters

### broker
The MQTT broker connection string.

_**Data type:** String_

### topic
The MQTT topic to send data to.

_**Data type:** String_

### message
The message or payload to send to the MQTT broker.
The default payload is an output table.
If there are multiple output tables, it sends each table as a separate MQTT message.

{{% note %}}
When you specify a message, the function sends the message string only (no output table).
{{% /note %}}

_**Data type:** String_

### qos
The [MQTT Quality of Service (QoS)](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901103) level.
Values range from `[0-2]`.
Default is `0`.

_**Data type:** Integer_

### clientid
The MQTT client ID.

_**Data type:** String_

### username
The username to send to the MQTT broker.
Username is only required if the broker requires authentication.
If you provide a username, you must provide a [password](#password).

_**Data type:** String_

### password
The password to send to the MQTT broker.
Password is only required if the broker requires authentication.
If you provide a password, you must provide a [username](#username).

_**Data type:** String_

### name
_(Optional)_ The name for the MQTT message.

_**Data type:** String_

### timeout
The MQTT connection timeout.
Default is `1s`.

_**Data type:** Duration_

### timeColumn
The column to use as time values in the output line protocol.
Default is `"_time"`.  

_**Data type:** String_

### tagColumns
The columns to use as tag sets in the output line protocol.
Default is `[]`.  

_**Data type:** Array of strings_

### valueColumns
The columns to use as field values in the output line protocol.
Default is `["_value"]`.

_**Data type:** Array of strings_

## Examples

### Send data to an MQTT endpoint
```js
import "experimental/mqtt"

from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "airSensor")
  |> mqtt.to(
    broker: "tcp://localhost:8883",
    topic: "air-sensors",
    clientid: "sensor-12a4",
    tagColumns: ["sensorID"],
    valueColumns: ["_value"]
  )
```
