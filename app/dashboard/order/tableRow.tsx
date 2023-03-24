"use client";

import { Location, OrderItem } from "@prisma/client";
import { useRouter } from "next/navigation";
import { SkuProduct } from "../../../utils/dashboard/dashboardUtils";

type RowProps = {
  item: OrderItem;
  location: Location | undefined;
  orderId: string;
  sku: SkuProduct | undefined;
};

export default function TableRow({ item, location, orderId, sku }: RowProps) {
  const router = useRouter();
  return (
    <tr
      onClick={() => router.push(`/dashboard/order/${item.id}`)}
      className="even:bg-re-table-even odd:bg-re-table-odd hover:bg-re-table-hover hover:cursor-pointer"
    >
      <td className="py-3 pl-2">{orderId}</td>
      <td>{sku?.product.name}</td>
      <td>{item.quantity}</td>
      <td>{sku?.size}</td>
      <td>{sku?.material}</td>
      <td>{location?.displayName ?? location?.city}</td>
      <td>{item.status}</td>
      <td>{item.status}</td>
    </tr>
  );
}
