import { SampleOrder } from "@prisma/client";

export type SampleOrderWithSkuID = SampleOrder & {
  skuIds: string;
};