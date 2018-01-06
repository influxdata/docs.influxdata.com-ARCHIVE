---
title: Upgrading to Kapacitor v1.4
aliases:
    - kapacitor/v1.4/introduction/upgrading/
menu:
  kapacitor_1_4:
    weight: 30
    parent: administration
---
# Upgrading Kapacitor

# Contents
1. [Overview](#overview)
2. [Stopping the Kapacitor Service](#stopping-the-kapacitor-service)
3. [Backup Configuration and Data](#backup-configuration-and-data)
4. [Debian Package Upgrade](#debian-package-upgrade)
5. [RPM Package Upgrade](#rpm-package-upgrade)
5. [Upgrade with .zip or .tar.gz](#upgrade-with-zip-or-tar-gz)
6. [Verifying the Restart](#verifying-the-restart)

## Overview

How Kapacitor was installed will determine how Kapacitor should be upgraded.

The application may have been installed directly using the package management mechanisms of the OS or it may have been installed by unpackging the `.zip` or `.tar.gz` distributions.  This document will cover upgrading Kapacitor from release 1.3.1 to release 1.4 on Linux(Ubuntu 16.04 and CentOS 7.3).  This document presents some specifics of upgrading using the `.deb` package; some similar specifics of upgrading using the `.rpm` package; and then more generally upgrading using the `.tar.gz` binary distribution.  The binary package upgrade should serve as an example offering hints as to how to upgrade using the binary distributions on other operating systems, for example on Windows using the `.zip` file.  On other operating systems the general steps presented here will be roughly the same.

Before proceeding with the Kapacitor upgrade please ensure that InfluxDB and Telegraf (if used) have been upgraded to a release compatible with the latest release of Kapacitor.  In this example we will use:

   * InfluxDB 1.3.2
   * Telegraf 1.4
   * Kapacitor 1.4

For instructions on upgrading InfluxDB, please see the [InfluxDB upgrade](/influxdb/latest/administration/upgrading/#main-nav) documentation. For instructions on upgrading Telegraf, please see the [Telegraf upgrade](/telegraf/latest/administration/upgrading/#main-nav) documentation.

For information about what is new in the latest Kapacitor release, please see the [Changelog](https://github.com/influxdata/kapacitor/blob/master/CHANGELOG.md) available on GitHub.

In general the steps for upgrading Kapacitor are as follows:

   1. Download a copy of the latest Kapacitor install package or binary distribution from the [Influxdata download site](https://portal.influxdata.com/downloads).  

      **Important note** - When upgrading Kapacitor simply download the package using `wget`, do not proceed directly with the installation/upgrade until the following instructions and recommendations have been understood and put to use.

   1. Stop the running Kapacitor service, if it is not already stopped.
   1. Backup the configuration file (e.g. `/etc/kapacitor/kapacitor.conf` - n.b. the default location).
   1. (Optional) Back up a copy of the contents of the Kapacitor data directory (e.g `/var/lib/kapacitor/*` - n.b. the default location).
   1. Perform the upgrade.
   1. If during the upgrade the current configuration was not preserved, manually migrate the values in the backup configuration file to the new one.
   1. Restart the Kapacitor service.
   1. Verify the restart in the log files and by test recording existing tasks.

## Stopping the Kapacitor Service

No matter how Kapacitor was installed, it is assumed that Kapacitor is configured to run as a service using `systemd`.  

Through `systemctl` check to see if the Kapacitor service is running .

   ```
   $ sudo systemctl status kapacitor.service
   ● kapacitor.service - Time series data processing engine.
      Loaded: loaded (/lib/systemd/system/kapacitor.service; enabled; vendor preset: enabled)
      Active: inactive (dead) since Po 2017-08-21 14:06:18 CEST; 2s ago
        Docs: https://github.com/influxdb/kapacitor
     Process: 27741 ExecStart=/usr/bin/kapacitord -config /etc/kapacitor/kapacitor.conf $KAPACITOR_OPTS (code=exited, status=0/SUCCESS)
    Main PID: 27741 (code=exited, status=0/SUCCESS)
   ```

The value for the `Active` field shown above should be set to 'inactive'.

If instead this value happens to be 'active(running)', the service can be stopped using `systemctl`.

   *Example - Stopping the service*
   ```
   sudo systemctl stop kapacitor.service
   ```

## Backup Configuration and Data

Whenever upgrading, no matter the upgrade approach, it can pay to be a bit paranoid and to backup essential files and data.  Most important, when upgrading Kapacitor, is the Kapacitor configuration file `/etc/kapacitor/kapacitor.conf`. In addition the Kapacitor database, replays and id files in `/var/lib/kapacitor` might be preserved.

## Debian Package Upgrade

Check to see if Kapacitor was installed as a Debian package.

```
$ dpkg --list | grep "kapacitor"
ii  kapacitor   1.2.1-1   amd64   Time series data processing engine
```

If the line `ii  kapacitor...` is returned, it is safe to continue the upgrade using the Debian package and the instructions in this section.  If nothing is returned, please consult the [Upgrade with .zip or .tar.gz section below](#upgrade-with-zip-or-tar-gz) for a general example on how to proceed.

### Package Upgrade

Kapacitor can now be upgraded using the Debian package manager:

*Example - upgrade with dpkg*

```
$ sudo dpkg -i kapacitor_1.3.1_amd64.deb
(Reading database ... 283418 files and directories currently installed.)
Preparing to unpack kapacitor_1.3.1_amd64.deb ...
Unpacking kapacitor (1.3.1-1) over (1.2.1-1) ...
Removed symlink /etc/systemd/system/kapacitor.service.
Removed symlink /etc/systemd/system/multi-user.target.wants/kapacitor.service.
Setting up kapacitor (1.3.1-1) ...
```

During the upgrade the package manager will detect any differences between the current configuration file and the new configuration file included in the installation package.  The package manager prompts the user to choose how to deal with this conflict.  The default behavior is to preserve the existing configuration file.  This is generally the safest choice, but it can mean losing visibility of new features provided in the more recent release.

*Example - Prompt on configuration file conflict*
```
Configuration file '/etc/kapacitor/kapacitor.conf'
 ==> Modified (by you or by a script) since installation.
 ==> Package distributor has shipped an updated version.
   What would you like to do about it ?  Your options are:
    Y or I  : install the package maintainer's version
    N or O  : keep your currently-installed version
      D     : show the differences between the versions
      Z     : start a shell to examine the situation
 The default action is to keep your current version.
*** kapacitor.conf (Y/I/N/O/D/Z) [default=N] ?
```

### Migrate configuration file values

If during the upgrade the configuration file was overwritten, open the new configuration file in an editor such as `nano` or `vim` and from the backup copy of the old configuration file update the values of all changed keys - for example the InfluxDB fields for `username`, `password`, `urls` and the paths to `ssl-cert` and `ssl-key`.  Depending on the installation, there will most likely be more than just these.

### Restart Kapacitor

Restart is best handled through `systemctl`.

```
sudo systemctl restart kapacitor.service
```

Note that `restart` is used here instead of `start`, in the event that Kapacitor was not shutdown properly.

For tips on verifying the restart see the [Verifying the Restart](#verifying-the-restart) section below.

## RPM Package Upgrade

Check to see if Kapacitor was installed as an RPM package.

*Example - checking for Kapacitor installation*
```
# yum list installed kapacitor
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
 * base: ftp.sh.cvut.cz
 * extras: ftp.fi.muni.cz
 * updates: ftp.sh.cvut.cz
Installed Packages
kapacitor.x86_64      1.2.1-1     installed
```
If the line `kapacitor.x86_64...1.2.1-1...installed` is returned, it is safe to continue the upgrade using the RPM package and the instructions in this section.  If instead the message `Error: No matching Packages to list` was returned please consult the [Upgrade with .zip or .tar.gz section below](#upgrade-with-zip-or-tar-gz) for a general example on how to proceed.  

### Package Upgrade

Please note that the following example commands are run as user `root`.  To use them directly please log in as the `root` user or append `sudo` to them.

Kapacitor can now be upgraded using `yum localupdate` from the directory into which the installation packages were downloaded:

*Example - yum localupdate*
```
# yum -y localupdate kapacitor-1.3.1.x86_64.rpm
Loaded plugins: fastestmirror
Examining kapacitor-1.3.1.x86_64.rpm: kapacitor-1.3.1-1.x86_64
Marking kapacitor-1.3.1.x86_64.rpm as an update to kapacitor-1.2.1-1.x86_64
Resolving Dependencies
--> Running transaction check
---> Package kapacitor.x86_64 0:1.2.1-1 will be updated
---> Package kapacitor.x86_64 0:1.3.1-1 will be an update
--> Finished Dependency Resolution

Dependencies Resolved

=============================================================================================================================================================
 Package                            Arch                            Version                           Repository                                        Size
=============================================================================================================================================================
Updating:
 kapacitor                          x86_64                          1.3.1-1                           /kapacitor-1.3.1.x86_64                           90 M

Transaction Summary
=============================================================================================================================================================
Upgrade  1 Package

Total size: 90 M
Downloading packages:
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Updating   : kapacitor-1.3.1-1.x86_64                                                                                                                  1/2
warning: /etc/kapacitor/kapacitor.conf created as /etc/kapacitor/kapacitor.conf.rpmnew
Failed to execute operation: Too many levels of symbolic links
warning: %post(kapacitor-1.3.1-1.x86_64) scriptlet failed, exit status 1
Non-fatal POSTIN scriptlet failure in rpm package kapacitor-1.3.1-1.x86_64
  Cleanup    : kapacitor-1.2.1-1.x86_64                                                                                                                  2/2
Removed symlink /etc/systemd/system/multi-user.target.wants/kapacitor.service.
Removed symlink /etc/systemd/system/kapacitor.service.
Created symlink from /etc/systemd/system/kapacitor.service to /usr/lib/systemd/system/kapacitor.service.
Created symlink from /etc/systemd/system/multi-user.target.wants/kapacitor.service to /usr/lib/systemd/system/kapacitor.service.
  Verifying  : kapacitor-1.3.1-1.x86_64                                                                                                                  1/2
  Verifying  : kapacitor-1.2.1-1.x86_64                                                                                                                  2/2

Updated:
  kapacitor.x86_64 0:1.3.1-1                                                                                                                                 

Complete!

```

If after running `yum localupdate` the console messages are the same as above, it is safe to continue with managing the configuration files.

### Migrate configuration file values

In the example from the previous section a warning concerning the `kapacitor.conf` file may have been observed.  The original configuration file has been preserved and the new configuration file has been created with the extension `.rpmnew`.  To use the new configuration file rename the current configuration file `kapacitor.conf.121` and the new configuration file `kapacitor.conf`.  Using `vim` or `nano` manually migrate the old values from `kapacitor.conf.121` or from a backup copy into the new copy of `kapacitor.conf`.

### Restart Kapacitor

Restart is best handled through `systemctl`.

```
# systemctl restart kapacitor.service
```

Note that `restart` is used here instead of `start`, in the event that Kapacitor was not shutdown properly.

For tips on verifying the restart see the [Verifying the Restart](#verifying-the-restart) section below.

## Upgrade with .zip or .tar.gz

How Kapacitor has been installed using the binary distribution (.zip, .tgz) is open to a certain number of variables depending on the specific OS, organizational preferences and other factors.  The package contents may have been simply unpacked in a `/home/<user>` directory.  They may have been copied into the system directories suggested by the package file structure.  Or they may have been leveraged using another file system strategy.  The following discussion presents one hypothetical installation.  The steps are presentational and should, with a little bit of creative thinking, be adaptable to other types of installation.  

### A Hypothetical Installation
The following presentation will use a hypothetical installation, where all Influxdata products have been unpacked and are running from the directory `/opt/influxdata`.  Please note that it is recommended that Influxdata products should be installed using the system specific install packages (e.g. `.deb`, `.rpm`) whenever possible, however on other systems, for which there is no current installation package, the binary distribution (`.zip`, `.tar.gz`) can be used.

*Example - the Influxdata directory*
```
$ ls -l /opt/influxdata/
total 20
lrwxrwxrwx 1 influxdb  influxdb    33 srp 22 12:51 influxdb -> /opt/influxdata/influxdb-1.2.4-1/
drwxr-xr-x 5 influxdb  influxdb  4096 kvě  8 22:16 influxdb-1.2.4-1
lrwxrwxrwx 1 kapacitor kapacitor   34 srp 22 12:52 kapacitor -> /opt/influxdata/kapacitor-1.2.1-1/
drwxr-xr-x 6 kapacitor kapacitor 4096 srp 22 10:56 kapacitor-1.2.1-1
drwxr-xr-x 2 influxdb  influxdb  4096 srp 22 13:52 ssl
drwxrwxr-x 5 telegraf  telegraf  4096 úno  1  2017 telegraf
```
In the above example it can be seen that for the InfluxDB server and the Kapacitor application a generic directory has been created using a symbolic link to the directory for the specific product release.

Elsewhere in the file system, configuration and lib directories have been pointed into these locations using additional symbolic links.

*Example - symbolic links from /etc*
```
...
$ ls -l `find /etc -maxdepth 1 -type l -print`
lrwxrwxrwx 1 root root 38 srp 22 12:56 /etc/influxdb -> /opt/influxdata/influxdb/etc/influxdb/
lrwxrwxrwx 1 root root 40 srp 22 12:57 /etc/kapacitor -> /opt/influxdata/kapacitor/etc/kapacitor/
lrwxrwxrwx 1 root root 38 srp 22 12:57 /etc/telegraf -> /opt/influxdata/telegraf/etc/telegraf/
...
```

*Example - symbolic links from /usr/lib*
```
$ ls -l `find /usr/lib -maxdepth 1 -type l -print`
lrwxrwxrwx 1 root root 42 srp 22 13:31 /usr/lib/influxdb -> /opt/influxdata/influxdb/usr/lib/influxdb/
lrwxrwxrwx 1 root root 44 srp 22 13:33 /usr/lib/kapacitor -> /opt/influxdata/kapacitor/usr/lib/kapacitor/
...
lrwxrwxrwx 1 root root 42 srp 22 13:32 /usr/lib/telegraf -> /opt/influxdata/telegraf/usr/lib/telegraf/
```

*Example - symbolic links from /usr/bin*
```
 ls -l `find /usr/bin -maxdepth 1 -type l -print`
 ...
lrwxrwxrwx 1 root root 39 srp 22 14:40 /usr/bin/influx -> /opt/influxdata/influxdb/usr/bin/influx
lrwxrwxrwx 1 root root 40 srp 22 14:40 /usr/bin/influxd -> /opt/influxdata/influxdb/usr/bin/influxd
...
lrwxrwxrwx 1 root root 43 srp 22 14:04 /usr/bin/kapacitor -> /opt/influxdata/kapacitor/usr/bin/kapacitor
lrwxrwxrwx 1 root root 44 srp 22 14:04 /usr/bin/kapacitord -> /opt/influxdata/kapacitor/usr/bin/kapacitord
...
lrwxrwxrwx 1 root root 41 srp 22 13:57 /usr/bin/telegraf -> /opt/influxdata/telegraf/usr/bin/telegraf
...
```

Data file directories have been setup by hand.

*Example - /var/lib directory*
```
$ ls -l /var/lib/ | sort -k3,3
total 284
...
drwxr-xr-x  5 influxdb      influxdb      4096 srp 22 14:12 influxdb
drwxr-xr-x  3 kapacitor     kapacitor     4096 srp 22 14:16 kapacitor
...

```

InfluxDB is configured to use HTTPS and authentication.  InfluxDB, Telegraf and Kapacitor have been configured to start and stop with Systemd.

*Example - symbolic links in the systemd directory*
```
$ ls -l `find /etc/systemd/system -maxdepth 1 -type l -print`
...
lrwxrwxrwx 1 root root 42 srp 22 13:39 /etc/systemd/system/influxdb.service -> /usr/lib/influxdb/scripts/influxdb.service
lrwxrwxrwx 1 root root 44 srp 22 13:40 /etc/systemd/system/kapacitor.service -> /usr/lib/kapacitor/scripts/kapacitor.service
lrwxrwxrwx 1 root root 42 srp 22 13:39 /etc/systemd/system/telegraf.service -> /usr/lib/telegraf/scripts/telegraf.service
...

```
### Manual upgrade

Ensure that InfluxDB and Telegraf(if installed) have been upgraded, that the Kapacitor service has been stopped and that a backup copy of `kapacitor.conf` has been saved.

Here the latest InfluxDB distribution has been unpacked alongside the previous distribution and the general symbolic link has been updated. The Telegraf distribution has been unpacked on top of the previous one.

*Example - the Influxdata directory post InfluxDB and Telegraf upgrade*
```
$ ls -l /opt/influxdata/
total 24
drwxr-xr-x 2 root      root      4096 srp 22 15:21 bak
lrwxrwxrwx 1 root      root        17 srp 22 15:15 influxdb -> influxdb-1.3.2-1/
drwxr-xr-x 5 influxdb  influxdb  4096 kvě  8 22:16 influxdb-1.2.4-1
drwxr-xr-x 5 influxdb  influxdb  4096 srp  5 01:33 influxdb-1.3.2-1
lrwxrwxrwx 1 kapacitor kapacitor   34 srp 22 12:52 kapacitor -> /opt/influxdata/kapacitor-1.2.1-1/
drwxr-xr-x 6 kapacitor kapacitor 4096 srp 22 10:56 kapacitor-1.2.1-1
drwxr-xr-x 2 influxdb  influxdb  4096 srp 22 13:52 ssl
drwxr-xr-x 5 telegraf  telegraf  4096 čec 27 01:26 telegraf
```
Kapacitor is upgraded using the same approach as the InfluxDB upgrade.  The new distribution package is unpacked alongside of the current one.

*Example - unpacking the latest Kapacitor distribution*
```
$ cd /opt/influxdata
$ sudo tar -xvzf /home/karl/Downloads/install/kapacitor-1.3.1_linux_amd64.tar.gz
./kapacitor-1.3.1-1/
./kapacitor-1.3.1-1/usr/
./kapacitor-1.3.1-1/usr/bin/
./kapacitor-1.3.1-1/usr/bin/kapacitord
./kapacitor-1.3.1-1/usr/bin/kapacitor
./kapacitor-1.3.1-1/usr/bin/tickfmt
./kapacitor-1.3.1-1/usr/lib/
./kapacitor-1.3.1-1/usr/lib/kapacitor/
./kapacitor-1.3.1-1/usr/lib/kapacitor/scripts/
./kapacitor-1.3.1-1/usr/lib/kapacitor/scripts/init.sh
./kapacitor-1.3.1-1/usr/lib/kapacitor/scripts/kapacitor.service
./kapacitor-1.3.1-1/usr/share/
./kapacitor-1.3.1-1/usr/share/bash-completion/
./kapacitor-1.3.1-1/usr/share/bash-completion/completions/
./kapacitor-1.3.1-1/usr/share/bash-completion/completions/kapacitor
./kapacitor-1.3.1-1/var/
./kapacitor-1.3.1-1/var/log/
./kapacitor-1.3.1-1/var/log/kapacitor/
./kapacitor-1.3.1-1/var/lib/
./kapacitor-1.3.1-1/var/lib/kapacitor/
./kapacitor-1.3.1-1/etc/
./kapacitor-1.3.1-1/etc/kapacitor/
./kapacitor-1.3.1-1/etc/kapacitor/kapacitor.conf
./kapacitor-1.3.1-1/etc/logrotate.d/
./kapacitor-1.3.1-1/etc/logrotate.d/kapacitor
```
Following extraction the old symbolic link is removed and a new one is created to the new distribution.  This approach is similar to simply unpacking or copying the distribution contents over the existing directories, which is also a feasible approach.  Parallel unpacking and link creation offers the advantage of preserving the previous installation, albeit in a now inactive place. This approach facilitates reverting back to the previous installation, if for some reason that will be desired.  

*Example - Post extraction commands*
```
$ sudo chown -R kapacitor:kapacitor kapacitor-1.3.1-1/
$ sudo rm kapacitor
$ sudo ln -s ./kapacitor-1.3.1-1/ ./kapacitor
$ sudo chown kapacitor:kapacitor kapacitor
$ ls -l
total 28
drwxr-xr-x 2 root      root      4096 srp 22 15:21 bak
lrwxrwxrwx 1 root      root        17 srp 22 15:15 influxdb -> influxdb-1.3.2-1/
drwxr-xr-x 5 influxdb  influxdb  4096 kvě  8 22:16 influxdb-1.2.4-1
drwxr-xr-x 5 influxdb  influxdb  4096 srp  5 01:33 influxdb-1.3.2-1
lrwxrwxrwx 1 kapacitor kapacitor   20 srp 22 15:35 kapacitor -> ./kapacitor-1.3.1-1/
drwxr-xr-x 6 kapacitor kapacitor 4096 srp 22 10:56 kapacitor-1.2.1-1
drwxr-xr-x 5 kapacitor kapacitor 4096 čen  2 20:22 kapacitor-1.3.1-1
drwxr-xr-x 2 influxdb  influxdb  4096 srp 22 13:52 ssl
drwxr-xr-x 5 telegraf  telegraf  4096 čec 27 01:26 telegraf
```
### Migrate configuration file values

Using `vim` the values from the backup of the previous configuration file are manually migrated to the new one.

```
$ sudo -u kapacitor vim kapacitor/etc/kapacitor/kapacitor.conf
```

### Restart Kapacitor

Restart is handled through `systemctl`.

```
sudo systemctl restart kapacitor.service
```
Note that `restart` is used here instead of `start`, in the event that Kapacitor was not shutdown properly.

## Verifying the Restart

First check the service status in `systemctl`.

*Example - service status check*
```
$ sudo systemctl status kapacitor.service
● kapacitor.service - Time series data processing engine.
   Loaded: loaded (/lib/systemd/system/kapacitor.service; enabled; vendor preset: enabled)
   Active: active (running) since Po 2017-08-21 14:22:18 CEST; 16min ago
     Docs: https://github.com/influxdb/kapacitor
 Main PID: 29452 (kapacitord)
    Tasks: 13
   Memory: 11.6M
      CPU: 726ms
   CGroup: /system.slice/kapacitor.service
           └─29452 /usr/bin/kapacitord -config /etc/kapacitor/kapacitor.conf
```
Check the log in `journalctl`

*Example - journalctl check*
```
srp 21 14:22:18 algonquin systemd[1]: Started Time series data processing engine..
srp 21 14:22:18 algonquin kapacitord[29452]: '##:::'##::::'###::::'########:::::'###:::::'######::'####:'########::'#######::'########::
srp 21 14:22:18 algonquin kapacitord[29452]:  ##::'##::::'## ##::: ##.... ##:::'## ##:::'##... ##:. ##::... ##..::'##.... ##: ##.... ##:
srp 21 14:22:18 algonquin kapacitord[29452]:  ##:'##::::'##:. ##:: ##:::: ##::'##:. ##:: ##:::..::: ##::::: ##:::: ##:::: ##: ##:::: ##:
srp 21 14:22:18 algonquin kapacitord[29452]:  #####::::'##:::. ##: ########::'##:::. ##: ##:::::::: ##::::: ##:::: ##:::: ##: ########::
srp 21 14:22:18 algonquin kapacitord[29452]:  ##. ##::: #########: ##.....::: #########: ##:::::::: ##::::: ##:::: ##:::: ##: ##.. ##:::
srp 21 14:22:18 algonquin kapacitord[29452]:  ##:. ##:: ##.... ##: ##:::::::: ##.... ##: ##::: ##:: ##::::: ##:::: ##:::: ##: ##::. ##::
srp 21 14:22:18 algonquin kapacitord[29452]:  ##::. ##: ##:::: ##: ##:::::::: ##:::: ##:. ######::'####:::: ##::::. #######:: ##:::. ##:
srp 21 14:22:18 algonquin kapacitord[29452]: ..::::..::..:::::..::..:::::::::..:::::..:::......:::....:::::..::::::.......:::..:::::..::
srp 21 14:22:18 algonquin kapacitord[29452]: 2017/08/21 14:22:18 Using configuration at: /etc/kapacitor/kapacitor.conf
```
Check as well the log in the directory `/var/log/kapacitor`.

*Example - kapacitor.log check*
```
$ sudo tail -f  /var/log/kapacitor/kapacitor.log
[httpd] 127.0.0.1 - - [21/Aug/2017:14:41:50 +0200] "POST /write?consistency=&db=_internal&precision=ns&rp=monitor HTTP/1.1" 204 0 "-" "InfluxDBClient" 1a122e03-866e-11e7-80f1-000000000000 375
[httpd] 127.0.0.1 - - [21/Aug/2017:14:41:50 +0200] "POST /write?consistency=&db=telegraf&precision=ns&rp=autogen HTTP/1.1" 204 0 "-" "InfluxDBClient" 1a401bb1-866e-11e7-80f2-000000000000 303
[httpd] 127.0.0.1 - - [21/Aug/2017:14:42:00 +0200] "POST /write?consistency=&db=_internal&precision=ns&rp=monitor HTTP/1.1" 204 0 "-" "InfluxDBClient" 200818be-866e-11e7-80f3-000000000000 398
[httpd] 127.0.0.1 - - [21/Aug/2017:14:42:00 +0200] "POST /write?consistency=&db=telegraf&precision=ns&rp=autogen HTTP/1.1" 204 0 "-" "InfluxDBClient" 20360382-866e-11e7-80f4-000000000000 304
[httpd] 127.0.0.1 - - [21/Aug/2017:14:42:10 +0200] "POST /write?consistency=&db=_internal&precision=ns&rp=monitor HTTP/1.1" 204 0 "-" "InfluxDBClient" 25fded1a-866e-11e7-80f5-000000000000 550
[httpd] 127.0.0.1 - - [21/Aug/2017:14:42:10 +0200] "POST /write?consistency=&db=telegraf&precision=ns&rp=autogen HTTP/1.1" 204 0 "-" "InfluxDBClient" 262be594-866e-11e7-80f6-000000000000 295
[httpd] 127.0.0.1 - - [21/Aug/2017:14:42:20 +0200] "POST /write?consistency=&db=_internal&precision=ns&rp=monitor HTTP/1.1" 204 0 "-" "InfluxDBClient" 2bf3d170-866e-11e7-80f7-000000000000 473
[httpd] 127.0.0.1 - - [21/Aug/2017:14:42:20 +0200] "POST /write?consistency=&db=telegraf&precision=ns&rp=autogen HTTP/1.1" 204 0 "-" "InfluxDBClient" 2c21ddde-866e-11e7-80f8-000000000000 615
[httpd] 127.0.0.1 - - [21/Aug/2017:14:42:30 +0200] "POST /write?consistency=&db=_internal&precision=ns&rp=monitor HTTP/1.1" 204 0 "-" "InfluxDBClient" 31e9b251-866e-11e7-80f9-000000000000 424
[httpd] 127.0.0.1 - - [21/Aug/2017:14:42:30 +0200] "POST /write?consistency=&db=telegraf&precision=ns&rp=autogen HTTP/1.1" 204 0 "-" "InfluxDBClient" 3217a267-866e-11e7-80fa-000000000000 288

```

Check for Kapacitor client activity in Influxdb.

*Example - Influxdb check*
```
sudo journalctl --unit influxdb.service | grep "Kapacitor"
srp 21 14:45:18 algonquin influxd[27308]: [httpd] 127.0.0.1 - admin [21/Aug/2017:14:45:18 +0200] "GET /ping HTTP/1.1" 204 0 "-" "KapacitorInfluxDBClient" 965e7c0b-866e-11e7-81c7-000000000000 21
srp 21 14:45:18 algonquin influxd[27308]: [httpd] 127.0.0.1 - admin [21/Aug/2017:14:45:18 +0200] "POST /query?db=&q=SHOW+DATABASES HTTP/1.1" 200 123 "-" "KapacitorInfluxDBClient" 965e89e5-866e-11e7-81c8-000000000000 570
srp 21 14:45:18 algonquin influxd[27308]: [httpd] 127.0.0.1 - admin [21/Aug/2017:14:45:18 +0200] "POST /query?db=&q=SHOW+RETENTION+POLICIES+ON+_internal HTTP/1.1" 200 158 "-" "KapacitorInfluxDBClient" 965fcf0f-866e-11e7-81c9-000000000000 308
srp 21 14:45:18 algonquin influxd[27308]: [httpd] 127.0.0.1 - admin [21/Aug/2017:14:45:18 +0200] "POST /query?db=&q=SHOW+RETENTION+POLICIES+ON+telegraf HTTP/1.1" 200 154 "-" "KapacitorInfluxDBClient" 96608b2b-866e-11e7-81ca-000000000000 1812
srp 21 14:45:18 algonquin influxd[27308]: [httpd] 127.0.0.1 - admin [21/Aug/2017:14:45:18 +0200] "POST /query?db=&q=SHOW+SUBSCRIPTIONS HTTP/1.1" 200 228 "-" "KapacitorInfluxDBClient" 96618c32-866e-11e7-81cb-000000000000 380

```

Verify that old tasks are once again visible and enabled.

*Example - tasks check*
```
$ kapacitor list tasks
ID               Type      Status    Executing Databases and Retention Policies
cpu_alert_batch  batch     disabled  false     ["telegraf"."autogen"]
cpu_alert_stream stream    enabled   true      ["telegraf"."autogen"]
```

Test recording existing tasks and replaying the results is also recommended for checking the status of the newly upgraded Kapacitor service.  Which tasks to record will depend on the specifics of the installation.  Please see the [Kapacitor API documentation](/kapacitor/v1.4/working/api#recordings) for more details.  

If these checks look correct, then the upgrade can be considered complete.
 
