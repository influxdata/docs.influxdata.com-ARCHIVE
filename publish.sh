#!/bin/bash
#
# Push the updated site to s3 from master.
#
# This expects (and does NOT check for) s3cmd to be installed and configured!
# This expects (and does NOT check for) hugo to be installed and on your $PATH.
# You still need to manually create a Cloudfront invalidation when this script finishes.

bucket='docs.influxdata.com'

branch=$(git rev-parse --abbrev-ref HEAD)
timestamp=$(date +%s)
json="{\"Paths\":{\"Quantity\":1,\"Items\":[\"/*\"]},\"CallerReference\":\"$timestamp\"}"

if [[ "$branch" == "master" ]]; then
  rm -rf deploy
  echo -e "\nGenerating pages with Hugo..."
  hugo -d deploy
  echo "Syncing deploy/* with s3://$bucket"
  find . -name '*.DS_Store' -type f -delete
  s3cmd --acl-public --delete-removed --no-progress sync deploy/* s3://$bucket
  echo -e "\nUpdated s3://$bucket"
  echo -e "\nRunning Cloudfront invalidation..."
  aws cloudfront create-invalidation --distribution-id E2IGITYNZC52HZ --invalidation-batch $json
else
  echo "*** s3://$bucket only gets synced from master! ***"
fi

exit 0
