---
title: API Reference
aliases:
    - influxdb/v1.2/concepts/api/
menu:
  influxdb_1_2:
    weight: 10
    parent: tools
---

The InfluxDB API provides a simple way interact with the database.
It uses HTTP response codes, HTTP authentication, JWT Tokens, and basic authentication, and
responses are returned in JSON.

The following sections assume your InfluxDB instance is running on `localhost`
port `8086` and HTTPS is not enabled.
Those settings [are configurable](/influxdb/v1.2/administration/config/#http).

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
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 00:09:52 GMT
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
| GET   | Use for all queries that start with: <br><br> [`SELECT`](/influxdb/v1.2/query_language/spec/#select)* <br><br> [`SHOW`](/influxdb/v1.2/query_language/spec/#show-continuous-queries)   |
| POST  | Use for all queries that start with: <br><br> [`ALTER`](/influxdb/v1.2/query_language/spec/#alter-retention-policy) <br><br> [`CREATE`](/influxdb/v1.2/query_language/spec/#create-continuous-query) <br><br> [`DELETE`](/influxdb/v1.2/query_language/spec/#delete) <br><br> [`DROP`](/influxdb/v1.2/query_language/spec/#drop-continuous-query) <br><br> [`GRANT`](/influxdb/v1.2/query_language/spec/#grant) <br><br> [`KILL`](/influxdb/v1.2/query_language/spec/#kill-query) <br><br> [`REVOKE`](/influxdb/v1.2/query_language/spec/#revoke) |

\* The only exceptions are `SELECT` queries that include an [`INTO` clause](/influxdb/v1.2/query_language/data_exploration/#the-into-clause).
Those `SELECT` queries require a `POST` request.

#### Examples

##### Example 1: Query data with a `SELECT` statement
<br>
```
$ curl -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * FROM "mymeas"'

{"results":[{"statement_id":0,"series":[{"name":"mymeas","columns":["time","myfield","mytag1","mytag2"],"values":[["2017-03-01T00:16:18Z",33.1,null,null],["2017-03-01T00:17:18Z",12.4,"12","14"]]}]}]}
```

The `mymeas` [measurement](/influxdb/v1.2/concepts/glossary/#measurement) has two points.
The first point has the [timestamp](/influxdb/v1.2/concepts/glossary/#timestamp) `2017-03-01T00:16:18Z`, a `myfield` value of `33.1`, and no tag values for the `mytag1` and `mytag2` [tag keys](/influxdb/v1.2/concepts/glossary/#tag-key).
The second point has the timestamp `2017-03-01T00:17:18Z`, a `myfield` value of `12.4`, a `mytag1` value of `12`, and a `mytag2` value of `14`.

The same query in InfluxDB's [Command Line Interface](/influxdb/v1.2/tools/shell/) (CLI) returns the following table:
```
name: mymeas
time                  myfield  mytag1  mytag2
----                  -------  ------  ------
2017-03-01T00:16:18Z  33.1
2017-03-01T00:17:18Z  12.4     12      14
```

##### Example 2: Query data with a `SELECT` statement and an `INTO` clause
<br>
```
$ curl -XPOST 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * INTO "newmeas" FROM "mymeas"'

{"results":[{"statement_id":0,"series":[{"name":"result","columns":["time","written"],"values":[["1970-01-01T00:00:00Z",2]]}]}]}
```

`SELECT` queries that include and [`INTO` clause](/influxdb/v1.2/query_language/data_exploration/#the-into-clause) require a `POST` request.

The response shows that InfluxDB writes two points to the `newmeas` [measurement](/influxdb/v1.2/concepts/glossary/#measurement).
Note that the system uses epoch 0 (`1970-01-01T00:00:00Z`) as a [null timestamp equivalent](/influxdb/v1.2/troubleshooting/frequently-asked-questions/#why-does-my-query-return-epoch-0-as-the-timestamp).

##### Example 3: Create a database
<br>
```
$ curl -XPOST 'http://localhost:8086/query' --data-urlencode 'q=CREATE DATABASE "mydb"'

{"results":[{"statement_id":0}]}
```

A successful [`CREATE DATABASE` query](/influxdb/v1.2/query_language/database_management/#create-database) returns no additional information.

### Query String Parameters

| Query String Parameter | Optional/Required | Definition |
| :--------------------- | :---------------- |:---------- |
| chunked=[true \| \<number_of_points>] | Optional | Returns points in streamed batches instead of in a single response. If set to `true`, InfluxDB chunks responses by series or by every 10,000 points, whichever occurs first. If set to a specific value, InfluxDB chunks responses by series or by that number of points.*  |
| db=\<database_name> | Required for database-dependent queries (most [`SELECT`](/influxdb/v1.2/query_language/spec/#select) queries and [`SHOW`](/influxdb/v1.2/query_language/spec/#show-continuous-queries) queries require this parameter). | Sets the target [database](/influxdb/v1.2/concepts/glossary/#database) for the query. |
| epoch=[ns,u,µ,ms,s,m,h] | Optional | Returns epoch timestamps with the specified precision. By default, InfluxDB returns timestamps in RFC3339 format with nanosecond precision. Both `u` and `µ` indicate microseconds. |
| p=\<password> | Optional if you haven't [enabled authentication](/influxdb/v1.2/query_language/authentication_and_authorization/#set-up-authentication). Required if you've enabled authentication.** | Sets the password for authentication if you've enabled authentication. Use with the query string parameter `u`. |
| pretty=true | Optional | Enables pretty-printed JSON output. While this is useful for debugging it is not recommended for production use as it consumes unnecessary network bandwidth. |
| u=\<username> | Optional if you haven't [enabled authentication](/influxdb/v1.2/query_language/authentication_and_authorization/#set-up-authentication). Required if you've enabled authentication.* | Sets the username for authentication if you've enabled authentication. The user must have read access to the database. Use with the query string parameter `p`. |

\* In versions 1.2.0 and 1.2.1, InfluxDB automatically truncates the number of rows returned for requests without the `chunked` parameter.
By default, the maximum number of rows returned is set to 10,000.
If a query has more than 10,000 rows to return, InfluxDB includes a `"partial":true` tag in the response body.
The [`max-row-limit` setting](/influxdb/v1.2/administration/config/#max-row-limit-0) is configurable in the `[http]` section of the configuration file.
In version 1.2.2, the `max-row-limit` configuration option is set to `0` by default.
That default setting allows for an unlimited number of rows returned per request.

\** The HTTP API also supports basic authentication.
Use basic authentication if you've [enabled authentication](/influxdb/v1.2/query_language/authentication_and_authorization/#set-up-authentication)
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
            "statement_id": 0,
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
                            "2017-03-01T00:16:18Z",
                            33.1,
                            null,
                            null
                        ],
                        [
                            "2017-03-01T00:17:18Z",
                            12.4,
                            "12",
                            "14"
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

{"results":[{"statement_id":0,"series":[{"name":"mymeas","columns":["time","myfield","mytag1","mytag2"],"values":[[1488327378,33.1,null,null],[1488327438,12.4,"12","14"]]}]}]}
```

##### Example 3: Create a database using HTTP authentication
<br>
Valid credentials:
```
$ curl -XPOST 'http://localhost:8086/query?u=myusername&p=mypassword' --data-urlencode 'q=CREATE DATABASE "mydb"'

{"results":[{"statement_id":0}]}
```

A successful [`CREATE DATABASE` query](/influxdb/v1.2/query_language/database_management/#create-database) returns no additional information.

Invalid credentials:
```
$ curl -XPOST 'http://localhost:8086/query?u=myusername&p=notmypassword' --data-urlencode 'q=CREATE DATABASE "mydb"'

{"error":"authorization failed"}
```

##### Example 4: Create a database using basic authentication
<br>
Valid credentials:
```
$ curl -XPOST -u myusername:mypassword 'http://localhost:8086/query' --data-urlencode 'q=CREATE DATABASE "mydb"'

{"results":[{"statement_id":0}]}
```

A successful [`CREATE DATABASE` query](/influxdb/v1.2/query_language/database_management/#create-database) returns no additional information.

Invalid credentials:
```
$ curl -XPOST -u myusername:notmypassword 'http://localhost:8086/query' --data-urlencode 'q=CREATE DATABASE "mydb"'

{"error":"authorization failed"}
```

### Request Body

```
--data-urlencode "q=<InfluxQL query>"
```

All queries must be URL encoded and follow
[InfluxQL](/influxdb/v1.2/query_language/) syntax.
Our example shows the `--data-urlencode` parameter from `curl`, which we use in all examples on this page.

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
Syntax:
```
curl -H "Accept: application/csv" -G 'http://localhost:8086/query [...]
```

Note that when the request includes `-H "Accept: application/csv"`, the system returns timestamps in epoch format, not RFC3339 format.

##### Bind Parameters
<br>
The API supports binding parameters to particular field values or tag values in
the [`WHERE` clause](/influxdb/v1.2/query_language/data_exploration/#the-where-clause).
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

{"results":[{"statement_id":0,"series":[{"name":"mymeas","columns":["time","myfield","mytag1","mytag2"],"values":[[1488327378,33.1,null,null],[1488327438,12.4,"12","14"]]}]},{"statement_id":1,"series":[{"name":"mymeas","columns":["time","mean"],"values":[[0,22.75]]}]}]}
```

The request includes two queries: `SELECT * FROM "mymeas"` and `SELECT mean("myfield") FROM "mymeas"'`.
In the results, the system assigns a statement identifier to each query return.
The first query's result has a `statement_id` of `0` and the second query's result has a `statement_id` of `1`.

##### Example 2: Request query results in CSV format
<br>
```
$ curl -H "Accept: application/csv" -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * FROM "mymeas"'

name,tags,time,myfield,mytag1,mytag2
mymeas,,1488327378000000000,33.1,mytag1,mytag2
mymeas,,1488327438000000000,12.4,12,14
```

The first point has no [tag values](/influxdb/v1.2/concepts/glossary/#tag-value) for the `mytag1` and `mytag2` [tag keys](/influxdb/v1.2/concepts/glossary/#tag-key).

##### Example 3: Submit queries from a file
<br>
```
$ curl -F "q=@queries.txt" -F "async=true" 'http://localhost:8086/query'
```

A sample of the queries in `queries.txt`:
```
CREATE DATABASE mydb;
CREATE RETENTION POLICY four_weeks ON mydb DURATION 4w REPLICATION 1;
```

##### Example 4: Bind a parameter in the `WHERE` clause to specific tag value
<br>
```
$ curl -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * FROM "mymeas" WHERE "mytag1" = $tag_value' --data-urlencode 'params={"tag_value":"12"}'

{"results":[{"statement_id":0,"series":[{"name":"mymeas","columns":["time","myfield","mytag1","mytag2"],"values":[["2017-03-01T00:17:18Z",12.4,"12","14"]]}]}]}
```

The request maps `$tag_value` to `12`.
InfluxDB stores [tag values](/influxdb/v1.2/concepts/glossary/#tag-value) as strings they and must be double quoted in the request.

##### Example 5: Bind a parameter in the `WHERE` clause to a numerical field value
<br>
```
$ curl -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * FROM "mymeas" WHERE "myfield" > $field_value' --data-urlencode 'params={"field_value":30}'

{"results":[{"statement_id":0,"series":[{"name":"mymeas","columns":["time","myfield","mytag1","mytag2"],"values":[["2017-03-01T00:16:18Z",33.1,null,null]]}]}]}
```

The request maps `$field_value` to `30`.
The value `30` does not require double quotes because `myfield` stores numerical [field values](/influxdb/v1.2/concepts/glossary/#field-value).

##### Example 6: Bind two parameters in the `WHERE` clause to a specific tag value and numerical field value
<br>
```
$ curl -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * FROM "mymeas" WHERE "mytag1" = $tag_value AND  "myfield" < $field_value' --data-urlencode 'params={"tag_value":"12","field_value":30}'

{"results":[{"statement_id":0,"series":[{"name":"mymeas","columns":["time","myfield","mytag1","mytag2"],"values":[["2017-03-01T00:17:18Z",12.4,"12","14"]]}]}]}
```

The request maps `$tag_value` to `12` and `$field_value` to `30`.

### Status codes and responses

Responses are returned in JSON.
Include the query string parameter `pretty=true`
to enable pretty-print JSON.

#### Summary Table

| HTTP status code | Description |
| :--------------- | :---------- |
| 200 OK | Success! The returned JSON offers further information. |
| 400 Bad Request | Unacceptable request. Can occur with a syntactically incorrect query. The returned JSON offers further information. |
| 401 Unauthorized | Unacceptable request. Can occur with invalid authentication credentials. |

#### Examples
##### Example 1: A successful request that returns data
<br>
```
$ curl -i -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT * FROM "mymeas"'

HTTP/1.1 200 OK
Connection: close
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 19:22:54 GMT
Transfer-Encoding: chunked

{"results":[{"statement_id":0,"series":[{"name":"mymeas","columns":["time","myfield","mytag1","mytag2"],"values":[["2017-03-01T00:16:18Z",33.1,null,null],["2017-03-01T00:17:18Z",12.4,"12","14"]]}]}]}
```

##### Example 2: A successful request that returns an error
<br>
```
$ curl -i -G 'http://localhost:8086/query?db=mydb1' --data-urlencode 'q=SELECT * FROM "mymeas"'

HTTP/1.1 200 OK
Connection: close
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 19:23:48 GMT
Transfer-Encoding: chunked

{"results":[{"statement_id":0,"error":"database not found: mydb1"}]}
```

##### Example 3: An incorrectly formatted query
<br>
```
$ curl -i -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SELECT *'

HTTP/1.1 400 Bad Request
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 19:24:25 GMT
Content-Length: 76

{"error":"error parsing query: found EOF, expected FROM at line 1, char 9"}
```

##### Example 4: Query data with invalid authentication credentials
<br>
```
$ curl -i  -XPOST 'http://localhost:8086/query?u=myusername&p=notmypassword' --data-urlencode 'q=CREATE DATABASE "mydb"'

HTTP/1.1 401 Unauthorized
Content-Type: application/json
Request-Id: [...]
Www-Authenticate: Basic realm="InfluxDB"
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 19:11:26 GMT
Content-Length: 33

{"error":"authorization failed"}
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
| consistency=[any,one,quorum,all] | Optional, available with [InfluxEnterprise clusters](/enterprise_influxdb/v1.2/) only. | Sets the write consistency for the point. InfluxDB assumes that the write consistency is `one` if you do not specify `consistency`. See the [InfluxEnterprise documentation](https://docs.influxdata.com/enterprise_influxdb/v1.2/concepts/clustering#write-consistency) for detailed descriptions of each consistency option. |
| db=\<database> | Required | Sets the target [database](/influxdb/v1.2/concepts/glossary/#database) for the write. |
| p=\<password> | Optional if you haven't [enabled authentication](/influxdb/v1.2/query_language/authentication_and_authorization/#set-up-authentication). Required if you've enabled authentication.* | Sets the password for authentication if you've enabled authentication. Use with the query string parameter `u`. |
| precision=[ns,u,ms,s,m,h] | Optional | Sets the precision for the supplied Unix time values. InfluxDB assumes that timestamps are in nanoseconds if you do not specify `precision`.** |
| rp=\<retention_policy_name> | Optional | Sets the target [retention policy](/influxdb/v1.2/concepts/glossary/#retention-policy-rp) for the write. InfluxDB writes to the `DEFAULT` retention policy if you do not specify a retention policy. |
| u=\<username> | Optional if you haven't [enabled authentication](/influxdb/v1.2/query_language/authentication_and_authorization/#set-up-authentication). Required if you've enabled authentication.* | Sets the username for authentication if you've enabled authentication. The user must have write access to the database. Use with the query string parameter `p`. |

\* The HTTP API also supports basic authentication.
Use basic authentication if you've [enabled authentication](/influxdb/v1.2/query_language/authentication_and_authorization/#set-up-authentication)
and aren't using the query string parameters `u` and `p`.
See below for an [example](#example-4-write-a-point-to-the-database-mydb-using-basic-authentication) of basic authentication.

\*\* We recommend using the least precise precision possible as this can result
in significant improvements in compression.

#### Examples

##### Example 1: Write a point to the database `mydb` with a timestamp in seconds
<br>
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb&precision=s" --data-binary 'mymeas,mytag=1 myfield=90 1463683075'

HTTP/1.1 204 No Content
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 17:33:23 GMT
```

##### Example 2: Write a point to the database `mydb` and the retention policy `myrp`
<br>
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb&rp=myrp" --data-binary 'mymeas,mytag=1 myfield=90'

HTTP/1.1 204 No Content
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 17:34:31 GMT
```

##### Example 3: Write a point to the database `mydb` using HTTP authentication
<br>
Valid credentials:
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb&u=myusername&p=mypassword" --data-binary 'mymeas,mytag=1 myfield=91'

HTTP/1.1 204 No Content
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 17:34:56 GMT
```

Invalid credentials:
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb&u=myusername&p=notmypassword" --data-binary 'mymeas,mytag=1 myfield=91'

HTTP/1.1 401 Unauthorized
Content-Type: application/json
Request-Id: [...]
Www-Authenticate: Basic realm="InfluxDB"
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 17:40:30 GMT
Content-Length: 33

{"error":"authorization failed"}
```

##### Example 4: Write a point to the database `mydb` using basic authentication
<br>
Valid credentials:
```
$ curl -i -XPOST -u myusername:mypassword "http://localhost:8086/write?db=mydb" --data-binary 'mymeas,mytag=1 myfield=91'

HTTP/1.1 204 No Content
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 17:36:40 GMT
```

Invalid credentials:
```
$ curl -i -XPOST -u myusername:notmypassword "http://localhost:8086/write?db=mydb" --data-binary 'mymeas,mytag=1 myfield=91'

HTTP/1.1 401 Unauthorized
Content-Type: application/json
Request-Id: [...]
Www-Authenticate: Basic realm="InfluxDB"
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 17:46:40 GMT
Content-Length: 33

{"error":"authorization failed"}
```

### Request Body

```
--data-binary '<Data in Line Protocol format>'
```

All data must be binary encoded and in the
[Line Protocol](/influxdb/v1.2/concepts/glossary/#line-protocol) format.
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

HTTP/1.1 204 No Content
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 18:02:57 GMT
```

##### Example 2: Write a point to the database `mydb` with the local server's nanosecond timestamp
<br>
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb" --data-binary 'mymeas,mytag=1 myfield=90'

HTTP/1.1 204 No Content
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 18:03:44 GMT
```

##### Example 3: Write several points to the database `mydb` by separating points with a new line
<br>
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb" --data-binary 'mymeas,mytag=3 myfield=89
mymeas,mytag=2 myfield=34 1463689152000000000'

HTTP/1.1 204 No Content
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 18:04:02 GMT
```

##### Example 4: Write several points to the database `mydb` from the file `data.txt`
<br>
```
$ curl -i -XPOST "http://localhost:8086/write?db=mydb" --data-binary @data.txt

HTTP/1.1 204 No Content
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.2.x
Date: Wed, 01 Mar 2017 18:08:11 GMT
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
| 401 Unauthorized | Unacceptable request. Can occur with invalid authentication credentials.  |
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

##### Example 4: Write a point with invalid authentication credentials
<br>
```
HTTP/1.1 401 Unauthorized
[...]
{"error":"authorization failed"}
```

##### Example 5: Write a point to a database that doesn't exist
<br>
```
HTTP/1.1 404 Not Found
[...]
{"error":"database not found: \"mydb1\""}
```

##### Example 6: Write a point to a retention policy that doesn't exist
<br>
```
HTTP/1.1 500 Internal Server Error
[...]
{"error":"retention policy not found: myrp"}
```
