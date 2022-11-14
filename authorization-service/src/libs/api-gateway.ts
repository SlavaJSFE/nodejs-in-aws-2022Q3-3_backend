import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import { Effect } from "src/models/enums";
import { generatePolicyDocument } from "./policy-utils";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (principalId: string, effect: Effect, resource: string) => {
  return {
    principalId,
    policyDocument: generatePolicyDocument(effect, resource),
  };
};
