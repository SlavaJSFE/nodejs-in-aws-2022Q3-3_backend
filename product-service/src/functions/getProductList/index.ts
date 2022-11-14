import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/getProductList.handler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
      },
    },
  ],
};
