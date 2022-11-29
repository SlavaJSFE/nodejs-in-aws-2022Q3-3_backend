import { Client, ClientConfig } from 'pg';
import { NewCart } from 'src/cart';

const pgOptions: ClientConfig = {
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
};

export const getPGClient = () => new Client(pgOptions);

export const createQueryFindCartByUserId = (userId: string): string => {
  return `
    SELECT cart_id, product_id, title, description, price, count
    FROM cart_items ci
    LEFT JOIN carts c ON ci.cart_id = c.id
    LEFT JOIN products p ON ci.product_id = p.id
    WHERE c.user_id = '${userId}'
  `;
};

export const createQueryFindProductInCart = (productId: string): string => {
  return `
    SELECT product_id
    FROM cart_items ci
    WHERE ci.product_id = '${productId}'
  `;
};

export const createQueryUpdateProductInCart = (productId: string, count: number): string => {
  return `
    UPDATE cart_items
    SET count = ${count}
    WHERE product_id = '${productId}'
  `;
};

export const createQueryInsertProductInCart = (cartId: string, productId: string, count: number): string => {
  return `
    INSERT into cart_items (cart_id, product_id, count) values
    ('${cartId}', '${productId}', '${count}')
  `;
};

export const createQueryUpdateCartTable = (cartId: string, date: string): string => {
  return `
    UPDATE carts
    SET updated_at = '${date}'
    WHERE id = '${cartId}'
  `;
}

export const createQueryCreateNewCart = (userCart: NewCart): string => {
  return `
    insert into carts (user_id, created_at, updated_at) values
      ('${userCart.userId}', '${userCart.createdAt}', '${userCart.updatedAt}')
    RETURNING id;
  `;
};
