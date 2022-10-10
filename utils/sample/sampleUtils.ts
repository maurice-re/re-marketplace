import { SampleOrder } from "@prisma/client";

export type SampleOrderOrders = SampleOrder & {
  skuIds: string;
};