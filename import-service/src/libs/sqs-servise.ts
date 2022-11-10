import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Product } from "src/models/interfaces";

const sqsClient = new SQSClient({ region: process.env.REGION });

export const sendToSQSQueue = async (record: Product) => {
  const params = {
    MessageBody: JSON.stringify(record),
    QueueUrl: process.env.SQSQUEUE_URL
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    
    return data;
  } catch (error) {
    console.log('fail', error);
  };
};
