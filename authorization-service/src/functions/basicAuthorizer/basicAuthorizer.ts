import { formatJSONResponse } from "@libs/api-gateway";
import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent } from "aws-lambda";
import { Effect } from "src/models/enums";

export const handler = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  const token = event.headers.Authorization.replace('Basic ', '');
  const decodedToken = Buffer.from(token, 'base64').toString('utf8');
  const [githubUserName, password] = decodedToken.split(':');
  const TEST_PASSWORD = process.env[githubUserName];
  const principalId = 'test';
  
  if (TEST_PASSWORD && TEST_PASSWORD === password) {
    return formatJSONResponse(principalId, Effect.Allow, event.methodArn);
  }
  
  return formatJSONResponse(principalId, Effect.Deny, event.methodArn);
};
