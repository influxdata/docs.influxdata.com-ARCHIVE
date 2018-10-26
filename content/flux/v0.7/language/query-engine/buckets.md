








Buckets is a type of data source that retrieves a list of buckets that the caller is authorized to access.  
It takes no input parameters and produces an output table with the following columns:

* name (string): the name of the bucket
* id (string): the internal ID of the bucket
* organization (string): the organization this bucket belongs to
* organizationID (string): the internal ID of the organization
* retentionPolicy (string): the name of the retention policy, if present
* retentionPeriod (duration): the duration of time for which data is held in this bucket

Example:

    buckets() |> filter(fn: (r) => r.organization == "my-org")
