# Hilltop Crawler

## Description

This app extracts observation data from Hilltop servers and publishes them as to a Kafka topic. Which Hilltop servers to
connect to and which measurement names to extract is controlled by a database configuration table.

The app keeps all versions of data pulled from the Hilltop servers. This allows for downstream systems to
expose a record of changes in the data over time. TODO ... how are we handing latest data?

## Configuration



## Process


On Scheduler start:
* Read configuration from database
* Queue up all the Hilltop requests to be polled
* 


The Plan 


## Sources 

Not stored in migration scripts so developer machines don't index them by default. 
 
GW Water Use
```sql
INSERT INTO hilltop_sources (council_id, hts_url, configuration)
VALUES
    (9, 'https://hilltop.gw.govt.nz/WaterUse.hts', '{ "measurementNames": ["Water Meter Volume", "Water Meter Reading"] }');
```

GW Rainfall
```sql
INSERT INTO hilltop_sources (council_id, hts_url, configuration)
VALUES
    (9, 'https://hilltop.gw.govt.nz/merged.hts', '{ "measurementNames": ["Rainfall"] }');
```
