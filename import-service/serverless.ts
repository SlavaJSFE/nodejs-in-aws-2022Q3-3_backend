import type { AWS } from '@serverless/typescript';
import 'dotenv/config';

import importProductFile from '@functions/importProductFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: '${env:REGION}',
      BUCKET: '${env:BUCKET}',
      UPLOADED_PREFIX: '${env:UPLOADED_PREFIX}',
      PARSED_PREFIX: '${env:PARSED_PREFIX}',
      SQSQUEUE_URL: '${env:SQSQUEUE_URL}',
      SQSQUEUE_ARN: '${env:SQSQUEUE_ARN}'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 's3:ListBucket',
            Resource: 'arn:aws:s3:::${env:BUCKET}'
          },
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: 'arn:aws:s3:::${env:BUCKET}/*'
          },
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: '${env:SQSQUEUE_ARN}'
          }
        ],
        managedPolicies: ["arn:aws:iam::aws:policy/AmazonSQSFullAccess"]
      },
    },
  },
  functions: { importProductFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    'serverless-offline': {
      httpPort: 4000,
    },
  },
};

module.exports = serverlessConfiguration;
