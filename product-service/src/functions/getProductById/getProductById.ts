import { APIGatewayProxyEvent } from "aws-lambda";
import { formatJSONResponse } from "../../libs/api-gateway";
import { HttpCode } from "../../utils/http.utils";
import { getProductById } from "../../utils/service.utils";
import { uuidValidateV4 } from "../../utils/uuid.utils";

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log(event);

  const { productId } = event.pathParameters;

  if (!uuidValidateV4(productId)) {
    return formatJSONResponse({ message: `Requested product ID is not valid` }, HttpCode.BAD_REQUEST)
  }

  const product = await getProductById(productId);

  if (!product) {
    return formatJSONResponse({ message: `Product with id ${productId} was not found`}, HttpCode.NOT_FOUND)
  }

  return formatJSONResponse(product);
};
