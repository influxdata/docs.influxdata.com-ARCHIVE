# Deploying [docs.influxdata.com](https://docs.influxdata.com/)

## Manually deploying to S3 from a Mac

If you have the correct S3 credentials, you can easily push changes to the site. There's a script called `publish.sh` that will quickly deploy and synchronize the correct set of files from `master`.

### Install Dependencies

#### s3cmd

The `publish.sh` script uses a package called `s3cmd`, which you'll need to install first:

If you're using OSX:

```
brew install s3cmd
s3cmd --configure
```

Or, if you're using Ubuntu:

```
apt-get install s3cmd
s3cmd --configure
```

You'll then be prompted to set up the S3 credentials - you can get these from Gunnar, Regan, or Todd.

#### hugo

If you don't already have [Hugo](https://github.com/spf13/hugo) installed, you can install it via Homebrew by doing:

```
brew install hugo
```

Or build it from `master` by doing:

```
go get github.com/spf13/hugo
```

Just make sure the `hugo` binary is in your `PATH` before running the script.

### Publishing Changes

When you execute `publish.sh`, it will generate a new copy of the site in the `deploy` directory, to ensure that you don't have a collision with changes in the default `public` directory. It will then deploy all of the changes directly to the bucket. You'll still need to enter the CloudFront invalidation via the AWS interface (for now).

If you see any errors, double check that you'd supplied the correct S3 credentials and that both the `s3cmd` and `hugo` binaries are in your `PATH`.

## Setting up the build server

- Install Hugo, Note: Due to a menu bug, Hugo actually needs to be compiled manually
    wget https://github.com/spf13/hugo/releases/download/v0.15/hugo_0.15_linux_amd64.tar.gz
    tar xzvf hugo_0.15_linux_amd64.tar.gz
    mv hugo_0.15_linux_amd64/hugo_0.15_linux_amd64 /usr/bin/hugo
    rm -rf hugo_0.15_linux_amd64*
- Install Caddy, 
    wget https://github.com/mholt/caddy/releases/download/v0.8-beta.4/caddy_linux_amd64.tar.gz
    mkdir temp && cd temp
    tar xzvf caddy_linux_amd64.tar.gz
    mv caddy /usr/bin/caddy
    cd .. && rm -rf temp
- Install git, awscli, and s3cmd
    apt-get update
    apt-get install git
    apt-get install python-pip
    pip install awscli
    pip install s3cmd
- Configure tools
    aws configure
    s3cmd --configure
- Start Caddy
    # on local machine
    cd docs.influxdata.com
    scp Caddyfile build.docs.influxdata.com:
    # on build server
    ./caddy

TODO:(Gunnar): Figure out the best way to run Caddy as a service, probably as a systemd service        

TODO(Gunnar): Set up search using Caddy Bleve or custom [fuzzy](https://github.com/sajari/fuzzy) plugin.
