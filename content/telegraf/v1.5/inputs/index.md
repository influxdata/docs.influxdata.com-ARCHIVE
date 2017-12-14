---
title: Input plugins

menu:
  telegraf_1_5:
    name: Input plugins
    identifier: inputs
    weight: 20
---

Telegraf is entirely input-driven. All metrics are gathered from the inputs specified in the configuration file (`telegraf.conf`).

## Usage instructions

View usage instructions for each input by running `telegraf --usage <input-name>`.


## Supported input plugins

### [Aerospike (aerospike)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/aerospike)

### [AMQP Consumer (amqp_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/amqp_consumer)

### [Apache (apache)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/apache)

### [Bcache (bcache)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/bcache)

### [Cassandra (cassandra)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/cassandra)

### [Ceph (ceph)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ceph)

### [CGroup (cgroup)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/cgroup)

### Chrony"
identifier = "chrony"
weight = 80
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/chrony"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "CloudWatch"
identifier = "cloudwatch"
weight = 90
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/cloudwatch"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Conntrack"
identifier = "conntrack"
weight = 100
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/conntrack"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Consul"
identifier = "consul"
weight = 110
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/consul"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Couchbase"
identifier = "couchbase"
weight = 120
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/couchbase"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "CouchDB"
identifier = "couchdb"
weight = 130
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/couchdb"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Disque"
identifier = "disque"
weight = 140
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/disque"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "DMCache"
identifier = "dmcache"
weight = 150
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dmcache"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "DNS query time"
identifier = "dns query time"
weight = 160
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dns_query"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Docker"
identifier = "docker"
weight = 170
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/docker"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Dovecot"
identifier = "dovecot"
weight = 180
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dovecot"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Elasticsearch"
identifier = "elasticsearch"
weight = 190
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/elasticsearch"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Exec"
identifier = "exec"
weight = 200
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/exec"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Fail2ban"
identifier = "fail2ban"
weight = 205
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/fail2ban"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Filestat"
identifier = "filestat"
weight = 210
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/filestat"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Fluentd"
identifier = "fluentd"
weight = 215
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/fluentd"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Graylog"
identifier = "graylog_input"
weight = 220
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/graylog"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "HAproxy"
identifier = "haproxy"
weight = 230
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/haproxy"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Hddtemp"
identifier = "hddtemp"
weight = 240
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/hddtemp"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "HTTP Response"
identifier = "http_response"
weight = 260
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/http_response"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "HTTP JSON"
identifier = "httpjson"
weight = 270
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/httpjson"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "InfluxDB"
identifier = "influxdb"
weight = 280
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/influxdb"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Internal"
identifier = "interal"
weight = 290
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/internal"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Interrupts"
identifier = "interrupts"
weight = 300
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/interrupts"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "IPMI Sensor"
identifier = "ipmi_sensor"
weight = 310
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ipmi_sensor"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "IPtables"
identifier = "iptables"
weight = 320
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/iptables"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Jolokia"
identifier = "jolokia"
weight = 330
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/jolokia"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Kapacitor"
identifier = "kapacitor"
weight = 350
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/kapacitor"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Kubernetes"
identifier = "kubernetes"
weight = 360
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/kubernetes"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Leofs"
identifier = "leofs"
weight = 370
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/leofs"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Lustre2"
identifier = "lustre2"
weight = 390
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/lustre2"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Mailchimp"
identifier = "mailchimp"
weight = 400
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mailchimp"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Memcached"
identifier = "memcached"
weight = 410
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/memcached"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Mesos"
identifier = "mesos"
weight = 420
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mesos"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Minecraft"
identifier = "minecraft"
weight = 425
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/minecraft"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "MongoDB"
identifier = "mongodb"
weight = 430
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mongodb"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "MySQL"
identifier = "mysql"
weight = 450
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mysql"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Net_response"
identifier = "net_response"
weight = 470
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/net_response"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Nginx"
identifier = "nginx"
weight = 480
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nginx"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "NSQ"
identifier = "nsq"
weight = 490
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nsq"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Nstat"
identifier = "nstat"
weight = 510
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nstat"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "NTPq"
identifier = "ntpq"
weight = 520
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ntpq"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "OpenLDAP"
identifier = "openldap"
weight = 525
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/openldap"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Passenger"
identifier = "passenger"
weight = 530
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/passenger"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "PHP FPM"
identifier = "phpfpm"
weight = 540
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/phpfpm"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Ping"
identifier = "ping"
weight = 550
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ping"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "PostgreSQL"
identifier = "postgresql"
weight = 560
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postgresql"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "PostgreSQL Extensible"
identifier = "postgresql_extensible"
weight = 570
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postgresql_extensible"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "PowerDNS"
identifier = "powerdns"
weight = 580
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/powerdns"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Procstat"
identifier = "procstat"
weight = 590
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/procstat"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Prometheus"
identifier = "prometheus"
weight = 600
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/prometheus"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Puppetagent"
identifier = "puppetagent"
weight = 610
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/puppetagent"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Salesforce"
identifier = "salesforce"
weight = 665
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/salesforce"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "RabbitMQ"
identifier = "rabbitmq"
weight = 620
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/rabbitmq"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Raindrops"
identifier = "raindrops"
weight = 630
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/raindrops"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Redis"
identifier = "redis"
weight = 640
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/redis"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "RethinkDB"
identifier = "rethinkdb"
weight = 650
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/rethinkdb"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Riak"
identifier = "riak"
weight = 660
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/riak"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Sensors"
identifier = "sensors"
weight = 670
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/sensors"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "SNMP"
identifier = "snmp"
weight = 680
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/snmp"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "SNMP Legacy"
identifier = "snmp_legacy"
weight = 690
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/snmp_legacy"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "SQL Server"
identifier = "sql server"
weight = 710
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/sqlserver"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Sysstat"
identifier = "sysstat"
weight = 730
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/sysstat"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "System"
identifier = "system"
weight = 740
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/system"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Tomcat"
identifier = "tomcat"
weight = 750
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/tomcat"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Trig"
identifier = "trig"
weight = 770
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/trig"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Twemproxy"
identifier = "twemproxy"
weight = 780
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/twemproxy"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Varnish"
identifier = "varnish"
weight = 800
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/varnish"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Win_perf_counters "
identifier = "win_perf_counters"
weight = 820
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/win_perf_counters"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Win_services"
identifier = "win_services"
weight = 825
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/win_services"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "ZFS"
identifier = "zfs"
weight = 830
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/zfs"
parent = "inputs"
[[menu.telegraf_1_5]]
name = "Zipkin"
identifier = "zipkin"
weight = 835
url = "https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/zipkin"
parent = "inputs"
[[menu.telegraf_1_5]]

## Zookeeper" (zookeeper)] (https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/zookeeper)
