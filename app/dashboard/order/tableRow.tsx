"use client";

import { Location, OrderItem, Product, Sku } from "@prisma/client";
import { useRouter } from "next/navigation";

type RowProps = {
  item: OrderItem & {
    location: Location;
    sku: Sku & {
      product: Product;
    };
  };
  orderId: string;
};

export default function TableRow({ item, orderId }: RowProps) {
  const router = useRouter();
  return (
    <tr
      onClick={() => router.push(`/dashboard/order/${item.id}`)}
      className="even:bg-re-table-even odd:bg-re-table-odd hover:bg-re-table-hover hover:cursor-pointer"
    >
      <td className="py-3 pl-2">{orderId}</td>
      <td>{item.sku.product.name}</td>
      <td>{item.quantity}</td>
      <td>{item.sku.size}</td>
      <td>{item.sku.material}</td>
      <td>{item.location.displayName ?? item.location.city}</td>
      <td>{item.status}</td>
      <td>{item.status}</td>
    </tr>
  );
}
