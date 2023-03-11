"use client";
import { Action, Event, Order, Settings, Sku } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";
import DropdownField from "../../../components/form/dropdown-field";
import { FullGroup, FullLocation, FullOrder, FullSku } from "../../server-store";
import Tracking from "./tracking";

function TrackingWithFilter({
  locations,
  groups,
  skus,
  orders,
}: {
  locations: FullLocation[];
  groups: FullGroup[];
  skus: FullSku[];
  orders: FullOrder[];
}) {
  const filterTypes: string[] = ["Location", "All Locations", "Group", "Sku", "Order"];
  const [filterType, setFilterType] = useState<string>(filterTypes[0]);
  const [location, setLocation] = useState<FullLocation>(locations[0]);
  const [filter, setFilter] = useState<FullLocation | FullLocation[] | FullSku | FullOrder | FullGroup>(locations[0]);

  const getEventsByFilter = () => {
    if (filterType == "Location") {
      const location = filter as FullLocation;
      console.log("Returning events for location ", location.displayName);
      console.log(location.events);
      return location.events;
    }

    return locations[0].events; // Default
  };

  const handleFilterTypeChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setFilterType(value);
  };

  const handleLocationChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLocation = locations.find(
      (location) => location.displayName === e.target.value
    );
    if (selectedLocation) {
      setLocation(selectedLocation);
      setFilter(selectedLocation);
    }
  };
  return (
    <div>
      <div className="flex w-full items-center justify-center border-b-[0.5px] border-white pb-6 mb-6 gap-3">
        <div className="flex flex-col w-1/2">
          <h1>Filter Type</h1>
          <DropdownField top bottom options={filterTypes} placeholder={"Filter Type"} value={filterType} name={"filterType"} onChange={handleFilterTypeChange} />
        </div>
        {filterType === "Location" && (
          <div className="flex flex-col w-1/2">
            <h1>Location</h1>
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
      </div>
      <Tracking
        demo={false}
        // TODO(Suhana): These fields should be fetched based on the filter
        initialSettings={locations[0].settings}
        events={getEventsByFilter()}
      />
    </div>
  );
}

export default TrackingWithFilter;
