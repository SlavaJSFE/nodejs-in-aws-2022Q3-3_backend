import { S3Client } from "@aws-sdk/client-s3";
import { Stream } from "stream";
import csvParser from "csv-parser";

export const s3Client = new S3Client({ region: process.env.REGION });

export const processS3Stream = async (stream: Stream) => {
  return new Promise((resolve, reject) => {
    const records = [];
    stream
      .pipe(csvParser())
      .on('data', (data) => records.push(data))
      .on('error', reject)
      .on('end', () => resolve(records));
  });
};
