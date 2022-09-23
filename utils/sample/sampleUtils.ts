import { SampleTransaction } from "@prisma/client";

export type SampleTransactionOrders = SampleTransaction & {
  skuIds: string;
};