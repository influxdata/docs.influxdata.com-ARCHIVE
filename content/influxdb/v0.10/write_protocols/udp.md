---
title: Service - UDP
menu:
  influxdb_010:
    weight: 30
    parent: write_protocols
---

InfluxDB accepts writes over UDP.
By default, no ports are open to UDP.
To configure InfluxDB to support writes over UDP you must adjust your config file.

## A note on UDP/IP OS Buffer sizes

Some OSes (most notably, Linux) place very restricive limits on the performance of UDP protocols.
Recent versions of FreeBSD, OSX, and Windows do not have this problem.
It is _highly_ recommended that you increase these OS limits to 8MB before trying to run large amounts of UDP traffic to your instance.
8MB is a starting recommendation, and should be adjusted to be in line with your `read-buffer` plugin setting.

### Linux
Check the current UDP/IP read buffer limit by typing the following commands:

```
sysctl net.core.rmem_max
```

If the value is less than 8388608 bytes you should add the following lines to the /etc/sysctl.conf file:

```
net.core.rmem_max=8388608
```

Changes to /etc/sysctl.conf do not take effect until reboot.
To update the values immediately, type the following commands as root:

```
sysctl -w net.core.rmem_max=8388608
```

### BSD/Darwin

On BSD/Darwin systems you need to add about a 15% padding to the kernel limit socket buffer.
Meaning if you want an 8MB buffer (8388608 bytes) you need to set the kernel limit to `8388608*1.15 = 9646900`.
This is not documented anywhere but happens [in the kernel here.](https://github.com/freebsd/freebsd/blob/master/sys/kern/uipc_sockbuf.c#L63-L64)

Check the current UDP/IP buffer limit by typing the following command:

```
sysctl kern.ipc.maxsockbuf
```

If the value is less than 8388608 bytes you should add the following lines to the /etc/sysctl.conf file (create it if necessary):

```
kern.ipc.maxsockbuf=8388608
```

Changes to /etc/sysctl.conf do not take effect until reboot.
To update the values immediately, type the following commands as root:

```
sysctl -w kern.ipc.maxsockbuf=8388608
```

See [here](https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Web_Platform/5/html/Administration_And_Configuration_Guide/jgroups-perf-udpbuffer.html) for instructions on other OSes.

### Using the read-buffer option for the UDP listener

The `read-buffer` option allows users to set the buffer size for the UDP listener.
It Sets the size of the operating system's receive buffer associated with the UDP traffic.
Keep in mind that the OS must be able to handle the number set here or the UDP listener will error and exit.

`read-buffer = 0` means to use the OS default, which is usually too small for high UDP performance.

## Config File

The target database and listening port for all UDP writes must be specified in the configuration file.

```
...

[[udp]]
  enabled = true
  bind-address = ":8089" # the bind address
  database = "foo" # Name of the database that will be written to
  batch-size = 1000 # will flush if this many points get buffered
  batch-timeout = "1s" # will flush at least this often even if the batch-size is not reached
  batch-pending = 5 # number of batches that may be pending in memory
  read-buffer = 0 # UDP Read buffer size, 0 means OS default. UDP listener will fail if set above OS max.
...
```

Multiple configurations can be specified to support multiple listening ports or multiple target databases.
For example:

```
...
[[udp]]
  # Default UDP for Telegraf
  enabled = true
  bind-address = ":8089" # the bind address
  database = "telegraf" # Name of the database that will be written to
  batch-size = 5000 # will flush if this many points get buffered
  batch-timeout = "1s" # will flush at least this often even if the batch-size is not reached
  batch-pending = 10 # number of batches that may be pending in memory
  read-buffer = 0 # UDP read buffer size, 0 means to use OS default

[[udp]]
  # High-traffic UDP
  enabled = true
  bind-address = ":80891" # the bind address
  database = "mymetrics" # Name of the database that will be written to
  batch-size = 5000 # will flush if this many points get buffered
  batch-timeout = "1s" # will flush at least this often even if the batch-size is not reached
  batch-pending = 100 # number of batches that may be pending in memory
  read-buffer = 8388608 # (8*1024*1024) UDP read buffer size
...
```

## Writing Points

To write, just send newline separated [line protocol](/influxdb/v0.10/write_protocols/line/) over UDP.
For better performance send batches of points rather than multiple single points.

```bash
$ echo "cpu value=1"> /dev/udp/localhost/8089
```

## More Information

For more information about the UDP plugin, please see the UDP plugin [README](https://github.com/influxdb/influxdb/blob/master/services/udp/README.md).
