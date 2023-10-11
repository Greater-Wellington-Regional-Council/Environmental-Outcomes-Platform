# Hilltop Crawler

## Description

This app extracts observation data from Hilltop servers and publishes them as to a Kafka `observations` topic for other
applications to consume. Which Hilltop servers and which types to extract are configured in a database table which can
be added to while the system is running.

The app intends to keep all versions of data pulled from the Hilltop. Allowing downstream systems to keep track of when
data has been updated in Hilltop. Noting that because Hilltop does not expose when changes were made we can only capture
when the crawler first saw data change. This is also intended to allow us to update some parts of the system without
having to re-read all of the data from hilltop.

## Process

Overall, this is built around the Hilltop API which exposes three levels of GET API request

* SITES_LIST — List of Sites, includes names and locations
* MEASUREMENTS_LIST — Per site, list of measurements available for that site, including details about the first and last
  observation date
* MEASUREMENT_DATA — Per site, per measurement, the timeseries observed data

The app crawls these by reading each level to decide what to read from the next level. i.e., The SITES_LIST tells the
app which sites call MEASUREMENTS_LIST for which in turn tells which measurements to call MEASUREMENT_DATA for. Requests
for MEASUREMENT_DATA are also split into monthly chunks to avoid issues with too much data being returned in one
request.

The app keeps a list of API requests that it will keep up to date by calling that API on a schedule. This list is stored
in the `hilltop_fetch_tasks` table and works like a task queue. Each time a request is made, the result is used to try
and determine when next to schedule the task. The simple example is for MEASUREMENT_DATA if the last observation was
recent, then a refresh should be attempted soon, if it was a long way in the past, it should be refreshed less often.

The next schedule time has been implemented as a random time in an interval, to provide some jitter when between task
requeue times to hopefully spread them out, and the load on the servers we are calling.

The task queue also keeps meta-data about the previous history of tasks that are not used by the app this is to allow
engineers to monitor how the system is working.

This process is built around three main components:

* Every hour, monitor the configuration table
    * Read the configuration table
    * From the configuration, add any new tasks to the task queue

* Continuously monitor the task queue
    * Read the next task to work on
    * Fetch data from hilltop for that task
    * If a valid result which is not the same as the previous version
        * Queue any new tasks from the result
        * Send the result to Kafka `hilltop_raw` topic
    * Requeue the task for sometime in the future, based on the type of request

* Kafka streams component
    * Monitor the stream
    * For each message map it to either a `site_details` or and `observations` message

Currently, the Manager component listens to the `observations` topic and stores the data from that in a DB table.

## Task Queue

The task queue is currently a custom implementation on top of a single table `hilltop_fetch_tasks`.

This is a slightly specialized queue where

* Each task has a scheduled run time backed by the  `next_fecth_at` column
* Each time a task runs it will be re-queued for some time in the future
* The same task can be added multiple times and rely on Postgres “ON CONFLICT DO NOTHING” to avoid the task being added
  multiple times

The implementation relies on the postgres `SKIP LOCKED` feature to allow multiple worker threads to pull from the queue
at the same time without getting the same task.

See this [reference](https://www.2ndquadrant.com/en/blog/what-is-select-skip-locked-for-in-postgresql-9-5/) for
discussion about the `SKIP LOCKED` query.

The queue implementation is fairly simple for this specific use. If it becomes more of a generic work queue then a 
standard implemention such as Quartz might be worthwhile moving to.

## Example Configuration

These are a couple of insert statements that are not stored in migration scripts, so developer machines don't index
them by default.

GW Water Use

```sql
INSERT INTO hilltop_sources (council_id, hts_url, configuration)
VALUES (9, 'https://hilltop.gw.govt.nz/WaterUse.hts',
        '{ "measurementNames": ["Water Meter Volume", "Water Meter Reading"] }');
```

GW Rainfall

```sql
INSERT INTO hilltop_sources (council_id, hts_url, configuration)
VALUES (9, 'https://hilltop.gw.govt.nz/merged.hts', '{ "measurementNames": ["Rainfall"] }');
```

### TODO / Improvement

* The `previous_history` on tasks will grow unbounded. This needs to be capped
* The algorithm for determining the next time to schedule an API refresh could be improved, something could be built
  from the previous history based on how often data is unchanged.
* To avoid hammering Hilltop there is rate limiting using a "token bucket" library, currently this uses one bucket for
  all requests. It could be split to use one bucket per server
* Because of the chunking by month, every time new data arrives we end up storing the whole month up to that new data
  again in the `hilltop_raw` topic. This seems wasteful and there are options for cleaning up when a record just
  supersedes the previous. But cleaning up would mean losing some knowledge about when a observation was first seen.     
