---
title: Running Telegraf as a Windows service
description: How to configure Telegraf as a Windows service.
menu:
  telegraf_1_15:
    name: Running as Windows service
    weight: 20
    parent: Administration
---

Telegraf natively supports running as a Windows service.

The following commands are available:

| Command                            | Effect                        |
|------------------------------------|-------------------------------|
| `telegraf.exe --service install`   | Install telegraf as a service |
| `telegraf.exe --service uninstall` | Remove the telegraf service   |
| `telegraf.exe --service start`     | Start the telegraf service    |
| `telegraf.exe --service stop`      | Stop the telegraf service     |

Outlined below are the general steps to install Telegraf as a Service.

{{% note %}}
Installing a Windows service requires administrative permissions.
Be sure to [launch Powershell as administrator](
https://docs.microsoft.com/en-us/powershell/scripting/windows-powershell/starting-windows-powershell?view=powershell-7#with-administrative-privileges-run-as-administrator).
{{% /note %}}

1. Download the Telegraf binary and unzip its contents to `C:\Program Files\InfluxData\Telegraf`.
2. In PowerShell, run the following as an administrator:
   ```powershell
   > cd "C:\Program Files\InfluxData\Telegraf"
   > .\telegraf.exe --service install --config "C:\Program Files\InfluxData\Telegraf\telegraf.conf"
   ```
   When installing as service in Windows, always double check to specify full, correct path of the config file.
   Otherwise the Windows service may fail to start.
3. To test that the installation works, run:

   ```powershell
   > C:\"Program Files"\Telegraf\telegraf.exe --config C:\"Program Files"\Telegraf\telegraf.conf --test
   ```

4. To start collecting data, run:

   ```powershell
   telegraf.exe --service start
   ```

<!--
#### Config Directory

You can also specify a `--config-directory` for the service to use:

1. Create a directory for configuration snippets: `C:\Program Files\Telegraf\telegraf.d`
2. Include the `--config-directory` option when registering the service:
   ```
   > C:\"Program Files"\Telegraf\telegraf.exe --service install --config C:\"Program Files"\Telegraf\telegraf.conf --config-directory C:\"Program Files"\Telegraf\telegraf.d
   ```
-->

{{% note %}}
## Logging and troubleshooting
When Telegraf runs as a Windows service, Telegraf logs messages to Windows event logs.
If the Telegraf service fails on start, view error logs by selecting **Event Viewer**→**Windows Logs**→**Application**.
{{% /note %}}
