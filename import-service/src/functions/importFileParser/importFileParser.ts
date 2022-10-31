import { S3Event } from "aws-lambda";
import { processS3Stream, s3Client } from '@libs/s3-service';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { formatJSONResponse } from "@libs/api-gateway";
import { HttpCode } from "src/utils/http.utils";

export const handler = async (event: S3Event) => {
  const record = event.Records[0];
  const params = {
    Bucket: process.env.BUCKET,
    Key: record.s3.object.key,
  };

  try {
    const s3Stream = await s3Client.send(new GetObjectCommand(params));
    const parsedProducts: any = await processS3Stream((s3Stream.Body));

    console.log(parsedProducts);
  } catch (error) {
    formatJSONResponse(error.message, error.statusCode || HttpCode.SERVER_ERROR)
  }
};
