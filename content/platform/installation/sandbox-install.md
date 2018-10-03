---
title: Install the InfluxData Sandbox
description: Instructions for installing the InfluxData Sandbox, the quickest way to get a TICK stack up and running and ready for exploration and testing.
menu:
  platform:
    name: Sandbox Installation
    parent: Installation and configuration
    weight: 1
---

The [InfluxData Sandbox](https://github.com/influxdata/sandbox) is the quickest
way to get a TICK stack up and running and ready for exploration and testing.
It uses [Docker](https://www.docker.com) and [Docker Compose](https://docs.docker.com/compose/overview/)
to build a containerized, ready-to-use TICK stack preconfigured to capture
data from your local machine and the Sandbox's Docker containers.

The Sandbox is by far the easiest way to build a TICK stack, but it is not recommended
for production use.

## Requirements
- Linux or MacOS <em style="opacity:.5;margin-left:.5em;">(Windows support is coming)</em>
- [Git](https://git-scm.com/)
- [Docker](https://docs.docker.com/install/#supported-platforms)
- [Docker Compose](https://docs.docker.com/compose/install/)
<em style="opacity:.5;margin-left:.5em;">(Packaged with Docker for Mac)</em>

## Download and run the Sandbox
The InfluxData Sandbox is open source and is available for
[download from Github](https://github.com/influxdata/sandbox).
To download it, use `git` to clone the source repository:

```bash
# Clone the InfluxData Sandbox from Github
git clone git@github.com:influxdata/sandbox.git
```

The Sandbox repo includes a `sandbox` binary used to provision and manage the
Sandbox's containers and data. Run `./sandbox up` from inside the `sandbox` directory
to download the necessary images, then build and start all the required Docker containers.

```bash
# cd into the sandbox directory
cd sandbox

# Start the sandbox
./sandbox up
```

> Make sure no other instances of TICK stack components are running on your local
> machine when starting the Sandbox. Otherwise you will run into port conflicts
> and the Sandbox won't be able to start properly.

Once started, two tabs will open in your browser:

1. Chronograf ([localhost:8888](http://localhost:8888))
2. InfluxData Sandbox Documentation  ([localhost:3010](http://localhost:3010))

Chronograf is the web-base user-interface for the TICK stack and is, for many, the
primary tool used to manage the stack. It allows you to query and explore data,
[create Kapacitor alerts](/chronograf/v1.6/guides/create-alert-rules/),
preview [data visualizations](/chronograf/v1.6/guides/visualization-types/),
[build custom dashboards](/chronograf/v1.6/guides/create-a-dashboard/), etc.

### Using nightly builds
The `./sandbox up` command includes a `-nightly` option that will pull nightly
builds for InfluxDB and Chronograf, giving you the most recent updates and
experimental functionality.

<dt>
Nightly builds are experimental and are not guaranteed to be functional.
</dt>

```bash
./sandbox up -nightly
```

## Interacting with the Sandbox TICK stack
With the Sandbox running, each component of the TICK stack is available to work with.
The Sandbox documentation provides tutorials for interacting with each component.
The documentation is available at [localhost:3010/tutorials](http://localhost:3010/tutorials)
(with the Sandbox running) or [on Github](https://github.com/influxdata/sandbox/tree/master/documentation/static/tutorials).

All configuration files, tools, and CLIs needed for managing each component of the
TICK stack are included in their respective Docker containers.
Tasks outlined throughout the InfluxData documentation can be accomplished using
the InfluxData Sandbox.

The `./sandbox enter` command opens a console inside the specified container where
the project's configuration files and CLIs are available.

```bash
# Pattern
./sandbox enter [ telegraf | influxdb | chronograf | kapacitor ]

# Example: console into the telegraf container
./sandbox enter telegraf
```

> After updating a configuration file in a Sandbox container, use the `./sandbox restart`
> command to restart the containers and apply the updated configuration.
