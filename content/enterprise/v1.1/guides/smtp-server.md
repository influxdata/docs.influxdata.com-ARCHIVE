---
title: SMTP Server Setup
menu:
  enterprise_1_1:
    weight: 20
    parent: Guides
---

InfluxEnterprise requires a functioning SMTP server to invite users to the console.
If you’re working on Ubuntu 14.04 and are looking for an SMTP server to use for
development purposes, the following steps will get you up and running with [MailCatcher](https://mailcatcher.me/).

Note that MailCatcher will NOT send actual emails, it merely captures email
traffic from the cluster and allows you to view it in a browser.
If you want to invite other users you must set up an actual email server that the InfluxEnterprise process can use.

#### 1. Install the relevant packages on the server running the InfluxEnterprise Web Console
```
$ sudo apt-add-repository ppa:brightbox/ruby-ng
$ sudo apt-get update
$ sudo apt-get install ruby2.2 ruby2.2-dev build-essential libsqlite3-dev
$ sudo gem install mailcatcher
```
#### 2. Start MailCatcher
```
$ mailcatcher --ip=0.0.0.0 --http-ip=0.0.0.0
```
#### 3. Update the InfluxEnterprise configuration file

In `/etc/influx-enterprise/influx-enterprise.conf`, update the port setting in
the `[smtp]` section to `1025`.

#### 4. Restart the InfluxEnterprise Web Console
```
$ service influx-enterprise restart
```
View emails at `<your_server's_IP_address>:1080`.
