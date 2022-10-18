import { APIGatewayProxyEvent } from "aws-lambda";
import { getProductList } from "../../database/DynamoDB/service";
import { HttpCode } from "src/utils/http.utils";
import { formatJSONResponse } from "../../libs/api-gateway";

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log(event);

  try {
    const productList = await getProductList();
    
    return formatJSONResponse(productList);
  } catch (error) {
    formatJSONResponse(error.message, error.statusCode || HttpCode.SERVER_ERROR)
  }
};
