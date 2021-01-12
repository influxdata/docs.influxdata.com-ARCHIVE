S3DEPLOY_DOWNLOAD=s3deploy_${S3DEPLOY_VERSION}_Linux-64bit.tar.gz

set -x
set -e

# Install s3deploy if not already cached or upgrade an old version.
if [ ! -e $HOME/bin/s3deploy ] || ! [[ `$HOME/bin/s3deploy -V` =~ ${S3DEPLOY_VERSION} ]]; then
  wget https://github.com/bep/s3deploy/releases/download/v${S3DEPLOY_VERSION}/${S3DEPLOY_DOWNLOAD}
  tar xvzf ${S3DEPLOY_DOWNLOAD} s3deploy
  mv s3deploy $HOME/bin/s3deploy
fi