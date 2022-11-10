import { publishToSNSTopic } from "@libs/sns-service";
import { SQSEvent } from "aws-lambda";
import { createProduct } from "src/database/DynamoDB/service";
import { validateNewProductData } from "src/utils/dataValidation.utils";

export const handler = async (event: SQSEvent) => {
  event.Records.forEach(async (record) => {
    const body = JSON.parse(record.body);
    const isDataValid = validateNewProductData(body);
    
    if (isDataValid) {
      await createProduct(body);
      await publishToSNSTopic(record.body);
    }
  });
};
