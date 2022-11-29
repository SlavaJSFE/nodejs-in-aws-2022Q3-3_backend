import { Injectable } from '@nestjs/common';
import { createQueryCreateNewCart, createQueryFindCartByUserId, createQueryFindProductInCart, createQueryInsertProductInCart, createQueryUpdateCartTable, createQueryUpdateProductInCart, getPGClient } from 'src/database/database-service';

import { Cart, CartItem, ItemRow } from '../models';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string) {
    const pgClient = getPGClient();
    await pgClient.connect();

    try {
      const { rows } = await pgClient.query(createQueryFindCartByUserId(userId));
      const mappedItems = rows.map((row: ItemRow) => ({
        product: {
          id: row.product_id,
          title: row.title,
          description: row.description,
          price: row.price,
        },
        count: row.count,
      }));

      if (!rows.length) {
        return null;
      }
      
      return {
        id: rows[0].cart_id,
        items: mappedItems,
      };
    } catch (error) {
      console.log('error in findByUserId:', error);
    } finally {
      pgClient.end();
    }
    return this.userCarts[ userId ];
  }

  async createByUserId(userId: string): Promise<Cart> {
    const userCart = {
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  
    const pgClient = getPGClient();
    await pgClient.connect();
    
    try {
      const { rows } = await pgClient.query(createQueryCreateNewCart(userCart));
      
      return {
        id: rows[0].id,
        items: []
      }
    } catch (error) {
      console.log('error in createByUserId:', error);
    } finally {
      pgClient.end();
    }
  }

  async findOrCreateByUserId(userId: string) {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, item: CartItem): Promise<Cart> {
  // async updateByUserId(userId: string, item: CartItem) {
    const productId = item.product.id;
    const count = item.count;

    const { id, items } = await this.findOrCreateByUserId(userId);

    const pgClient = getPGClient();
    await pgClient.connect();

    try {
      const { rows: productInCart } = await pgClient.query(createQueryFindProductInCart(productId));
      productInCart.length && productInCart[0].product_id ?
        await pgClient.query(createQueryUpdateProductInCart(productId, count)) :
        await pgClient.query(createQueryInsertProductInCart(id, productId, count));
      await pgClient.query(createQueryUpdateCartTable(id, new Date().toISOString())); 
      const cart = await this.findOrCreateByUserId(userId);

      return cart;
    } catch (error) {
      console.log('error in updateByUserId');
    }
  }

  removeByUserId(userId): void {
    this.userCarts[ userId ] = null;
  }

}
