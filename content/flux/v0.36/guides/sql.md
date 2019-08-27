---
title: Query SQL data sources
seotitle: Query SQL data sources with InfluxDB
description: >
  The Flux `sql` package provides functions for working with SQL data sources.
  Use `sql.from()` to query SQL databases like PostgreSQL and MySQL
menu:
  flux_0_36:
    parent: Guides
    weight: 7
---

The [Flux](/flux/v0.36) `sql` package provides functions for working with SQL data sources.
[`sql.from()`](/flux/v0.36/functions/sql/from/) lets you query SQL data sources
like [PostgreSQL](https://www.postgresql.org/) and [MySQL](https://www.mysql.com/)
and use the results with InfluxDB dashboards and other operations.

- [Query a SQL data source](#query-a-sql-data-source)
- [Join SQL data with data in InfluxDB](#join-sql-data-with-data-in-influxdb)
- [Use SQL results to populate template variables](#use-sql-results-to-populate-template-variables)
- [Sample sensor data](#sample-sensor-data)

## Query a SQL data source
To query a SQL data source:

1. Import the `sql` package in your Flux query
2. Use the `sql.from()` function to specify the driver, data source name (DSN),
   and query used to query data from your SQL data source:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[PostgreSQL](#)
[MySQL](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```js
import "sql"

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://user:password@localhost",
  query: "SELECT * FROM example_table"
)
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
import "sql"

sql.from(
  driverName: "mysql",
  dataSourceName: "user:password@tcp(localhost:3306)/db",
  query: "SELECT * FROM example_table"
)
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

_See the [`sql.from()` documentation](/flux/v0.36/functions/sql/from/) for
information about required function parameters._

## Join SQL data with data in InfluxDB
One of the primary benefits of querying SQL data sources from InfluxDB
is the ability to enrich query results with data stored outside of InfluxDB.

Using the [air sensor sample data](#sample-sensor-data) below, the following query
joins air sensor metrics stored in InfluxDB with sensor information stored in PostgreSQL.
The joined data lets you query and filter results based on sensor information
that isn't stored in InfluxDB.

```js
// Import the "sql" package
import "sql"

// Query data from PostgreSQL
sensorInfo = sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://localhost?sslmode=disable",
  query: "SELECT * FROM sensors"
)

// Query data from InfluxDB
sensorMetrics = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "airSensors")

// Join InfluxDB query results with PostgreSQL query results
join(tables: {metric: sensorMetrics, info: sensorInfo}, on: ["sensor_id"])
```

## Use SQL results to populate dashboard variables
Use `sql.from()` to [create template variables](/chronograf/latest/guides/dashboard-template-variables/#create-custom-template-variables)
from SQL query results.
The following example uses the [air sensor sample data](#sample-data) below to
create a variable that lets you select the location of a sensor.

```js
import "sql"

sql.from(
    driverName: "postgres",
    dataSourceName: "postgresql://localhost?sslmode=disable",
    query: "SELECT * FROM sensors"
  )
  |> rename(columns: {location: "_value"})
  |> keep(columns: ["_value"])
```

Use the variable to manipulate queries in your dashboards.

---

## Sample sensor data
The [sample data generator](#download-and-run-the-sample-data-generator) and
[sample sensor information](#import-the-sample-sensor-information) simulate a
group of sensors that measure temperature, humidity, and carbon monoxide
in rooms throughout a building.
Each collected data point is stored in InfluxDB with a `sensor_id` tag that identifies
the specific sensor it came from.
Sample sensor information is stored in PostgreSQL.

**Sample data includes:**

- Simulated data collected from each sensor and stored in the `airSensors` measurement in **InfluxDB**:
    - temperature
    - humidity
    - co

- Information about each sensor stored in the `sensors` table in **PostgreSQL**:
    - sensor_id
    - location
    - model_number
    - last_inspected

### Import and generate sample sensor data

#### Download and run the sample data generator
`air-sensor-data.rb` is a script that generates air sensor data and stores the data in InfluxDB.
To use `air-sensor-data.rb`:

1. [Create a database](/influxdb/latest/introduction/getting-started/#creating-a-database) to store the data.
2. Download the sample data generator. _This tool requires [Ruby](https://www.ruby-lang.org/en/)._

    <a class="btn download" style="color:#fff" href="/downloads/air-sensor-data.rb" download>Download Air Sensor Generator</a>

3. Give `air-sensor-data.rb` executable permissions:

    ```
    chmod +x air-sensor-data.rb
    ```

4. Start the generator. Specify your organization, bucket, and authorization token.
  _For information about retrieving your token, see [View tokens](/v2.0/security/tokens/view-tokens/)._

    ```
    ./air-sensor-data.rb -o your-org -b your-bucket -t YOURAUTHTOKEN
    ```

    The generator begins to write data to InfluxDB and will continue until stopped.
    Use `ctrl-c` to stop the generator.

    _**Note:** Use the `--help` flag to view other configuration options._


5. Query your target database to ensure the generated data is writing successfully.
   The generator doesn't catch errors from write requests, so it will continue running
   even if data is not writing to InfluxDB successfully.

    ```
    from(bucket: "database-name/autogen")
       |> range(start: -1m)
       |> filter(fn: (r) => r._measurement == "airSensors")
    ```

#### Import the sample sensor information
1. [Download and install PostgreSQL](https://www.postgresql.org/download/).
2. Download the sample sensor information CSV.

    <a class="btn download" style="color:#fff" href="/downloads/sample-sensor-info.csv" download>Download Sample Data</a>

3. Use a PostgreSQL client (`psql` or a GUI) to create the `sensors` table:

    ```
    CREATE TABLE sensors (
      sensor_id character varying(50),
      location character varying(50),
      model_number character varying(50),
      last_inspected date
    );
    ```

4. Import the downloaded CSV sample data.
   _Update the `FROM` file path to the path of the downloaded CSV sample data._

    ```
    COPY sensors(sensor_id,location,model_number,last_inspected)
    FROM '/path/to/sample-sensor-info.csv' DELIMITER ',' CSV HEADER;
    ```

5. Query the table to ensure the data was imported correctly:

    ```
    SELECT * FROM sensors;
    ```

#### Import the sample data dashboard
Download and import the Air Sensors dashboard to visualize the generated data:

<a class="btn download" style="color:#fff" href="/downloads/air_sensors_dashboard.json" download>Download Air Sensors dashboard</a>

_For information about importing a dashboard, see [Create a dashboard](/v2.0/visualize-data/dashboards/create-dashboard/#create-a-new-dashboard)._
