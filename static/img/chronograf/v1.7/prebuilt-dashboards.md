The following dashboards are available:

## Docker

The Docker dashboard displays the following information:
- nCPU
- Total Memory
- # Containers
- System Memory Usage
- System Load
- Disk I/O
- Filesystem Usage
- Block I/O per Container
- CPU Usage per Container
- Memory Usage % per Container
- Memory Usage per Container
- Net I/O per Container

### Plugins

- [`docker` plugin](/telegraf/latest/plugins/inputs/#docker)
- [`disk` plugin](/telegraf/latest/plugins/inputs/#disk)
- [`mem` plugin](/telegraf/latest/plugins/inputs/#mem)
- [`diskio` plugin](/telegraf/latest/plugins/inputs/#diskio)
- [`system` plugin](/telegraf/latest/plugins/inputs/#system)
- [`cpu` plugin](/telegraf/latest/plugins/inputs/#cpu)

- Kubernetes Node. [](/telegraf/latest/plugins/inputs/#kubernetes)

- Riak. [](/telegraf/latest/plugins/inputs/#riak)

## Consul
The Consul dashboard displays the following information:
- Consul - Number of Critical Health Checks
- Consul - Number of Warning Health Checks

### Plugins
[`consul` plugin](/telegraf/latest/plugins/inputs/#consul)

## Consul Telemetry
The Consul Telemetry dashboard displays the following information:
- Consul Agent - Number of Go Routines
- Consul Agent - Runtime Alloc Bytes
- Consul Agent - Heap Objects
- Consul - Number of Agents
- Consul - Leadership Election
- Consul - HTTP Request Time (ms)
- Consul - Leadership Change
- Consul - Number of Serf Events


### Plugins
[`consul` plugin](/telegraf/latest/plugins/inputs/#consul)

- Kubernetes Overview. [](/telegraf/latest/plugins/inputs/#kubernetes-inventory)

- Mesos. [](/telegraf/latest/plugins/inputs/#mesos)

## IIS
IIS - Service

### Plugins
- [](/telegraf/latest/plugins/inputs/) ???

- RabbitMQ. [](/telegraf/latest/plugins/inputs/#rabbitmq)

- System.:
    - [`system` plugin](/telegraf/latest/plugins/inputs/#system)
    - [`mem` plugin](/telegraf/latest/plugins/inputs/#mem)
    - [`cpu` plugin](/telegraf/latest/plugins/inputs/#cpu)
    - [`diskio` plugin](/telegraf/latest/plugins/inputs/#diskio)
    - [`net` plugin](/telegraf/latest/plugins/inputs/#net)
    - [`processes` plugin](/telegraf/latest/plugins/inputs/#processes)
    - [`swap` plugin](/telegraf/latest/plugins/inputs/#swap)


- VMware vSphere Overview. [](/telegraf/latest/plugins/inputs/#vmware-vsphere)

## Apache
The Apache dashboard displays the following information:
- System Uptime
- CPUs
- RAM
- Memory Used %
- Load
- I/O
- Network
- Workers
- Scoreboard
- Apache Uptime
- CPU Load
- Requests per Sec
- Throughput
- Response Codes
- Apache Log

### Plugins

- [`apache` plugin](/telegraf/latest/plugins/inputs/#apache)
- [`system` plugin](/telegraf/latest/plugins/inputs/#system)
- [`mem` plugin](/telegraf/latest/plugins/inputs/#mem)
- [`diskio` plugin](/telegraf/latest/plugins/inputs/#diskio)
- [`net` plugin](/telegraf/latest/plugins/inputs/#net)
- [`logparser` plugin](/telegraf/latest/plugins/inputs/#logparser)

## ElasticSearch
The ElasticSearch dashboard displays the following information:
- ElasticSearch - Query Throughput
- ElasticSearch - Open Connections
- ElasticSearch - Query Latency
- ElasticSearch - Fetch Latency
- ElasticSearch - Suggest Latency
- ElasticSearch - Scroll Latency
- ElasticSearch - Indexing Latency
- ElasticSearch - JVM GC Collection Counts
- ElasticSearch - JVM GC Latency
- ElasticSearch - JVM Heap Usage

### Plugins
- [`elasticsearch` plugin](/telegraf/latest/plugins/inputs/#elasticsearch)


## InfluxDB
The InfluxDB dashboard displays the following information:
- 


## Memcached
- NSQ
- PostgreSQL

## HAProxy
The HAProxy dashboard displays the following information:
- HAProxy - Number of Servers
- HAProxy - Sum HTTP 2xx
- HAProxy - Sum HTTP 4xx
- HAProxy - Sum HTTP 5xx
- HAProxy - Frontend HTTP Requests/Second
- HAProxy - Frontend Sessions/Second
- HAProxy - Frontend Session Usage %
- HAProxy - Frontend Security Denials/Second
- HAProxy - Frontend Request Errors/Second
- HAProxy - Frontend Bytes/Second
- HAProxy - Backend Average Response Time
- HAProxy - Backend Connection Errors/Second
- HAProxy - Backend Queued Requests/Second
- HAProxy - Backend Average Requests Queue Time (ms)
- HAProxy - Backend Error Responses/Second

### Plugins
 [`haproxy` plugin](/telegraf/latest/plugins/inputs/#haproxy)

- Kubernetes Pod
- NGINX
- Redis
- VMware vSphere VMs
- VMware vSphere Hosts
- PHPfpm
- Win System
- MySQL
- Ping
