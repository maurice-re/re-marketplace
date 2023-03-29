"use client";
import { Company, OrderItem } from "@prisma/client";
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
    company
}: {
    locations: FullLocation[];
    skus: FullSku[];
    allOrderItems: OrderItem[];
    company: Company;
}) {
    const filters: string[] = ["All Orders", "Location", "Sku", "Location / Sku"];
    const [filter, setFilter] = useState<string>("All Orders");
    console.log("Got ", allOrderItems.length);
    const [orderItems, setOrderItems] = useState<OrderItem[]>(allOrderItems);
    const [location, setLocation] = useState<FullLocation>(locations[0]);
    const [sku, setSku] = useState<FullSku>(skus[0]);

    // Update events and settings on changes
    useEffect(() => {
        /* Update orders. */
        let newOrderItems: OrderItem[] = [];
        // Allows you to filter by location 
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
        if (filter == "All Orders") {
            newOrderItems = allOrderItems;
        }
        setOrderItems(newOrderItems);
    }, [location, sku]);

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

    return (
        <div>
            <div className="flex w-full items-start justify-center pb-6 gap-3 flex-col">
                <div className="flex flex-col w-1/2 pl-6 pt-4 mx-auto">
                    <h1>Filter</h1>
                    <DropdownField top bottom options={filters} placeholder={"Filter"} value={filter} name={"filter"} onChange={handleFilterTypeChange} />
                </div>
                {/* TODO(Suhana): Implement search */}
                {/* <div className="flex flex-col w-1/2 text-xs">
                    Search for an order by Product/SKU/Location
                </div> */}
                <div className="flex w-full border-b-1/2 border-re-gray-300 pb-4 pl-6 pr-4">
                    {((filter === "Location") || (filter === "Location / Sku")) && (
                        <div className="flex flex-col w-1/2 mr-4 text-xs">
                            <h1>By Location</h1>
                            <div className="p-0 my-0">
                                <select
                                    name="location"
                                    className="px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 mb-2 rounded-b"
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
                        <div className="flex flex-col w-1/2 mr-4 text-xs">
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
                    {(filter === "Date") && (
                        <div className="flex flex-col w-1/2 text-xs">
                            <h1>Date</h1>
                            {/* TODO(Suhana): Implement date-selection here. */}
                        </div>
                    )}
                    <div className="flex-grow" />
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
