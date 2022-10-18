import { formatJSONResponse } from "@libs/api-gateway";
import { APIGatewayProxyEvent } from "aws-lambda";
import { createProduct } from "src/database/DynamoDB/service";
import { validateNewProductData } from "src/utils/dataValidation.utils";
import { HttpCode } from "src/utils/http.utils";

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log(event);

  const body = JSON.parse(event.body);
  const isDataValid = validateNewProductData(body);

  if (!isDataValid) {
    return formatJSONResponse({
      message: `Received data is invalid`,
    }, HttpCode.BAD_REQUEST);
  }

  try {
    const { productResponse, stockResponse } = await createProduct(body);

    return formatJSONResponse({ ...productResponse, ...stockResponse }, HttpCode.CREATED)
  } catch (error) {
    return formatJSONResponse(error.message, error.statusCode || HttpCode.SERVER_ERROR);
  } 
};
