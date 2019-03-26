---
title: The InfluxDB Anti-Entropy API
menu:
  enterprise_influxdb_1_7:
    menu: Anti-Entropy API
    weight: 40
    parent: Administration
---

The [Anti-Entropy service](/enterprise_influxdb/v1.7/administration/anti-entropy) can be used by InfluxDB Enterprise clusters to monitor and repair entropy within data nodes and their shards. 
The following API endpoints are used by the  in InfluxDB Enterprise.

>**Note:** The Anti-Entropy API is only available when the Anti-Entropy service is enabled 
> in the data node configuration files. For information on the configuration settings, see 
> [Anti-Entropy settings](/enterprise_influxdb/v1.7/administration/config-data-nodes#anti-entropy-settings).

Base URL: `localhost:8086/shard-repair`

## Anti-Entropy API 

### `/status`

#### GET

#### Description

List shards that are in an inconsistent state and in need of repair.

#### Parameters

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| local | query | Limit status check to local shards on the data node handling this request | No | boolean |

#### Responses

Response content type: `application/json`


| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | successful operation | object |

### Example

#### cURL

```bash
curl -X GET "http://localhost:8086/shard-repair/status?local=true" -H "accept: application/json"
```

#### Request URL

```text
http://localhost:8086/shard-repair/status?local=true

```

#### Server response

Example value

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

### `/repair`

### POST  

#### Description

Queue shard for repair of inconsistent state.

#### Parameters

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| id | query | ID of shard to queue for repair | Yes | integer |

#### Responses

Response content type: `application/json`

| Code | Description |
| ---- | ----------- |
| 204 | Successful operation |
| 400 | Bad request |
| 500 | Internal server error |

### Example

#### cURL

```bash
curl -X POST "http://localhost:8086/shard-repair/repair?id=1" -H "accept: application/json"
```

#### Request URL

```text
http://localhost:8086/shard-repair/repair?id=1
```

### `/cancel-repair`

#### POST

#### Description

Remove shard from repair queue on nodes.

#### Parameters

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| id | query | ID of shard to remove from repair queue | Yes | integer |
| local | query | Only remove shard from repair queue on node receiving the request | No | boolean |

#### Responses

Response content type: `application/json`

| Code | Description |
| ---- | ----------- |
| 204 | successful operation |
| 400 | bad request |
| 500 | internal server error |

#### Example

##### cURL

```bash
curl -X POST "http://localhost:8086/shard-repair/cancel-repair?id=1&local=false" -H "accept: application/json"
```

##### Request URL

```text
http://localhost:8086/shard-repair/cancel-repair?id=1&local=false
```

### Models

#### ShardStatus

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string |  | No |
| database | string |  | No |
| retention_policy | string |  | No |
| start_time | string |  | No |
| end_time | string |  | No |
| expires | string |  | No |
| status | string |  | No |

##### Server response

Example value

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
