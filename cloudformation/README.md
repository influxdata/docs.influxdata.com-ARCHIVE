# Deploying the InfluxData Docs

Use the following command to deploy a CloudFormation stack using the template in this directory.

```sh
aws cloudformation deploy \
    --template-file cloudformation/archive-website.yml \
    --stack-name="${STACK_NAME}" \
    --capabilities CAPABILITY_IAM \
    --no-execute-changeset \
    --parameter-overrides \
        AcmCertificateArn="${ACM_ARN}" \
        DomainName="${DOMAIN_NAME}"
```

The `--no-execute-changeset` option will display the actions that will be taken. Remove the `--no-execute-changeset` option to actually deploy a change.
