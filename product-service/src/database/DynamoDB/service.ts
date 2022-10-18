import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { ProductData } from 'src/models/interfaces';
import { ddbDocClient } from './utils';

export const getProductList = async () => {
  const scanProductTablePromise = ddbDocClient.send(new ScanCommand({ TableName: process.env.TABLE_NAME_PRODUCTS }));
  const scanStockTablePromise = ddbDocClient.send(new ScanCommand({ TableName: process.env.TABLE_NAME_STOCKS }));
  
  try {
    const [products, stocks] = await Promise.all([scanProductTablePromise, scanStockTablePromise]);

    const joinedProducts = products.Items.map((productItem) => {
      const stockItem = stocks.Items.find((stockItem) => stockItem.product_id === productItem.id);

      return {
        count: stockItem ? stockItem.count : 0,
        ...productItem,
      }
    });

    return joinedProducts;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (productId: String) => {
  const productTableParams = {
    TableName: process.env.TABLE_NAME_PRODUCTS,
    Key: { id: productId },
  };
  const stockTableParams = {
    TableName: process.env.TABLE_NAME_STOCKS,
    Key: { product_id: productId }
  };
  const getProductItemPromise = ddbDocClient.send(new GetCommand(productTableParams));
  const getStockItemPromise = ddbDocClient.send(new GetCommand(stockTableParams));

  try {
    const [product, stock] = await Promise.all([getProductItemPromise, getStockItemPromise]);

    if (!product.Item && !stock.Item) {
      return null;
    }

    if (product.Item && !stock.Item) {
      return {
        count: 0,
        ...product.Item
      };
    }

    return {
      count: stock.Item.count,
      ...product.Item
    }

  } catch (error) {
    throw error;
  }
};

export const createProduct = async (productData: ProductData) => {
  const { title, description, price, count } = productData;
  const id = uuidv4();
  const productTableParams = {
    TableName: process.env.TABLE_NAME_PRODUCTS,
    Item: {
      id,
      title,
      description,
      price,
    },
  };
  const stockTableParams = {
    TableName: process.env.TABLE_NAME_STOCKS,
    Item: { product_id: id, count }
  };

  try {
    const productResponse = await ddbDocClient.send(new PutCommand(productTableParams));
    const stockResponse = await ddbDocClient.send(new PutCommand(stockTableParams));
    console.log(productResponse, stockResponse);
    
    return {
      productResponse,
      stockResponse
    }
  } catch (error) {
    throw error;
  }
}
