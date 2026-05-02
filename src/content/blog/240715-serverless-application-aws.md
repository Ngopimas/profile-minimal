---
author: Romain C.
pubDatetime: 2024-07-15T10:45:00Z
title: "Building a Serverless Application with AWS Lambda and API Gateway"
slug: serverless-application-aws
featured: false
draft: false
tags: ["aws", "serverless", "lambda", "api-gateway", "cloud"]
description: "A minimal serverless setup with AWS Lambda and API Gateway"
---

Serverless does not mean there are no servers. It means you do not manage them. AWS handles provisioning, scaling, and patching. You just write functions and attach them to triggers.

Lambda and API Gateway are the simplest entry point. A Lambda function runs your code. API Gateway routes HTTP requests to it. Together they give you a scalable API without thinking about infrastructure.

## Setting up

Install the AWS CLI and configure it with your credentials:

```sh
pip install awscli
aws configure
```

Create a new project:

```sh
mkdir serverless-app
cd serverless-app
npm init -y
```

Write a basic handler:

```javascript
// filepath: /serverless-app/index.js
exports.handler = async event => {
  const name = event.queryStringParameters.name || "World";
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello, ${name}!` }),
  };
  return response;
};
```

Package and deploy:

```sh
zip function.zip index.js

aws lambda create-function \
  --function-name HelloWorldFunction \
  --zip-file fileb://function.zip \
  --handler index.handler \
  --runtime nodejs14.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_ROLE_NAME
```

Create an API Gateway and link it to the Lambda:

```sh
aws apigateway create-rest-api --name 'HelloWorldAPI'

# Get the restApiId from the response, then create resources and methods
aws apigateway get-resources --rest-api-id YOUR_REST_API_ID
aws apigateway create-resource --rest-api-id YOUR_REST_API_ID --parent-id YOUR_PARENT_ID --path-part hello
aws apigateway put-method --rest-api-id YOUR_REST_API_ID --resource-id YOUR_RESOURCE_ID --http-method GET --authorization-type "NONE"
aws apigateway put-integration --rest-api-id YOUR_REST_API_ID --resource-id YOUR_RESOURCE_ID --http-method GET --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:YOUR_REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:YOUR_REGION:YOUR_ACCOUNT_ID:function:HelloWorldFunction/invocations
```

Deploy the API to a stage:

```sh
aws apigateway create-deployment --rest-api-id YOUR_REST_API_ID --stage-name prod
```

Then open `https://YOUR_REST_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod/hello?name=YourName` in a browser. You should see a JSON greeting.

That is the whole setup. In practice, I use the Serverless Framework or AWS SAM instead of raw CLI commands. They handle the wiring and make deployments repeatable. But it is useful to know what the CLI commands are doing under the hood.
