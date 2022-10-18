export const validateNewProductData = (body: any): Boolean => {
  const { title, description, price, count } = body;

  if (title && description && price && count.toString().length) {
    const countInteger = parseFloat(count);
    return price > 0 && !Number.isNaN(countInteger) && Number.isInteger(countInteger) && countInteger >= 0
  }

  return false;
};
