import { PolicyDocument } from "aws-lambda";
import { Effect } from "src/models/enums";

export const generatePolicyDocument = (effect: Effect, resource: string): PolicyDocument => {
  return {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    }],
  };
};
