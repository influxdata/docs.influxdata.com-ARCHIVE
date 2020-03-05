---
title: Using the HTTP input plugin with Citi Bike data
description:
menu:
  telegraf_1_13:
    name: Using the HTTP plugin
    weight: 30
    parent: Guides
---

This example walks through using the Telegraf HTTP input plugin to collect live metrics on Citi Bike stations in New York City. Live station data is available in JSON format from [NYC OpenData](https://data.cityofnewyork.us/NYC-BigApps/Citi-Bike-Live-Station-Feed-JSON-/p94q-8hxh).

For the following example to work, configure [`influxdb` output plugin](telegraf/v1.13/plugins/plugin-list/#influxdb). This plugin is what allows Telegraf to write the metrics to your InfluxDB.

## Configure the HTTP Input plugin in your Telegraf configuration file

To retrieve data from the Citi Bike URL endpoint, enable the `inputs.http` input plugin in your Telegraf configuration file.

Specify the following options:

### `urls`
One or more URLs to read metrics from. For this example,  use `https://feeds.citibikenyc.com/stations/stations.json`.

### `data_format`
The format of the data in the HTTP endpoints that Telegraf will ingest. For this example, use JSON.


## Add parser information to your Telegraf configuration

Specify the following JSON-specific options.

### JSON

#### `json_query`
To parse only the relevant portion of JSON data, set the `json_query` option with a [GJSON](https://github.com/tidwall/gjson) path. The result of the query should contain a JSON object or an array of objects.
In this case, we don't want to parse the JSON query's `executionTime` at the beginning of the data, so we'll limit this to include only the data in the `stationBeanList` array.

#### `tag_keys`
List of one or more JSON keys that should be added as tags. For this example, we'll use the tag keys `id`, `stationName`, `city`, and `postalCode`.

#### `json_string_fields`
List the keys of fields that are in string format so that they can be parsed as strings. Here, the string fields are `statusValue`, `stAddress1`, `stAddress2`, `location`, and `landMark`.

#### `json_time_key`
Key from the JSON file that creates the timestamp metric. In this case, we want to use the time that station data was last reported, or the `lastCommunicationTime`. If you don't specify a key, the time that Telegraf reads the data becomes the timestamp.

#### `json_time_format`
The format used to interpret the designated `json_time_key`. This example uses [Go reference time format](https://golang.org/pkg/time/#Time.Format). For example, `Mon Jan 2 15:04:05 MST 2006`.

#### `json_timezone`
The timezone We'll set this to the Unix TZ value where our bike data takes place, `America/New_York`.


#### Example configuration

  ```toml
  [[inputs.http]]
  #URL for NYC's Citi Bike station data in JSON format
  urls = ["https://feeds.citibikenyc.com/stations/stations.json"]

  #Overwrite measurement name from default `http` to `citibikenyc`
  name_override = "citibikenyc"

  #Exclude url and host items from tags
  tagexclude = ["url", "host"]

  #Data from HTTP in JSON format
  data_format = "json"

  #Parse `stationBeanList` array only
  json_query = "stationBeanList"

  #Set station metadata as tags
  tag_keys = ["id", "stationName", "city", "postalCode"]

  #Do not include station landmark data as fields
  fielddrop = ["landMark"]

  #JSON values to set as string fields
  json_string_fields = ["statusValue", "stAddress1", "stAddress2", "location", "landMark"]

  #Latest station information reported at `lastCommunicationTime`
  json_time_key = "lastCommunicationTime"

  #Time is reported in Golang "reference time" format
  json_time_format = "2006-01-02 03:04:05 PM"

  #Time is reported in Eastern Standard Time (EST)
  json_timezone = "America/New_York"
  ```



## Start Telegraf and verify data appears

[Start the Telegraf service](/telegraf/v1.13/introduction/getting-started/#start-the-telegraf-service).

To test that the data is being sent to InfluxDB, run the following (replacing `telegraf.conf` with the path to your configuration file):

```
telegraf -config ~/telegraf.conf -test
```

This command should return line protocol that looks similar to the following:


```
citibikenyc,id=3443,stationName=W\ 52\ St\ &\ 6\ Ave statusKey=1,location="",totalDocks=41,availableDocks=32,latitude=40.76132983124814,longitude=-73.97982001304626,availableBikes=8,stAddress2="",stAddress1="W 52 St & 6 Ave",statusValue="In Service" 1581533519000000000
citibikenyc,id=367,stationName=E\ 53\ St\ &\ Lexington\ Ave availableBikes=8,stAddress1="E 53 St & Lexington Ave",longitude=-73.97069431,latitude=40.75828065,stAddress2="",statusKey=1,location="",statusValue="In Service",totalDocks=34,availableDocks=24 1581533492000000000
citibikenyc,id=359,stationName=E\ 47\ St\ &\ Park\ Ave totalDocks=64,availableBikes=15,statusValue="In Service",location="",latitude=40.75510267,availableDocks=49,stAddress1="E 47 St & Park Ave",longitude=-73.97498696,statusKey=1,stAddress2="" 1581533535000000000
citibikenyc,id=304,stationName=Broadway\ &\ Battery\ Pl statusValue="In Service",availableDocks=11,stAddress1="Broadway & Battery Pl",statusKey=1,stAddress2="",location="",totalDocks=33,latitude=40.70463334,longitude=-74.01361706,availableBikes=22 1581533499000000000
```

Now, you can explore and query the Citi Bike data in InfluxDB. The example below is an InfluxQL query and visualization showing the number of available bikes over the past 15 minutes at the Broadway and West 29th Street station.

![Citi Bike visualization](/img/citibike_query.png)
