---
title: InfluxDB Anti-Entropy API
description: Use the InfluxDB Anti-Entropy API to monitor and repair shards on InfluxDB Enterprise data nodes.
menu:
  enterprise_influxdb_1_7:
    name: Anti-Entropy API
    weight: 70
    parent: Administration
---

>**Note:** The Anti-Entropy API is available from the meta nodes and is only available when the Anti-Entropy service 
> is enabled in the data node configuration settings. For information on the configuration settings, see
> [Anti-Entropy settings](/enterprise_influxdb/v1.7/administration/config-data-nodes/#anti-entropy-ae-settings).

Use the [Anti-Entropy service](/enterprise_influxdb/v1.7/administration/anti-entropy) in InfluxDB Enterprise to monitor and repair entropy in data nodes and their shards. To access the Anti-Entropy API and work with this service, use [`influx-ctl entropy`](/enterprise_influxdb/v1.7/administration/cluster-commands/#entropy) (also available on meta nodes).

The base URL is:

```text
http://localhost:8086/shard-repair`
```

## GET `/status`

### Description

Lists shards that are in an inconsistent state and in need of repair.

### Parameters

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| `local` | query | Limits status check to local shards on the data node handling this request | No | boolean |

### Responses

#### Headers

| Header name | Value              |
|-------------|--------------------|
| `Accept`    | `application/json` |

#### Status codes

| Code | Description | Type |
| ---- | ----------- | ------ |
| `200` | `Successful operation` | object |

### Examples

#### cURL request

```bash
curl -X GET "http://localhost:8086/shard-repair/status?local=true" -H "accept: application/json"
```

#### Request URL

```text
http://localhost:8086/shard-repair/status?local=true

```

### Responses

Example of server response value:

```json
{
  "shards": [
    {
      "id": "1",
      "database": "ae",
      "retention_policy": "autogen",
      "start_time": "-259200000000000",
      "end_time": "345600000000000",
      "expires": "0",
      "status": "diff"
    },
    {
      "id": "3",
      "database": "ae",
      "retention_policy": "autogen",
      "start_time": "62640000000000000",
      "end_time": "63244800000000000",
      "expires": "0",
      "status": "diff"
    }
  ],
  "queued_shards": [
    "3",
    "5",
    "9"
  ],
  "processing_shards": [
    "3",
    "9"
  ]
}
```

## POST `/repair`

### Description

Queues the specified shard for repair of the inconsistent state.

### Parameters

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| `id` | query | ID of shard to queue for repair | Yes | integer |

### Responses

#### Headers

| Header name | Value |
| ----------- | ----- |
| `Accept` | `application/json` |

#### Status codes

| Code | Description |
| ---- | ----------- |
| `204` | `Successful operation` |
| `400` | `Bad request` |
| `500` | `Internal server error` |

### Examples

#### cURL request

```bash
curl -X POST "http://localhost:8086/shard-repair/repair?id=1" -H "accept: application/json"
```

#### Request URL

```text
http://localhost:8086/shard-repair/repair?id=1
```

## POST `/cancel-repair`

### Description

Removes the specified shard from the repair queue on nodes.

### Parameters

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| `id` | query | ID of shard to remove from repair queue | Yes | integer |
| `local` | query | Only remove shard from repair queue on node receiving the request | No | boolean |

### Responses

#### Headers

| Header name | Value              |
|-------------|--------------------|
| `Accept`    | `application/json` |

#### Status codes

| Code | Description |
| ---- | ----------- |
| `204` | `Successful operation` |
| `400` | `Bad request` |
| `500` | `Internal server error` |

### Examples

#### cURL request

```bash
curl -X POST "http://localhost:8086/shard-repair/cancel-repair?id=1&local=false" -H "accept: application/json"
```

#### Request URL

```text
http://localhost:8086/shard-repair/cancel-repair?id=1&local=false
```

## Models

### ShardStatus

| Name | Type | Required |
| ---- | ---- | -------- |
| `id` | string | No |
| `database` | string | No |
| `retention_policy` | string | No |
| `start_time` | string | No |
| `end_time` | string | No |
| `expires` | string | No |
| `status` | string | No |

### Examples


```json
{
  "shards": [
    {
      "id": "1",
      "database": "ae",
      "retention_policy": "autogen",
      "start_time": "-259200000000000",
      "end_time": "345600000000000",
      "expires": "0",
      "status": "diff"
    },
    {
      "id": "3",
      "database": "ae",
      "retention_policy": "autogen",
      "start_time": "62640000000000000",
      "end_time": "63244800000000000",
      "expires": "0",
      "status": "diff"
    }
  ],
  "queued_shards": [
    "3",
    "5",
    "9"
  ],
  "processing_shards": [
    "3",
    "9"
  ]
}
```
