"use client";
import { Company, OrderItem, Status } from "@prisma/client";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import DropdownField from "../../../components/form/dropdown-field";
import { skuName } from "../../../utils/dashboard/dashboardUtils";
import { FullLocation, FullOrder, FullSku } from "../../server-store";
import Order from "./order";

function OrderWithFilter({
    locations,
    skus,
    allOrderItems,
    allOrders,
    company
}: {
    locations: FullLocation[];
    skus: FullSku[];
    allOrders: FullOrder[];
    allOrderItems: OrderItem[];
    company: Company;
}) {
    const filters: string[] = ["All Orders", "Location", "Sku", "Order", "Status", "Location / Sku", "Location / Status", "Location / Order"];
    const [filter, setFilter] = useState<string>("All Orders");
    const [orderItems, setOrderItems] = useState<OrderItem[]>(allOrderItems);
    const [location, setLocation] = useState<FullLocation>(locations[0]);
    const [sku, setSku] = useState<FullSku>(skus[0]);
    const [order, setOrder] = useState<FullOrder>(allOrders[0]);
    const [status, setStatus] = useState<Status>(Status.PROCESSING);

    const statuses: Status[] = Object.values(Status);

    // Update events and settings on changes
    useEffect(() => {
        /* Update orders. */
        let newOrderItems: OrderItem[] = [];
        console.log("Filter ", filter);
        if (filter == "Order" || filter == "Location / Order") {
            order.items.forEach((orderItem: OrderItem) => {
                newOrderItems.push(orderItem);
            });
        }
        if (filter == "Status") {
            console.log("Entered this case with status ", status);
            allOrderItems.forEach((orderItem: OrderItem) => {
                if (orderItem.status == status) {
                    newOrderItems.push(orderItem);
                }
            });
        }
        if (filter == "Location") {
            // Push all order items whose location matches the selected location
            location.orders.forEach((order: FullOrder) => {
                order.items.forEach((orderItem: OrderItem) => {
                    newOrderItems.push(orderItem);
                });
            });
        }
        if (filter == "Sku") {
            // Push all order items (from any order) that match the selected sku
            allOrderItems.forEach((orderItem: OrderItem) => {
                if (orderItem.skuId == sku.id) {
                    newOrderItems.push(orderItem);
                }
            });
        }
        if (filter == "Location / Sku") {
            // Push all order items (from the selected location) that match the selected sku
            location.orders.forEach((order: FullOrder) => {
                order.items.forEach((orderItem: OrderItem) => {
                    if (orderItem.skuId == sku.id) {
                        newOrderItems.push(orderItem);
                    }
                });
            });
        }
        if (filter == "Location / Status") {
            location.orders.forEach((order: FullOrder) => {
                order.items.forEach((orderItem: OrderItem) => {
                    if (orderItem.status == status) {
                        newOrderItems.push(orderItem);
                    }
                });
            });
        }
        if (filter == "All Orders") {
            newOrderItems = allOrderItems;
        }
        setOrderItems(newOrderItems);
    }, [location, sku, order, status, allOrderItems, filter]);

    const handleFilterTypeChange = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        const { value } = e.target;
        setFilter(value);
    };

    const handleLocationChange = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedLocation = locations.find(
            (location) => (location.displayName === e.target.value || location.id === e.target.value)
        );
        if (selectedLocation) {
            setLocation(selectedLocation);
        }
    };

    function handleSkuChange(selectedSku: FullSku) {
        setSku(selectedSku);
    }

    const handleOrderChange = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedOrder = allOrders.find(
            (order) => (order.id === e.target.value)
        );
        if (selectedOrder) {
            setOrder(selectedOrder);
        }
    };

    const handleStatusChange = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        statuses.forEach((status: Status) => {
            if (status.toString() == e.target.value) {
                setStatus(status);
            }
        });
    };

    return (
        <div>
            <div className="flex w-full items-start justify-center pb-6 flex-col px-6 gap-3">
                <div className="flex flex-col w-1/2 mx-auto">
                    <h1>Filter</h1>
                    <DropdownField top bottom options={filters} placeholder={"Filter"} value={filter} name={"filter"} onChange={handleFilterTypeChange} />
                </div>
                {/* TODO(Suhana): Implement search */}
                {/* <div className="flex flex-col w-1/2 text-xs">
                    Search for an order by Product/SKU/Location
                </div> */}
                <div className="w-full flex gap-3">
                    {((filter === "Location") || (filter === "Location / Sku") || (filter === "Location / Status") || (filter === "Location / Order")) && (
                        <div className="flex flex-col w-1/2 text-xs">
                            <h1>By Location</h1>
                            <div className="p-0 my-0">
                                <select
                                    name="location"
                                    className="px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 rounded-b"
                                    onChange={handleLocationChange}
                                    required
                                    placeholder="Location"
                                    value={location.displayName ?? location.id}
                                >
                                    {locations.map((val) => (
                                        <option key={val.displayName} value={val.displayName ?? val.id}>
                                            {val.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    {(filter === "Sku" || filter === "Location / Sku") && (
                        <div className="flex flex-col w-1/2 text-xs">
                            <h1>By Sku</h1>
                            <div
                                className="mt-2 grid grid-flow-col gap-1 overflow-y-auto w-full items-start"
                            >
                                {skus
                                    .filter((s) => s.product.active)
                                    .map((selectedSku) => (
                                        <div
                                            key={selectedSku.id}
                                            className="flex flex-col items-center mx-1 group"
                                        >
                                            <button
                                                className={`rounded w-28 h-28 group-hover:border-re-green-500 group-hover:border-2 group-active:border-re-green-700 ${selectedSku.id == sku.id
                                                    ? "border-re-green-600 border-3"
                                                    : "border"
                                                    }`}
                                                onClick={() => handleSkuChange(selectedSku)}
                                            >
                                                <Image
                                                    src={selectedSku.mainImage}
                                                    height={120}
                                                    width={120}
                                                    alt={skuName(selectedSku)}
                                                />
                                            </button>
                                            <h1 className="text-xs text-center mt-2 leading-tight">{skuName(selectedSku)}</h1>
                                        </div>
                                    ))}
                            </div>
                        </div>)}
                    {/* If they select Order, we show them all orders. */}
                    {(filter === "Order") &&
                        (<div className="flex flex-col w-1/2 text-xs">
                            <h1>By Order</h1>
                            {(allOrders.length > 0) ? (<div className="p-0 my-0">
                                <select
                                    name="order"
                                    className="px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 rounded-b"
                                    onChange={handleOrderChange}
                                    required
                                    placeholder="Order"
                                    value={order.id}
                                >
                                    {allOrders.map((val) => (
                                        <option key={val.id} value={val.id}>
                                            {val.id}
                                        </option>
                                    ))
                                    }
                                </select>
                            </div>) : (
                                <div
                                    className="px-1 py-1 border-x-2 border-y text-lg w-full bg-red-900 border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 mb-2 rounded-b"
                                >
                                    No Orders
                                </div>)}
                        </div>)
                    }
                    {/* If they select Location / Order, we show them all orders associated with the selected location. */}
                    {((filter === "Location / Order")) &&
                        (<div className="flex flex-col w-1/2 text-xs">
                            <h1>By Order</h1>
                            {(allOrders.filter(order => order.locationId == location.id).length > 0) ? (<div className="p-0 my-0">
                                <select
                                    name="order"
                                    className="px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 rounded-b"
                                    onChange={handleOrderChange}
                                    required
                                    placeholder="Order"
                                    value={order.id}
                                >
                                    {allOrders.filter(order => order.locationId == location.id).map((val) => (
                                        <option key={val.id} value={val.id}>
                                            {val.id}
                                        </option>
                                    ))}
                                </select>
                            </div>) : ((
                                <div
                                    className="px-1 py-1 border-x-2 border-y text-lg w-full bg-red-900 border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 mb-2 rounded-b"
                                >
                                    No Orders
                                </div>))}
                        </div>)
                    }
                    {((filter === "Status") || (filter === "Location / Status")) &&
                        (<div className="flex flex-col w-1/2 text-xs">
                            <h1>By Status</h1>
                            <div className="p-0 my-0">
                                <select
                                    name="status"
                                    className="px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 rounded-b"
                                    onChange={handleStatusChange}
                                    required
                                    placeholder="Status"
                                    value={status}
                                >
                                    {statuses.map((val) => (
                                        <option key={val} value={val}>
                                            {val}
                                        </option>
                                    ))
                                    }
                                </select>
                            </div>
                        </div>)
                    }
                    {(filter === "Date") && (
                        <div className="flex flex-col w-1/2 text-xs">
                            <h1>Date</h1>
                            {/* TODO(Suhana): Implement date-selection here. */}
                        </div>
                    )}
                </div>
            </div>
            <Order
                orderItems={orderItems}// TODO(Suhana): Pass orders in dynamically 
                locations={locations}
                skus={skus}
                company={company}
            />
        </div>
    );
}

export default OrderWithFilter;
