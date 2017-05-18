---
title: API Reference
aliases:
    - influxdb/v1.1/concepts/api/
menu:
  influxdb_1_1:
    weight: 10
    parent: tools
---

The InfluxDB API provides a simple way interact with the database.
It uses HTTP response codes, HTTP authentication, JWT Tokens, and basic authentication, and
responses are returned in JSON.

The following sections assume your InfluxDB instance is running on `localhost`
port `8086` and HTTPS is not enabled.
Those settings [are configurable](/influxdb/v1.1/administration/config/#http).

# Endpoints

| Endpoint    | Description |
| :---------- | :---------- |
| [/ping](#ping) | Use `/ping` to check the status of your InfluxDB instance and your version of InfluxDB. |
| [/query](#query) | Use `/query` to query data and manage databases, retention policies, and users. |
| [/write](#write) | Use `/write` to write data to a pre-existing database. |

## /ping

The ping endpoint accepts both `GET` and `HEAD` HTTP requests.
Use this endpoint to check the status of your InfluxDB instance and your version
of InfluxDB.

### Definition
```
GET http://localhost:8086/ping
```
```
HEAD http://localhost:8086/ping
```

### Example

Extract the version of your InfluxDB instance in the `X-Influxdb-Version` field
of the header:
```bash
$ curl -sl -I localhost:8086/ping

HTTP/1.1 204 No Content
Request-Id: 7d641f0b-e23b-11e5-8005-000000000000
X-Influxdb-Version: 1.0.x
Date: Fri, 04 Mar 2016 19:01:23 GMT
```

### Status Codes and Responses

The response body is empty.

| HTTP Status Code   | Description    |
| :----------------- | :------------- |
| 204      | Success! Your InfluxDB instance is up and running.      |

## /query

The `/query` endpoint accepts `GET` and `POST` HTTP requests.
Use this endpoint to query data and manage databases, retention policies,
and users.

### Definition

```
GET http://localhost:8086/query
```
```
POST http://localhost:8086/query
```

### Verb usage

| Verb  | Query Type |
| :---- | :--------- |
| GET   | Use for all queries that start with: <br><br> [`SELECT`](/influxdb/v1.1/query_language/spec/#select)* <br><br> [`SHOW`](/influxdb/v1.1/query_language/spec/#show-continuous-queries)   |
| POST  | Use for all queries that start with: <br><br> [`ALTER`](/influxdb/v1.1/query_language/spec/#alter-retention-policy) <br><br> [`CREATE`](/influxdb/v1.1/query_language/spec/#create-continuous-query) <br><br> [`DELETE`](/influxdb/v1.1/query_language/spec/#delete) <br><br> [`DROP`](/influxdb/v1.1/query_language/spec/#drop-continuous-query) <br><br> [`GRANT`](/influxdb/v1.1/query_language/spec/#grant) <br><br> [`KILL`](/influxdb/v1.1/query_language/spec/#kill-query) <br><br> [`REVOKE`](/influxdb/v1.1/query_language/spec/#revoke) |

\* The only exceptions are `SELECT` queries that include an [`INTO` clause](/influxdb/v1.1/query_language/data_exploration/#the-into-clause).
Those `SELECT` queries require a `POST` request.

#### Examples

##### Example 1: Query data with a `SELECT` statement
<br>
```
$ curl -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * FROM "mymeas"'

{"results":[{"series":[{"name":"mymeas","columns":["time","myfield","mytag1","mytag2"],"values":[["2016-05-20T21:30:00Z",12,"1",null],["2016-05-20T21:30:20Z",11,"2",null],["2016-05-20T21:30:40Z",18,null,"1"],["2016-05-20T21:31:00Z",19,null,"3"]]}]}]}
```

##### Example 2: Query data with a `SELECT` statement and an `INTO` clause
<br>
```
$ curl -XPOST 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * INTO "newmeas" FROM "mymeas"'

{"results":[{"series":[{"name":"result","columns":["time","written"],"values":[["1970-01-01T00:00:00Z",4]]}]}]}
```

##### Example 3: Create a database
<br>
```
$ curl -XPOST 'http://localhost:8086/query' --data-urlencode 'q=CREATE DATABASE "mydb"'

{"results":[{}]}
```

### Query String Parameters

| Query String Parameter | Optional/Required | Definition |
| :--------------------- | :---------------- |:---------- |
| chunked=[true \| \<number_of_points>] | Optional | Returns points in streamed batches instead of in a single response. If set to `true`, InfluxDB chunks responses by series or by every 10,000 points, whichever occurs first. If set to a specific value, InfluxDB chunks responses by series or by that number of points.  |
| db=\<database_name> | Required for database-dependent queries (most [`SELECT`](/influxdb/v1.1/query_language/spec/#select) queries and [`SHOW`](/influxdb/v1.1/query_language/spec/#show-continuous-queries) queries require this parameter). | Sets the target [database](/influxdb/v1.1/concepts/glossary/#database) for the query. |
| epoch=[ns,u,ms,s,m,h] | Optional | Returns epoch timestamps with the specified precision. By default, InfluxDB returns timestamps in RFC3339 format with nanosecond precision. |
| p=\<password> | Optional if you haven't [enabled authentication](/influxdb/v1.1/query_language/authentication_and_authorization/#set-up-authentication). Required if you've enabled authentication.* | Sets the password for authentication if you've enabled authentication. Use with the query string parameter `u`. |
| pretty=true | Optional | Enables pretty-printed JSON output. While this is useful for debugging it is not recommended for production use as it consumes unnecessary network bandwidth. |
| rp=\<retention_policy_name> | Optional | Sets the target [retention policy](/influxdb/v1.1/concepts/glossary/#retention-policy-rp) for the query. InfluxDB queries the database's default retention policy if you do not specify a retention policy.  |
| u=\<username> | Optional if you haven't [enabled authentication](/influxdb/v1.1/query_language/authentication_and_authorization/#set-up-authentication). Required if you've enabled authentication.* | Sets the username for authentication if you've enabled authentication. The user must have read access to the database. Use with the query string parameter `p`. |

\* The HTTP API also supports basic authentication.
Use basic authentication if you've [enabled authentication](/influxdb/v1.1/query_language/authentication_and_authorization/#set-up-authentication)
and aren't using the query string parameters `u` and `p`.
See below for an [example](#example-4-create-a-database-using-basic-authentication) of basic authentication.

#### Examples

##### Example 1: Query data with a `SELECT` statement and return pretty-printed JSON
<br>
```
$ curl -G 'http://localhost:8086/query?db=mydb&pretty=true' --data-urlencode 'q=SELECT * FROM "mymeas"'

{
    "results": [
        {
            "series": [
                {
                    "name": "mymeas",
                    "columns": [
                        "time",
                        "myfield",
                        "mytag1",
                        "mytag2"
                    ],
                    "values": [
                        [
                            "2016-05-20T21:30:00Z",
                            12,
                            "1",
                            null
                        ],
                        [
                            "2016-05-20T21:30:20Z",
                            11,
                            "2",
                            null
                        ],
                        [
                            "2016-05-20T21:30:40Z",
                            18,
                            null,
                            "1"
                        ],
                        [
                            "2016-05-20T21:31:00Z",
                            19,
                            null,
                            "3"
                        ]
                    ]
                }
            ]
        }
    ]
}
```

##### Example 2: Query data with a `SELECT` statement and return second precision epoch timestamps
<br>
```
$ curl -G 'http://localhost:8086/query?db=mydb&epoch=s' --data-urlencode 'q=SELECT * FROM "mymeas"'

{"results":[{"series":[{"name":"mymeas","columns":["time","myfield","mytag1","mytag2"],"values":[[1463779800,12,"1",null],[1463779820,11,"2",null],[1463779840,18,null,"1"],[1463779860,19,null,"3"]]}]}]}
```

##### Example 3: Create a database using HTTP authentication
<br>
```
$ curl -XPOST 'http://localhost:8086/query?u=myusername&p=mypassword' --data-urlencode 'q=CREATE DATABASE "mydb"'

{"results":[{}]}
```

##### Example 4: Create a database using basic authentication
<br>
```
$ curl -XPOST -u myusername:mypassword 'http://localhost:8086/query' --data-urlencode 'q=CREATE DATABASE "mydb"'

{"results":[{}]}
```

### Request Body

```
--data-urlencode "q=<InfluxQL query>"
```

All queries must be URL encoded and follow
[InfluxQL](/influxdb/v1.1/query_language/) syntax.
Our example shows the `--data-urlencode` parameter from `curl`, which we will
use in all examples on this page.

#### Options

##### Request Multiple Queries
<br>
Delimit multiple queries with a semicolon `;`.

##### Submit Queries from a File
<br>
The API supports submitting queries from a file using a multipart `POST`
request.
The queries in the file must be separated a semicolon (`;`).

Syntax:
```
curl -F "q=@<path_to_file>" -F "async=true" http://localhost:8086/query
```

##### Request Query Results in CSV format
<br>
The API can return query results in CSV format.

Syntax:
```
curl -H "Accept: application/csv" -G 'http://localhost:8086/query [...]
```

##### Bind Parameters
<br>
The API supports binding parameters to particular field values or tag values in
the `WHERE` clause.
Use the syntax `$<placeholder_key>` as a placeholder in the query, and URL
encode the map of placeholder keys to placeholder values in the request body:

Query syntax:
```
--data-urlencode 'q= SELECT [...] WHERE [ <field_key> | <tag_key> ] = $<placeholder_key>'
```

Map syntax:
```
--data-urlencode 'params={"<placeholder_key>":[ <placeholder_float_field_value> | <placeholder_integer_field_value> | "<placeholder_string_field_value>" | <placeholder_boolean_field_value> | "<placeholder_tag_value>" ]}'
```

Delimit multiple placeholder key-value pairs with comma `,`.

#### Examples
##### Example 1: Send multiple queries
<br>
```
$ curl -G 'http://localhost:8086/query?db=mydb&epoch=s' --data-urlencode 'q=SELECT * FROM "mymeas";SELECT mean("myfield") FROM "mymeas"'

{"results":[{"series":[{"name":"mymeas","columns":["time","myfield","mytag1","mytag2"],"values":[[1463779800,12,"1",null],[1463779820,11,"2",null],[1463779840,18,null,"1"],[1463779860,19,null,"3"]]}]},{"series":[{"name":"mymeas","columns":["time","mean"],"values":[[0,15]]}]}]}
```

##### Example 2: Request query results in CSV format
<br>
```
curl -H "Accept: application/csv" -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * FROM "mymeas" LIMIT 3'

name,tags,time,tag1,tag2,value
mymeas,,1478030187213306198,blue,tag2,23
mymeas,,1478030189872408710,blue,tag2,44
mymeas,,1478030203683809554,blue,yellow,101
```

##### Example 3: Submit queries from a file
<br>
```
curl -F "q=@queries.txt" -F "async=true" 'http://localhost:8086/query'
```

A sample of the queries in `queries.txt`:
```
CREATE DATABASE mydb;
CREATE RETENTION POLICY four_weeks ON mydb DURATION 4w REPLICATION 1;
```

##### Example 4: Bind a parameter in the `WHERE` clause to specific tag value
<br>
```
curl -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * FROM "mymeas" WHERE "mytagkey" = $tag_value' --data-urlencode 'params={"tag_value":"mytagvalue1"}'

{"results":[{"series":[{"name":"mymeas","columns":["time","myfieldkey","mytagkey"],"values":[["2016-09-05T18:25:08.479629934Z",9,"mytagvalue1"],["2016-09-05T18:25:20.892472038Z",8,"mytagvalue1"],["2016-09-05T18:25:30.408555195Z",10,"mytagvalue1"],["2016-09-05T18:25:39.108978991Z",111,"mytagvalue1"]]}]}]}
```

##### Example 5: Bind a parameter in the `WHERE` clause to a numerical field value
<br>
```
curl -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * FROM "mymeas" WHERE "myfieldkey" > $field_value' --data-urlencode 'params={"field_value":9}'

{"results":[{"series":[{"name":"mymeas","columns":["time","myfieldkey","mytagkey"],"values":[["2016-09-05T18:25:30.408555195Z",10,"mytagvalue1"],["2016-09-05T18:25:39.108978991Z",111,"mytagvalue1"],["2016-09-05T18:25:46.587728107Z",111,"mytagvalue2"]]}]}]}
```

##### Example 6: Bind two parameters in the `WHERE` clause to a specific tag value and numerical field value
<br>
```
curl -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * FROM "mymeas" WHERE "mytagkey" = $tag_value AND  "myfieldkey" > $field_value' --data-urlencode 'params={"tag_value":"mytagvalue2","field_value":9}'

{"results":[{"series":[{"name":"mymeas","columns":["time","myfieldkey","mytagkey"],"values":[["2016-09-05T18:25:46.587728107Z",111,"mytagvalue2"]]}]}]}
```

### Status codes and responses

Responses are returned in JSON.
Enable pretty-print JSON by including the query string parameter `pretty=true`.

#### Summary Table

| HTTP status code | Description |
| :--------------- | :---------- |
| 200 OK | Success! The returned JSON offers further information. |
| 400 Bad Request | Unacceptable request. Can occur with a syntactically incorrect query. The returned JSON offers further information. |

#### Examples
##### Example 1: A successful request that returns data
<br>
```
$ curl -i -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * FROM "mymeas"'

HTTP/1.1 200 OK
[...]
{"results":[{"series":[{"name":"mymeas","columns":["time","myfield","mytag1","mytag2"],"values":[["2016-05-20T21:30:00Z",12,"1",null],["2016-05-20T21:30:20Z",11,"2",null],["2016-05-20T21:30:40Z",18,null,"1"],["2016-05-20T21:31:00Z",19,null,"3"]]}]}]}
```

##### Example 2: A successful request that returns an error
<br>
```
$ curl -i -G 'http://localhost:8086/query?db=mydb1' --data-urlencode 'q=SELECT * FROM "mymeas"'

HTTP/1.1 200 OK
[...]
{"results":[{"error":"database not found: mydb1"}]}
```

##### Example 3: An incorrectly formatted query
<br>
```
$ curl -i -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT *'

HTTP/1.1 400 Bad Request
[...]
{"error":"error parsing query: found EOF, expected FROM at line 1, char 9"}
```

## /write

The `/write` endpoint accepts `POST` HTTP requests.
Use this endpoint to write data to a pre-existing database.

### Definition

```
POST http://localhost:8086/write
```

### Query String Parameters

| Query String Parameter | Optional/Required | Description |
| :--------------------- | :---------------- | :---------- |
| consistency=[any,one,quorum,all] | Optional, available with [InfluxEnterprise clusters](/enterprise_influxdb/v1.1/) only. | Sets the write consistency for the point. InfluxDB assumes that the write consistency is `one` if you do not specify `consistency`. See the [InfluxEnterprise documentation](https://docs.influxdata.com/enterprise_influxdb/v1.1/concepts/clustering#write-consistency) for detailed descriptions of each consistency option. |
| db=\<database> | Required | Sets the target [database](/influxdb/v1.1/concepts/glossary/#database) for the write. |
| p=\<password> | Optional if you haven't [enabled authentication](/influxdb/v1.1/query_language/authentication_and_authorization/#set-up-authentication). Required if you've enabled authentication.* | Sets the password for authentication if you've enabled authentication. Use with the query string parameter `u`. |
| precision=[ns,u,ms,s,m,h] | Optional | Sets the precision for the supplied Unix time values. InfluxDB assumes that timestamps are in nanoseconds if you do not specify `precision`.** |
| rp=\<retention_policy_name> | Optional | Sets the target [retention policy](/influxdb/v1.1/concepts/glossary/#retention-policy-rp) for the write. InfluxDB writes to the `DEFAULT` retention policy if you do not specify a retention policy. |
| u=\<username> | Optional if you haven't [enabled authentication](/influxdb/v1.1/query_language/authentication_and_authorization/#set-up-authentication). Required if you've enabled authentication.* | Sets the username for authentication if you've enabled authentication. The user must have write access to the database. Use with the query string parameter `p`. |

\* The HTTP API also supports basic authentication.
Use basic authentication if you've [enabled authentication](/influxdb/v1.1/query_language/authentication_and_authorization/#set-up-authentication)
and aren't using the query string parameters `u` and `p`.
See below for an [example](#example-4-write-a-point-to-the-database-mydb-using-basic-authentication) of basic authentication.

\*\* We recommend using the least precise precision possible as this can result
in significant improvements in compression.

#### Examples

##### Example 1: Write a point to the database `mydb` with a timestamp in seconds
<br>
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb&precision=s" --data-binary 'mymeas,mytag=1 myfield=90 1463683075'
```

##### Example 2: Write a point to the database `mydb` and the retention policy `myrp`
<br>
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb&rp=myrp" --data-binary 'mymeas,mytag=1 myfield=90'
```

##### Example 3: Write a point to the database `mydb` using HTTP authentication
<br>
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb&u=myusername&p=mypassword" --data-binary 'mymeas,mytag=1 myfield=91'
```

##### Example 4: Write a point to the database `mydb` using basic authentication
<br>
```
$ curl -i -XPOST -u myusername:mypassword "http://localhost:8086/write?db=mydb" --data-binary 'mymeas,mytag=1 myfield=91'
```

### Request Body

```
--data-binary '<Data in Line Protocol format>'
```

All data must be binary encoded and in the
[Line Protocol](/influxdb/v1.1/concepts/glossary/#line-protocol) format.
Our example shows the `--data-binary` parameter from curl, which we will use in
all examples on this page.
Using any encoding method other than `--data-binary` will likely lead to issues;
`-d`, `--data-urlencode`, and `--data-ascii` may strip out newlines or
introduce new, unintended formatting.

Options:

* Write several points to the database with one request by separating each point
by a new line.
* Write points from a file with the `@` flag.
The file should contain a batch of points in the Line Protocol format.
Individual points must be on their own line and separated by newline characters
(`\n`).
Files containing carriage returns will cause parser errors.

    We recommend writing points in batches of 5,000 to 10,000 points.
Smaller batches, and more HTTP requests, will result in sub-optimal performance.

#### Examples

##### Example 1: Write a point to the database `mydb` with a nanosecond timestamp
<br>
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb" --data-binary 'mymeas,mytag=1 myfield=90 1463683075000000000'
```

##### Example 2: Write a point to the database `mydb` with the local server's nanosecond timestamp
<br>
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb" --data-binary 'mymeas,mytag=1 myfield=90'
```

##### Example 3: Write several points to the database `mydb` by separating points with a new line
<br>
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb" --data-binary 'mymeas,mytag=3 myfield=89
mymeas,mytag=2 myfield=34 1463689152000000000'
```

##### Example 4: Write several points to the database `mydb` from the file `data.txt`
<br>
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb" --data-binary @data.txt
```

A sample of the data in `data.txt`:
```
mymeas,mytag1=1 value=21 1463689680000000000
mymeas,mytag1=1 value=34 1463689690000000000
mymeas,mytag2=8 value=78 1463689700000000000
mymeas,mytag3=9 value=89 1463689710000000000
```

### Status codes and responses

In general, status codes of the form `2xx` indicate success, `4xx` indicate
that InfluxDB could not understand the request, and `5xx` indicate that the
system is overloaded or significantly impaired.
Errors are returned in JSON.

#### Summary Table

| HTTP status code | Description    |
| :--------------- | :------------- |
| 204 No Content   | Success!      |
| 400 Bad Request  | Unacceptable request. Can occur with a Line Protocol syntax error or if a user attempts to write values to a field that previously accepted a different value type. The returned JSON offers further information. |
| 404 Not Found    | Unacceptable request. Can occur if a user attempts to write to a database that does not exist. The returned JSON offers further information. |
| 500 Internal Server Error  | The system is overloaded or significantly impaired. Can occur if a user attempts to write to a retention policy that does not exist. The returned JSON offers further information. |

#### Examples

##### Example 1: A successful write
<br>
```
HTTP/1.1 204 No Content
```

##### Example 2: Write a point with an incorrect timestamp
<br>
```
HTTP/1.1 400 Bad Request
[...]
{"error":"unable to parse 'mymeas,mytag=1 myfield=91 abc123': bad timestamp"}
```

##### Example 3: Write an integer to a field that previously accepted a float
<br>
```
HTTP/1.1 400 Bad Request
[...]
{"error":"field type conflict: input field \"myfield\" on measurement \"mymeas\" is type int64, already exists as type float"}
```

##### Example 4: Write a point to a database that doesn't exist
<br>
```
HTTP/1.1 404 Not Found
[...]
{"error":"database not found: \"mydb1\""}
```

##### Example 5: Write a point to a retention policy that doesn't exist
<br>
```
HTTP/1.1 500 Internal Server Error
[...]
{"error":"retention policy not found: myrp"}
```
