export type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
};


export type CartItem = {
  product: Product,
  count: number,
};

export type Cart = {
  id: string,
  items: CartItem[],
};

export type NewCart = {
  userId: string,
  createdAt: string,
  updatedAt: string,
};

export type ItemRow = {
  cart_id: string,
  product_id: string,
  title: string,
  description: string,
  price: number,
  count: number,
};
