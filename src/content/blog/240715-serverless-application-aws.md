---
author: Romain C.
pubDatetime: 2024-07-15T10:45:00Z
title: "Building a Serverless Application with AWS Lambda and API Gateway"
slug: serverless-application-aws
featured: false
draft: false
tags:
  - aws
  - serverless
  - lambda
  - api-gateway
  - cloud
description: "How to build a serverless application using AWS Lambda and API Gateway"
---

## Introduction

Serverless architecture allows you to build and run applications without managing servers. AWS Lambda and API Gateway provide a powerful combination for building serverless applications. Let's build a simple serverless application using AWS Lambda and API Gateway.

## Prerequisites

To follow along, you should have a basic understanding of:

- JavaScript and Node.js
- AWS services (Lambda, API Gateway)
- AWS CLI

## Setting Up the Project

### 1. Install AWS CLI

If you haven't already, install the AWS CLI and configure it with your AWS credentials.

```sh
pip install awscli
aws configure
```

### 2. Create a New Lambda Function

Create a new directory for your project and initialize a new Node.js project.

```sh
mkdir serverless-app
cd serverless-app
npm init -y
```

### 3. Create the Lambda Function

Create a file named `index.js` and add the following code:

```javascript
// filepath: /serverless-app/index.js
exports.handler = async (event) => {
  const name = event.queryStringParameters.name || "World";
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello, ${name}!` }),
  };
  return response;
};
```

### 4. Create a Deployment Package

Create a deployment package by zipping the `index.js` file.

```sh
zip function.zip index.js
```

### 5. Deploy the Lambda Function

Deploy the Lambda function using the AWS CLI.

```sh
aws lambda create-function --function-name HelloWorldFunction --zip-file fileb://function.zip --handler index.handler --runtime nodejs14.x --role arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_ROLE_NAME
```

### 6. Create an API Gateway

Create a new API Gateway and link it to your Lambda function.

```sh
aws apigateway create-rest-api --name 'HelloWorldAPI'
```

Get the `restApiId` from the response and create a resource and method.

```sh
aws apigateway get-resources --rest-api-id YOUR_REST_API_ID
aws apigateway create-resource --rest-api-id YOUR_REST_API_ID --parent-id YOUR_PARENT_ID --path-part hello
aws apigateway put-method --rest-api-id YOUR_REST_API_ID --resource-id YOUR_RESOURCE_ID --http-method GET --authorization-type "NONE"
aws apigateway put-integration --rest-api-id YOUR_REST_API_ID --resource-id YOUR_RESOURCE_ID --http-method GET --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:YOUR_REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:YOUR_REGION:YOUR_ACCOUNT_ID:function:HelloWorldFunction/invocations
```

### 7. Deploy the API

Deploy the API to a stage.

```sh
aws apigateway create-deployment --rest-api-id YOUR_REST_API_ID --stage-name prod
```

## Testing the Application

Open your browser and navigate to the following URL:

```
https://YOUR_REST_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod/hello?name=YourName
```

You should see a JSON response with a greeting message.

## Conclusion

We just built a simple serverless application using AWS Lambda and API Gateway. This example can be extended to include more complex logic, integrate with other AWS services, and handle different HTTP methods. Serverless architecture provides a scalable and cost-effective way to build and run applications without managing servers.

Happy coding!
