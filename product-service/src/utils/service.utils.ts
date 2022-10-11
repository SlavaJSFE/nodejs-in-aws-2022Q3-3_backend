import { products } from "../data/products"

export const getProductList = () => {
  return Promise.resolve(products);
};

export const getProductById = (id: string) => {
  const product = products.find((product) => product.id === id);

  return Promise.resolve(product);
};
