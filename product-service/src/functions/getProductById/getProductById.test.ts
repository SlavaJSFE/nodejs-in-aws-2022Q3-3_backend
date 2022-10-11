import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "./getProductById";

describe('getProductById lambda', () => {
  it('should return a product by passed product ID', async () => {
    const mockEvent = {
      pathParameters: { productId: '27fe2c7f-b4a9-4a63-b693-ad8c36deb98b' }
    } as unknown as APIGatewayProxyEvent;

    const { body, statusCode } = await handler(mockEvent);
    
    expect(statusCode).toEqual(200);
    expect(JSON.parse(body).title).toBe('Air from Norway');
  });

  it('should return an appropriate error message in case the product was not found', async () => {
    const notExistingProductId = '8c224866-d454-4a6f-9771-9916a01bd84c';
    const mockEvent = {
      pathParameters: { productId: notExistingProductId }
    } as unknown as APIGatewayProxyEvent;

    const { body, statusCode } = await handler(mockEvent);
    
    expect(statusCode).toEqual(404);
    expect(JSON.parse(body).message).toBe(`Product with id ${notExistingProductId} was not found`);
  });

  it('should return a product by passed product ID', async () => {
    const mockEvent = {
      pathParameters: { productId: 'wrong-id-format' }
    } as unknown as APIGatewayProxyEvent;

    const { body, statusCode } = await handler(mockEvent);
    
    expect(statusCode).toEqual(400);
    expect(JSON.parse(body).message).toBe(`Requested product ID is not valid`);
  });
});
