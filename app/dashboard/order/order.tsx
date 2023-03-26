"use client";
import { Company, OrderItem } from "@prisma/client";
import { FullLocation, FullOrder, FullSku } from "../../server-store";
import TableRow from "./tableRow";

function Order({
    orders,
    locations,
    skus,
    company
}: {
    orders: FullOrder[];
    locations: FullLocation[];
    skus: FullSku[];
    company: Company;
}) {
    if (!orders || orders.length == 0 || !company) {
        return (
            <div className="w-screen h-screen bg-re-black flex">
                <head>
                    <title>Locations</title>
                    <meta name="locations" content="Manage locations" />
                    <link rel="icon" href="/favicon.ico" />
                </head>
                <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
                    <div className="text-white font-theinhardt text-28">
                        No Orders Placed
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="h-screen flex overflow-hidden">
            <main className="flex flex-col w-full text-white font-theinhardt bg-re-black">
                <div className="flex w-full border-b-1/2 border-re-gray-300 py-2 pl-6 pr-4">
                    <div className="bg-re-dark-green-400 p-1 border-1/2 rounded border-re-gray-300 text-xs w-32 mr-2">
                        Sort by Product
                    </div>
                    <div className="bg-re-dark-green-400 p-1 border-1/2 rounded border-re-gray-300 text-xs w-32 mr-2">
                        Date
                    </div>
                    <div className="bg-re-dark-green-400 p-1 border-1/2 rounded border-re-gray-300 text-xs w-32 mr-2">
                        Sort by Status
                    </div>
                    <div className="flex-grow" />
                    <div className="bg-re-dark-green-400 p-1 border-1/2 rounded border-re-gray-300 text-xs w-64 mr-2">
                        Search for an order by Product/SKU/Location
                    </div>
                </div>
                <div className="flex bg-re-dark-green-500 h-full w-full p-6 overflow-auto">
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
                            {orders.map((order: FullOrder) =>
                                order.items.map((item: OrderItem) => {
                                    const location = locations.find(
                                        (location) => location.id == order.locationId
                                    );
                                    const sku = skus.find((sku) => sku.id == item.skuId);
                                    return (
                                        <TableRow
                                            key={item.id}
                                            item={item}
                                            location={location}
                                            orderId={order.id}
                                            sku={sku}
                                        />
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default Order;
