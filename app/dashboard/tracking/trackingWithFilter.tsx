"use client";
import { Action, Event, Order, Settings, Sku } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";
import { FullGroup, FullLocation, OrderWithItems, SkuWithProduct } from "../../server-store";
import Tracking from "./tracking";

function TrackingWithFilter({
  locations,
  groups,
  skus,
  orders,
}: {
  locations: FullLocation[];
  groups: FullGroup[];
  skus: SkuWithProduct[];
  orders: OrderWithItems[];
}) {
  const filterTypes: string[] = ["Location", "All Locations", "Group", "Sku", "Order"];
  const [filterType, setFilterType] = useState<string>(filterTypes[0]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setFilterType(value);
  };

  return (
    <div>
      <div className="flex w-full items-center justify-center border-b-[0.5px] border-white pb-6 mb-6">
        <div className="p-0 my-0 w-1/2">
          <h1>Select Filter Type</h1>
          <select
            name="filterType"
            className="mt-2 px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 rounded-t border-b-2 rounded-b"
            onChange={handleChange}
            required
            placeholder="Filter Type"
            value={filterType}
          >
            {filterTypes.map((currentFilterType) => (
              <option key={currentFilterType} value={currentFilterType}>
                {currentFilterType}
              </option>
            ))}
          </select>
        </div>

      </div>
      <Tracking
        demo={false}
        // TODO(Suhana): These fields should be fetched based on the filter
        initialSettings={locations[0].settings}
        events={locations[0].events}
      />
    </div>
  );
}

export default TrackingWithFilter;
