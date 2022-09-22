import { Location, Order, Product, Sku, SampleTransaction } from "@prisma/client";

export type SampleTransactionOrders = SampleTransaction & {
  // company: {
  //   name?: string;
  //   customerId: string;
  // };
  // location: Location;
  skuIds: string;
};