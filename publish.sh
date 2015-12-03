#!/bin/bash
#
# Push the updated site to s3 from master.
#
# This expects (and does NOT check for) s3cmd to be installed and configured!
# This expects (and does NOT check for) hugo to be installed and on your $PATH.
# You still need to manually create a Cloudfront invalidation when this script finishes.

bucket='docs.influxdata.com'

branch=$(git rev-parse --abbrev-ref HEAD)

if [[ "$branch" == "develop" ]]; then
  rm -rf deploy
  echo -e "\nGenerating pages with Hugo..."
  hugo -d deploy --config
  echo "Syncing deploy/* with s3://$bucket"
  find . -name '*.DS_Store' -type f -delete
  s3cmd --acl-public --delete-removed --no-progress sync deploy/* s3://$bucket
  echo -e "\nUpdated s3://$bucket"
  echo -e "\nRunning Cloudfront invalidation..."
  # aws cloudfront create-invalidation --invalidation-batch file://etc/invalidation.json --distribution-id E10ZG9KVHHU3HM
else
  echo "*** s3://$bucket only gets synced from develop right now! ***"
fi

exit 0
