"use client";
import { Company } from "@prisma/client";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import DropdownField from "../../../components/form/dropdown-field";
import { skuName } from "../../../utils/dashboard/dashboardUtils";
import { FullLocation, FullOrder, FullSku } from "../../server-store";
import Order from "./order";

function OrderWithFilter({
    locations,
    skus,
    allOrders,
    company
}: {
    locations: FullLocation[];
    skus: FullSku[];
    allOrders: FullOrder[];
    company: Company;
}) {
    const filters: string[] = ["Location", "All Locations", "Group", "Sku", "Location / Sku", "Order", "Location / Order", "Location / Order / Order Item", "Order / Order Item", "Consumer", "Location / Consumer"];
    const [filter, setFilter] = useState<string>("All Locations");
    const [orders, setOrders] = useState<FullOrder[]>(allOrders);
    const [location, setLocation] = useState<FullLocation>(locations[0]);
    const [sku, setSku] = useState<FullSku>(skus[0]);

    // Update events and settings on changes
    useEffect(() => {
        // /* Update orders. */
        // let newOrders: FullOrder[] = [];
        // if (filter == "Location") {
        //     // TODO(Suhana): Push all order items whose location matches the selected location
        // }
        // if (filter == "Sku") {
        //     // TODO(Suhana): Push all order items that match the selected sku
        // }
        // setOrders(newOrders);
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
            <div className="flex w-full items-start justify-center pb-6 gap-3">
                <div className="flex w-full border-b-1/2 border-re-gray-300 py-4 pl-6 pr-4">
                    <div className="flex flex-col w-40 mr-4 text-xs">
                        <h1>Filter by Location</h1>
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
                    <div className="flex flex-col w-96 mr-4 text-xs">
                        <h1>Filter by Sku</h1>
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
                                            className={`rounded w-28 h-28 group-hover:border-re-green-500 group-hover:border-2 group-active:border-re-green-700 border-white ${selectedSku.id == sku.id
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
                    </div>
                    <div className="flex flex-col w-40 text-xs">
                        <h1>Date</h1>
                        {/* TODO(Suhana): Implement date-selection here. */}
                    </div>
                    <div className="flex-grow" />
                    <div className="flex flex-col w-40 text-xs">
                        Search for an order by Product/SKU/Location
                    </div>
                </div>
            </div>
            <Order
                orders={orders}// TODO(Suhana): Pass orders in dynamically 
                locations={locations}
                skus={skus}
                company={company}
            />
        </div>
    );
}

export default OrderWithFilter;
