import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { formatJSONResponse } from "@libs/api-gateway";
import { s3Client } from "@libs/s3-service";
import { APIGatewayProxyEvent } from "aws-lambda";
import { HttpCode } from "src/utils/http.utils";

export const handler = async (event: APIGatewayProxyEvent) => {
  const fileName = event.queryStringParameters?.name;

  if (!fileName) {
    return formatJSONResponse({
      message: `Missing query parameter "name"`,
    }, HttpCode.BAD_REQUEST);
  }

  const prefix = 'uploaded/';
  const params = {
    Bucket: process.env.BUCKET,
    Key: `${prefix}${fileName}`
  };
  const command = new PutObjectCommand(params);

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return formatJSONResponse({ signedUrl });
  } catch (error) {
    return formatJSONResponse({
      message: error.message,
    }, HttpCode.SERVER_ERROR);
  }
};
