---
title: Getting Started
menu:
  influxdb_09:
    weight: 20
    parent: introduction
---

With [InfluxDB installed](/influxdb/v0.10/introduction/installation), you're ready to start doing awesome things.
In this section we'll use the `influx` command line interface (CLI).
The CLI is included in all InfluxDB packages and is a lightweight and simple way to interact with the database.
The CLI communicates with InfluxDB by making requests to the InfluxDB API.


> **Note:** The database can also be used by making direct HTTP requests to the API.
See [Writing Data](/influxdb/v0.10/guides/writing_data/) and [Querying Data](/influxdb/v0.10/guides/querying_data/) for examples.

## Logging in and creating your first database
If you've installed InfluxDB locally, the `influx` command should be available via the command line.
Executing `influx` will start the CLI and automatically connect to the local InfluxDB instance (assuming you have already started the server with `influxd`).
The output should look like this:

```sh
$ influx
Connected to http://localhost:8086 version 0.9
InfluxDB shell 0.9
> 
```

> **Note:** The InfluxDB HTTP API runs on port `8086` by default.
Therefore, `influx` will connect to port `8086` and `localhost` by default.
If you need to alter these defaults run `influx --help`.

The command line is now ready to take input in the form of Influx Query Language (a.k.a InfluxQL) statements.
To exit the InfluxQL shell, type `exit` and hit return or type `ctrl` + `D`.

A fresh install of InfluxDB has no databases so creating one is our first task.
Create a database with the `CREATE DATABASE <db-name>` InfluxQL statement, where `<db-name>` is the name of the database you wish to create.
Names of databases can contain any unicode character as long as the string is double-quoted.
Names can be left unquoted if they contain only ASCII letters, digits, or underscores and do not begin with a digit.

Throughout this guide, we'll use the database name `mydb`.

```sql
> CREATE DATABASE mydb
> 
```

> **Note:** After hitting enter, a new prompt appears and nothing else is displayed.
In the CLI, this means the statement was executed and there were no errors to display.
There will always be an error displayed if something went wrong.
No news is good news!

The `SHOW DATABASES` statement can be used to show all existing databases.

```sql
> SHOW DATABASES
name: databases
---------------
name
_internal
mydb

> 
```

> **Note:** The `_internal` database is created and used by InfluxDB to store internal runtime metrics.
Check it out later to get an interesting look at how InfluxDB is performing under the hood.

Unlike `SHOW DATABASES`, most InfluxQL statements must operate against a specific database.
You may explicitly name the database with each query, but the CLI provides a convenient statement, `USE <db-name>`, which will automatically set the database for all future requests.

```sql
> USE mydb
Using database mydb
> 
```

## Writing and exploring data

Now that we have a database, InfluxDB is ready to accept queries and writes.

First a short primer on the datastore.
Data in InfluxDB is organized by `time series`, which contain a measured value, like "cpu_load" or "temperature".
Time series have zero to many `points`, one for each discrete sample of the metric.
Points consist of `time` (a timestamp), a `measurement` ("cpu_load"), at least one key-value `field` (the measured value itself, e.g.
"value=0.64" or "15min=0.78"), and zero to many key-value `tags` containing metadata (e.g.
"host=server01", "region=EMEA", "dc=Frankfurt").
Conceptually you can think of a `measurement` as an SQL table, with rows where the primary index is always time.
`tags` and `fields` are effectively columns in the table.
`tags` are indexed, `fields` are not.
The difference is that with InfluxDB you can have millions of measurements, you don't have to define schemas up front, and null values aren't stored.

Points are written to InfluxDB using line protocol, which follows the following format:

```
<measurement>[,<tag-key>=<tag-value>...] <field-key>=<field-value>[,<field2-key>=<field2-value>...] [unix-nano-timestamp]
```

The following lines are all examples of points that can be written to InfluxDB:

```
cpu,host=serverA,region=us_west value=0.64
payment,device=mobile,product=Notepad,method=credit billed=33,licenses=3i 1434067467100293230
stock,symbol=AAPL bid=127.46,ask=127.48
temperature,machine=unit42,type=assembly external=25,internal=37 1434067467000000000
```

> **Note:** More information on the line protocol can be found on the [Write Syntax](/influxdb/v0.10/write_protocols/write_syntax/) page.

To insert a single time-series datapoint into InfluxDB using the CLI, enter `INSERT` followed by a point:

```sql
> INSERT cpu,host=serverA,region=us_west value=0.64
>
```

A point with the measurement name of `cpu` and tag `host` has now been written to the database, with the measured value of `0.64`.

Now we will query for the data we just wrote.

```sql
> SELECT * FROM cpu
name: cpu
---------
time		    	                     host     	region   value
2015-10-21T19:28:07.580664347Z  	serverA	  us_west	0.64

> 
```

> **Note:** We did not supply a timestamp when writing our point.
When no timestamp is supplied for a point, InfluxDB assigns the local current timestamp when the point is ingested.
That means your timestamp will be different.

Let's try storing a different type of data -- sensor data.
Enter the following data in the `Values` textbox:

```sql
> INSERT temperature,machine=unit42,type=assembly external=25,internal=37
>
```

> **Note:** In this example we write two values in the `fields` section.
Up to 255 different `fields` can be stored per `measurement`.


All fields are returned on query:

```sql
> SELECT * FROM temperature
name: temperature
-----------------
time		                        	 external	  internal	machine	type
2015-10-21T19:28:08.385013942Z  25	        	37     		unit42  assembly

> 
```

InfluxDB supports a sophisticated query language, allowing many different types of queries.
For example:

```sql
> SELECT * FROM /.*/ LIMIT 1
--
> SELECT * FROM cpu_load_short
--
> SELECT * FROM cpu_load_short WHERE value > 0.9
```

This is all you need to know to write data into InfluxDB and query it back.
To learn more about the InfluxDB write protocol, check out the guide on [Writing Data](/influxdb/v0.10/guides/writing_data/).
To futher explore the query language, check out the guide on [Querying Data](/influxdb/v0.10/guides/querying_data/).
For more information on InfluxDB concepts, check out the [Key Concepts]
(/influxdb/v0.10/concepts/key_concepts/) page.
