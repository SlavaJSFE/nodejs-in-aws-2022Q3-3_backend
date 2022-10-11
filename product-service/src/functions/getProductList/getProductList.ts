import { APIGatewayProxyEvent } from "aws-lambda";
import { formatJSONResponse } from "../../libs/api-gateway";
import { getProductList } from "../../utils/service.utils";

export const handler = async (event: APIGatewayProxyEvent | any) => {
  console.log(event);

  const products = await getProductList();

  return formatJSONResponse(products);
};
