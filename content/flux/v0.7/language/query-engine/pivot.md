









Pivot collects values stored vertically (column-wise) in a table and aligns them horizontally (row-wise) into logical sets.  


Pivot has the following properties:

* `rowKey` array of strings
    List of columns used to uniquely identify a row for the output.
* `colKey` array of strings
    List of columns used to pivot values onto each row identified by the rowKey.
* `valueCol` string
    Identifies the single column that contains the value to be moved around the pivot


The group key of the resulting table will be the same as the input tables, excluding the columns found in the colKey and valueCol.
This is because these columns are not part of the resulting output table.  

Every input row should have a 1:1 mapping to a particular row + column in the output table, determined by its values for the rowKey and colKey.   
In the case where more than one value is identified for the same row+column pair in the output, the last value
encountered in the set of table rows is taken as the result.

The output table will have columns based on the row key, plus the group key (minus any group key colums in the column key)
plus new columns for each unique tuple of values identified by the column key.  
Any columns in the original table that are not referenced in the rowKey or the original table's group key will be dropped.  

The output is constructed as follows:
1. A new row is created for each unique value identified in the input by the rowKey parameter.
2. The initial set of columns for the new row is the row key unioned with the group key, but excluding the columns indicated by the colKey and the valueCol.
3. A set of value columns are added to the row for each unique value identified in the input by the columnKey parameter.
The label is a concatenation of the valueCol string and the colKey values using '_' as a separator.
4. For each rowKey, columnKey pair, the appropriate value is determined from the input table by the valueCol.
If no value is found, the value is set to `null`.

[IMPL#353](https://github.com/influxdata/platform/issues/353) Null defined in spec but not implemented.  
