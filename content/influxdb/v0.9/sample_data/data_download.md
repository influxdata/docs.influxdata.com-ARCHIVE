---
title: Sample data
---

Download and write to InfluxDB the sample data used in [Data Exploration](../query_language/data_exploration.html), [Schema Exploration](../query_language/schema_exploration.html), and [Functions](../query_language/functions.html).

### Download and write the data to InfluxDB
The following instructions are compatible with InfluxDB versions 0.9.5+.

From your terminal, download the text file that contains the data in [line protocol](https://influxdb.com/docs/v0.9/write_protocols/line.html) format:
```
curl https://s3-us-west-1.amazonaws.com/noaa.water.database.0.9/NOAA_data.txt > NOAA_data.txt
```

Write the data to InfluxDB via the [CLI](../tools/shell.html):
```
influx -import -path=NOAA_data.txt -precision=s
```

### Test queries
See all five measurements:
```sh
> SHOW measurements
name: measurements
------------------
name
average_temperature
h2o_feet
h2o_pH
h2o_quality
h2o_temperature
```

Count the number of non-null values of `water_level` in `h2o_feet`:
```sh
> SELECT COUNT(water_level) FROM h2o_feet
name: h2o_feet
--------------
time			               count
1970-01-01T00:00:00Z	 15258
```

Select the first ten observations in the measurement h2o_feet:

```sh
> SELECT * FROM h2o_feet LIMIT 5
name: h2o_feet
--------------
time			                 level description	      location	       water_level
2015-08-18T00:00:00Z	   below 3 feet		          santa_monica	   2.064
2015-08-18T00:00:00Z	   between 6 and 9 feet	   coyote_creek	   8.12
2015-08-18T00:06:00Z	   between 6 and 9 feet	   coyote_creek	   8.005
2015-08-18T00:06:00Z	   below 3 feet		          santa_monica	   2.116
2015-08-18T00:12:00Z	   between 6 and 9 feet	   coyote_creek	   7.887
```

### Data sources and things to note
The sample data are publicly available data from the [National Oceanic and Atmospheric Administration’s (NOAA) Center for Operational Oceanographic Products and Services](http://tidesandcurrents.noaa.gov/stations.html?type=Water+Levels). The data include 15,258 observations of water levels (ft) collected every six seconds at two stations (Santa Monica, CA (ID 9410840) and Coyote Creek, CA (ID 9414575)) over the period from August 18, 2015 through September 18, 2015.

Note that the measurements `average_temperature`, `h2o_pH`, `h2o_quality`, and `h2o_temperature` contain fictional data. Those measurements serve to illuminate query functionality in [Schema Exploration](../query_language/schema_exploration.html). 

The `h2o_feet` measurement is the only measurement that contains the NOAA data. Please note that the `level description` field isn't part of the original NOAA data - we snuck it in there for the sake of having a field key with a special character and string [field values](../concepts/glossary.html#field-value).
