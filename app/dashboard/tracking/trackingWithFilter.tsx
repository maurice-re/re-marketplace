"use client";
import { Action, Event, Order, Settings, Sku } from "@prisma/client";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import DropdownField from "../../../components/form/dropdown-field";
import { skuName } from "../../../utils/dashboard/dashboardUtils";
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
  const filterTypes: string[] = ["Location", "All Locations", "Group", "Sku", "Location Sku", "Order"];
  const [filterType, setFilterType] = useState<string>("Location");
  const [location, setLocation] = useState<FullLocation>(locations[0]);
  const [sku, setSku] = useState<FullSku>(skus[0]);
  const [filter, setFilter] = useState<FullLocation | FullLocation[] | FullSku | FullOrder | FullGroup>(locations[0]);

  // TODO(Suhana): Don't really need the filter, setFilter, as long as we have filterType

  const getEventsByFilter = () => {
    if (filterType == "Location") {
      const locationFilter = filter as FullLocation;
      return locationFilter.events;
    }
    const events: Event[] = [];

    if (filterType == "Sku") {
      // From all the locations, get all events of this sku
      // TODO(Suhana): Add ability to have sku within a particular location
      const skuFilter = filter as Sku;
      locations.forEach((location: FullLocation) => {
        location.events.forEach((event: Event) => {
          if (event.skuId == skuFilter.id) {
            events.push(event);
          }
        });
      });
      return events;
    }
    if (filterType == "Location Sku") {
      location.events.forEach((event: Event) => {
        if (event.skuId == sku.id) {
          events.push(event);
        }
      });
      return events;
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

  function handleSkuChange(selectedSku: FullSku) {
    setSku(selectedSku);
    setFilter(selectedSku);
  }

  return (
    <div>
      <div className="flex w-full items-start justify-center border-b-[0.5px] border-white pb-6 mb-6 gap-3">
        <div className="flex flex-col w-1/2">
          <h1>Filter Type</h1>
          <DropdownField top bottom options={filterTypes} placeholder={"Filter Type"} value={filterType} name={"filterType"} onChange={handleFilterTypeChange} />
        </div>
        {(filterType === "Location" || filterType === "Location Sku") && (
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
        {(filterType === "Sku" || filterType === "Location Sku") && (
          <div className="flex flex-col w-1/2">
            <h1>Sku</h1>
            <div
              className="grid grid-flow-col gap-2  overflow-y-auto w-full pr-1 items-start"
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
