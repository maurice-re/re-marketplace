"use client";
import { Company, OrderItem } from "@prisma/client";
import { FullLocation, FullOrder, FullSku } from "../../server-store";
import TableRow from "./tableRow";
import { TbFaceIdError } from "react-icons/tb";

function Order({
    orderItems,
    locations,
    skus,
    company
}: {
    orderItems: OrderItem[];
    locations: FullLocation[];
    skus: FullSku[];
    company: Company;
}) {
    if (!orderItems || orderItems.length == 0 || !company) {
        return (
            <div className="flex gap-3 mx-auto h-full items-start justify-start px-6 pt-6 border-re-gray-300 border-t-1/2">
                <TbFaceIdError
                    className="text-re-green-500"
                    size={40} />
                <div className="text-white font-theinhardt text-28">
                    No order items found
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex w-full gap-8">
                <div className="flex bg-re-dark-green-500 h-min w-full p-6 overflow-scroll border-t-1/2 border-re-gray-300">
                    <table className="w-full h-min font-theinhardt-300">
                        <thead>
                            <tr className="bg-re-black text-re-gray-text text-lg text-left">
                                <th className="py-2 pl-2">ID</th>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Size</th>
                                <th>Material</th>
                                <th>Location</th>
                                <th>Shipping</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-left text-sm">
                            {
                                orderItems.map((item: OrderItem) => {
                                    let location: FullLocation = {} as FullLocation;
                                    locations.forEach((currLocation: FullLocation) => {
                                        currLocation.orders.forEach((order: FullOrder) => {
                                            order.items.forEach((currItem: OrderItem) => {
                                                if (currItem.id === item.id) {
                                                    location = currLocation;
                                                }
                                            });
                                        });
                                    });
                                    const sku = skus.find((sku) => sku.id == item.skuId);
                                    return (
                                        <TableRow
                                            key={item.id}
                                            item={item}
                                            location={location}
                                            orderId={item.orderId}
                                            sku={sku}
                                        />
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Order;
