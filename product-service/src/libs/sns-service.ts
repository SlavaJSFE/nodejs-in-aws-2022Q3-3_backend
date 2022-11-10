import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: process.env.REGION });

export const publishToSNSTopic = async (message: string) => {
  const params = {
    Message: message,
    TopicArn: process.env.SNS_TOPIC_ARN,
  };
  
  try {
    const data = await snsClient.send(new PublishCommand(params));
    console.log('Success.',  data);
    return data;
  } catch (err) {
    console.log('Error', err.stack);
  }
};
