import { Product, Sku } from "@prisma/client";

export function getPriceFromTable(_priceTable: string, _quantity: number | string): number {
  const quantity: number = typeof _quantity == "string" ? parseInt(_quantity) : _quantity
  if (_priceTable && quantity) {  
    const priceTable = _priceTable.split(", ");
      const [moq, price] = priceTable[0].split(":");
      if (quantity >= parseInt(moq)){
          return parseFloat(price)
      } else {
          return getPriceFromTable(priceTable.splice(1).join(", "), quantity)
      }
  } else {
    return 0;
  }
}

export function calculatePriceFromCatalog(skus: Sku | Sku[], products: Product | Product[], id: string, _quantity: number | string, tax?: number): number {
  console.log(skus);
  console.log(products);
  console.log(id);
  const quantity: number =  typeof _quantity == "string" ? parseInt(_quantity) : _quantity;

  const sku = Array.isArray(skus) ? skus.find((sku) => sku.id == id)! : skus;
  const product = Array.isArray(products) ? products.find((product) => product.id == sku.productId)! : products;
  const price =
    getPriceFromTable(product.priceTable, quantity) + sku.colorPrice + sku.materialPrice + sku.sizePrice;
    if (tax) {
      return parseFloat((price * quantity * tax).toFixed(2));
    }
    return parseFloat((price * quantity).toFixed(2));
}
