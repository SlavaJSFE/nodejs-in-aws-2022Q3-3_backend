import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "./getProductList";

describe('getProductList lambda', () => {
  const mockEvent = {} as unknown as APIGatewayProxyEvent;

  it('should return a list of products', async () => {
    const result = await handler(mockEvent);
    
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body).length).toEqual(10);
  });
});
