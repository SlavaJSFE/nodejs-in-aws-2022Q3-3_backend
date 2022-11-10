import { S3Event } from "aws-lambda";
import { processS3Stream, s3Client } from '@libs/s3-service';
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { formatJSONResponse } from "@libs/api-gateway";
import { HttpCode } from "src/utils/http.utils";
import { sendToSQSQueue } from "@libs/sqs-servise";
import { Product } from "src/models/interfaces";

export const handler = async (event: S3Event) => {
  const record = event.Records[0];
  const params = {
    Bucket: process.env.BUCKET,
    Key: record.s3.object.key,
  };

  const copyParams = {
    Bucket: process.env.BUCKET,
    CopySource: `${process.env.BUCKET}/${record.s3.object.key}`,
    Key: record.s3.object.key.replace(process.env.UPLOADED_PREFIX, process.env.PARSED_PREFIX),
  };

  try {
    const s3Stream = await s3Client.send(new GetObjectCommand(params));
    const parsedProducts: any = await processS3Stream((s3Stream.Body));
    await s3Client.send(new CopyObjectCommand(copyParams));
    await s3Client.send(new DeleteObjectCommand(params));
    
    await parsedProducts.forEach(async (item: Product) => { 
      const data = await sendToSQSQueue(item);
      console.log("message to SQS Queue was sent. Message ID: ", data.MessageId);
    });
  } catch (error) {
    formatJSONResponse(error.message, error.statusCode || HttpCode.SERVER_ERROR)
  }
};
