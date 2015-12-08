# Deploying [docs.influxdata.com](https://docs.influxdata.com/)

There are two ways to easily push changes to the site. Both methods rely on a script called `publish.sh` that will quickly deploy and synchronize the correct set of files from `master`. The push can be done manually or via a dedicated build server.

## Manually deploying to S3 from OS X

First, install all dependencies.

```
brew install hugo s3cmd awscli
```

Then configure `s3cmd` and `awscli` to use the S3 credentials, which are stored in 1Password.

```
s3cmd --configure
aws configure
aws configure set preview.cloudfront true
```

Now the site can be compiled and pushed to S3 at any time by executing `publish.sh` in the root directory of this repo.

```
cd path/to/docs.influxdata.com
./build/publish.sh
```

## Deploy using a build server

Starting with a new Ubuntu instance, install Hugo.

```
wget https://github.com/spf13/hugo/releases/download/v0.15/hugo_0.15_linux_amd64.tar.gz
tar xzvf hugo_0.15_linux_amd64.tar.gz
mv hugo_0.15_linux_amd64/hugo_0.15_linux_amd64 /usr/local/bin/hugo
rm -rf hugo_0.15_linux_amd64*
```

Install `git`, `awscli`, and `s3cmd`.

```
apt-get update
apt-get install git
apt-get install python-pip
pip install awscli
pip install s3cmd
```

Configure `s3cmd` and `awscli` tools using the S3 credentials stored in 1Password.

```
s3cmd --configure
aws configure
aws configure set preview.cloudfront true
```

Install Caddy with the `git` add-on

```
mkdir temp && cd temp
# Note: the following link may not work. If not, download and scp the binary to the server
wget https://caddyserver.com/download/build?os=linux&arch=amd64&features=git
tar xzvf caddy_linux_amd64.tar.gz
mv caddy /usr/local/bin/caddy
cd .. && rm -rf temp
```

Install the docs.influxdata.com repo and Caddyfile

```
git clone git@github.com:influxdb/docs.influxdata.com.git
cp docs.influxdata.com/build/publish.sh .
```

Start Caddy

```
caddy
```

[comment]: <> (TODO:(Gunnar): Figure out the best way to run Caddy as a service, probably as a [systemd service](https://blog.captncraig.io/post/caddy/).)

[comment]: <> (TODO(Gunnar): Set up search using Caddy Bleve or custom [fuzzy](https://github.com/sajari/fuzzy) plugin.)
