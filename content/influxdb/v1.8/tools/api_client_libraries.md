---
title: InfluxDB API client libraries
description: InfluxDB API client libraries includes support for Arduino, Go, Haskell, Java, JavaScript/Node.js, Lisp, MATLAB, .Net, Perl, PHP, Python, R, Ruby, Rust, Scala, Sensu, and the SNMP agent.
aliases:
    - /influxdb/v1.8/clients/api_client_libraries/
    - /influxdb/v1.8/clients/
    - /influxdb/v1.8/clients/api
menu:
  influxdb_1_8:
    weight: 30
    parent: Tools
---

InfluxDB client libraries are language-specific packages that integrate with the InfluxDB API and support both **InfluxDB 1.8+** and **InfluxDB 2.0**. The client libraries on this page are available for writing data to InfluxDB using the [`/api/v2/write` endpoint](/influxdb/v1.8/tools/api#api-v2-write-http-endpoint).

For information about client libraries compatible with InfluxDB 1.7 and earlier, see [InfluxDB 1.7 API client libraries](/influxdb/v1.7/tools/api-client-libraries).

>**Note:** We highly recommend using these new client libraries to prepare for conversion to InfluxDB 2.0 and InfluxDB Cloud 2.0. When you write data to the `/api/v2/write` endpoint, you specify a database and retention policy, which is converted to a [bucket](https://v2.docs.influxdata.com/v2.0/reference/glossary/#bucket)--the new data store in InfluxDB 2.0.

## Client libraries

### Arduino
- [InfluxDB Arduino Client](https://github.com/tobiasschuerg/InfluxDB-Client-for-Arduino)
  - Contributed by [Tobias Schürg (tobiasschuerg)](https://github.com/tobiasschuerg)

### #C
- [influxdb-client-csharp](https://github.com/influxdata/influxdb-client-csharp)
  - Maintained by [InfluxData](https://github.com/influxdata)

### Go

- [influxdb-client-go](https://github.com/influxdata/influxdb-client-go)
  - Maintained by [InfluxData](https://github.com/influxdata)

### Java

- [influxdb-client-java](https://github.com/influxdata/influxdb-client-java)
   - Maintained by [InfluxData](https://github.com/influxdata)

### JavaScript

* [influxdb-javascript](https://github.com/influxdata/influxdb-client-js)
   - Maintained by [InfluxData](https://github.com/influxdata)

### PHP

- [influxdb-client-php](https://github.com/influxdata/influxdb-client-php)
   - Maintained by [InfluxData](https://github.com/influxdata)

### Ruby

- [influxdb-client-ruby](https://github.com/influxdata/influxdb-client-ruby)
   - Maintained by [InfluxData](https://github.com/influxdata)

### Python

* [influxdb-client-python](https://github.com/influxdata/influxdb-client-python)
   - Maintained by [InfluxData](https://github.com/influxdata)

## Use a client library

Use a InfluxDB client library to integrate InfluxDB into your scripts and applications.

1. Install the client library. Refer to the client library documentation for detail. For example, to install the Python client library:

  ```sh
      pip install influxd-client
  ```

2. Ensure that InfluxDB is running. If running InfluxDB locally, visit http://localhost:8086. (If using InfluxDB Cloud, visit the URL of your InfluxDB Cloud UI.)

3. In your program, import the client library and use it to write data to InfluxDB. For example:

  ```sh
     import influxdb_client
     from influxdb_client.client.write_api import SYNCHRONOUS
  ```

4. Define your database and token variables, and create a client and writer object. The InfluxDBClient object takes 2 parameters: `url` and `token`.

   ```sh
      database = "<my-db>"
      token = "<my-token>"
      client = influxdb_client.InfluxDBClient(
      url="http://localhost:8086",
      token=token,
   ```

5. Instantiate a writer object using the client object and the write_api method. Use the `write_api` method to configure the writer object.

   ```sh
      client = influxdb_client.InfluxDBClient(url=url, token=token)
      write_api = client.write_api(write_options=SYNCHRONOUS)
   ```

6. Create a point object and write it to InfluxDB using the write method of the API writer object. The write method requires three parameters: database, (optional) retention policy, and record.

  ```sh 
      p = influxdb_client.Point("my_measurement").tag("location", "Prague").field("temperature", 25.3)
       write_api.write(database:rp, record=p)
  ```

The database (and retention policy, if applicable) are converted to a [bucket](https://v2.docs.influxdata.com/v2.0/reference/glossary/#bucket) data store compatible with InfluxDB 2.0.
