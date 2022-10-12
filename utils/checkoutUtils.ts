import { Product, ProductDevelopment, Sku } from "@prisma/client";
import { getOrderStringTotal } from "./dashboard/orderStringUtils";

export enum CheckoutType {
    ERROR,
    ORDER,
    PRODUCT_DEVELOPMENT,
    SAMPLE,
  }

export function getCheckoutTotal(orderString: string, productDevelopment: ProductDevelopment | null, products : Product[] | null, skus: Sku[] | null, type: CheckoutType): number {
    if (type == CheckoutType.PRODUCT_DEVELOPMENT && productDevelopment) {
      return (
        (productDevelopment.developmentFee + productDevelopment.researchFee) *
        productDevelopment.split
      );
    }

    if (type == CheckoutType.ORDER && products && skus) {
      return getOrderStringTotal(orderString, products, skus, 1.07);
    }
    return 0;
  }