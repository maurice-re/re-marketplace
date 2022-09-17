import { Location, Order, Product, Sku, SampleTransaction } from "@prisma/client";

export type SampleTransactionOrders = SampleTransaction & {
  orders: (Order & {
    location: Location;
    sku: Sku & {
      product: Product;
    };
  })[];
};