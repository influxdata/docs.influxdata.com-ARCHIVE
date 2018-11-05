









A trigger is associated with a table and contains logic for when it should fire.
When a trigger fires its table is materialized.
Materializing a table makes it available for any down stream operations to consume.
Once a table is materialized it can no longer be modified.

Triggers can fire based on these inputs:

| Input                   | Description                                                                                       |
| -----                   | -----------                                                                                       |
| Current processing time | The current processing time is the system time when the trigger is being evaluated.               |
| Watermark time          | The watermark time is a time where it is expected that no data will arrive that is older than it. |
| Record count            | The number of records currently in the table.                                                     |
| Group key value         | The group key value of the table.                                                                 |

Additionally triggers can be _finished_, which means that they will never fire again.
Once a trigger is finished, its associated table is deleted.

Currently all tables use an _after watermark_ trigger which fires only once the watermark has exceeded the `_stop` value of the table and then is immediately finished.

Data sources are responsible for informing about updates to the watermark.

[IMPL#240](https://github.com/influxdata/platform/issues/240) Make trigger support not dependent on specific columns
