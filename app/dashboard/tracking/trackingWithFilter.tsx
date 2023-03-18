"use client";
import { Event, OrderItem, Settings } from "@prisma/client";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import DropdownField from "../../../components/form/dropdown-field";
import { skuName } from "../../../utils/dashboard/dashboardUtils";
import { FullGroup, FullLocation, FullOrder, FullSku } from "../../server-store";
import Tracking from "./tracking";

function TrackingWithFilter({
  locations,
  groups,
  skus,
  orders,
  demo
}: {
  locations: FullLocation[];
  groups: FullGroup[];
  skus: FullSku[];
  orders: FullOrder[];
  demo: boolean;
}) {
  const filters: string[] = ["Location", "All Locations", "Group", "Sku", "Location / Sku", "Order", "Location / Order", "Location / Order / Order Item", "Order / Order Item"];
  const [filter, setFilter] = useState<string>("All Locations");
  const [group, setGroup] = useState<FullGroup>(groups[0]);
  const [location, setLocation] = useState<FullLocation>(locations[0]);
  const [sku, setSku] = useState<FullSku>(skus[0]);
  const [order, setOrder] = useState<FullOrder>(orders[0]);
  const [orderItem, setOrderItem] = useState<OrderItem>(orders[0].items[0]);

  const getSettingsByFilter = () => {
    if (filter == "Location" || filter == "Location / Sku" || filter == "Location / Order" || filter == "Location / Order / Order Item") {
      return location.settings;
    }
    if (filter == "All Locations") {
      // If All Locations is selected, use the settings associated with the first location
      return location.settings;
    }
    if (filter == "Group") {
      // If Group is selected, use the settings associated with the first location in the group
      return group.locations[0].settings;
    }
    if (filter == "Sku") {
      // If Sku is selected, no custom settings are applicable
      return null;
    }
    if (filter == "Order" || filter == "Order / Order Item") {
      // If Order or Order / Order Item is selected, use the settings associated with the location the order is for
      return order.location.settings;
    }
    return null; // Default - should not get here
  };

  const getEventsByFilter = () => {
    const events: Event[] = [];
    if (filter == "Location") {
      return location.events;
    }
    if (filter == "Group") {
      group.locations.forEach((location: FullLocation) => {
        location.events.forEach((event: Event) => {
          events.push(event);
        });
      });
      return events;
    }
    if (filter == "Sku") {
      locations.forEach((location: FullLocation) => {
        location.events.forEach((event: Event) => {
          if (event.skuId == sku.id) {
            events.push(event);
          }
        });
      });
      return events;
    }
    if (filter == "Location / Sku") {
      location.events.forEach((event: Event) => {
        if (event.skuId == sku.id) {
          events.push(event);
        }
      });
      return events;
    }
    if (filter == "All Locations") {
      location.events.forEach((event: Event) => {
        events.push(event);
      });
      return events;
    }
    if (filter == "Location / Order") {
      // TODO(Suhana): Ensure that Event model's itemId is the same as the orderItem ID

      // All events associated with the items in the selected order (container-specific)
      order.items.forEach((orderItem: OrderItem) => {
        location.events.forEach((event: Event) => { // Check selected location
          if (event.itemId === orderItem.id) {
            events.push(event);
          }
        });
      });
      return events;
    }
    if (filter == "Order") {
      // All events associated with the items in the order (container-specific)
      order.items.forEach((orderItem: OrderItem) => {
        locations.forEach((location: FullLocation) => { // Check all locations
          location.events.forEach((event: Event) => {
            if (event.itemId === orderItem.id) {
              events.push(event);
            }
          });
        });
      });
      return events;
    }
    if (filter == "Location / Order / Order Item") {
      location.events.forEach((event: Event) => { // Check selected location
        if (event.itemId === orderItem.id) {
          events.push(event);
        }
      });
      return events;
    }
    if (filter == "Order / Order Item") {
      locations.forEach((location: FullLocation) => { // Check all locations
        location.events.forEach((event: Event) => {
          if (event.itemId === orderItem.id) {
            events.push(event);
          }
        });
      });
      return events;
    }
    return locations[0].events; // Default - should not get here
  };

  const handleFilterTypeChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setFilter(value);
  };

  const handleGroupChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedGroup = groups.find(
      (group) => (group.name === e.target.value || group.id === e.target.value)
    );
    if (selectedGroup) {
      setGroup(selectedGroup);
    }
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

  const handleOrderChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOrder = orders.find(
      (order) => (order.id === e.target.value)
    );
    if (selectedOrder) {
      setOrder(selectedOrder);
    }
  };

  const handleOrderItemChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOrderItem = order.items.find(
      (orderItem) => (orderItem.id === e.target.value)
    );
    if (selectedOrderItem) {
      setOrderItem(selectedOrderItem);
    }
  };

  function handleSkuChange(selectedSku: FullSku) {
    setSku(selectedSku);
  }

  return (
    <div>
      <div className="flex w-full items-start justify-center border-b-[0.5px] border-white pb-6 mb-6 gap-3">
        <div className="flex flex-col w-1/2">
          <h1>Filter</h1>
          <DropdownField top bottom options={filters} placeholder={"Filter"} value={filter} name={"filter"} onChange={handleFilterTypeChange} />
        </div>
        {filter === "Group" && (
          <div className="flex flex-col w-1/2">
            <h1>Group</h1>
            <div className="p-0 my-0">
              <select
                name="group"
                className="px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 mb-2 rounded-b"
                onChange={handleGroupChange}
                required
                placeholder="Location"
                value={group.name}
              >
                {groups.map((val) => (
                  <option key={val.name} value={val.name ?? val.id}>
                    {val.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {((filter === "Location" || filter === "Location / Sku" || filter === "Location / Order") || (filter === "Location / Order / Order Item")) && (
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
        {/* If they select Order or Order / Order Item, we show them all orders. */}
        {((filter === "Order") || (filter == "Order / Order Item")) &&
          (<div className="flex flex-col w-1/2">
            <h1>Order</h1>
            {(orders.length > 0) ? (<div className="p-0 my-0">
              <select
                name="order"
                className="px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 mb-2 rounded-b"
                onChange={handleOrderChange}
                required
                placeholder="Order"
                value={order.id}
              >
                {orders.map((val) => (
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
        {/* If they select Location / Order or Location / Order / Order Item, we show them all orders associated with the selected location. */}
        {((filter === "Location / Order") || (filter === "Location / Order / Order Item")) &&
          (<div className="flex flex-col w-1/2">
            <h1>Order</h1>
            {(orders.filter(order => order.locationId == location.id).length > 0) ? (<div className="p-0 my-0">
              <select
                name="order"
                className="px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 mb-2 rounded-b"
                onChange={handleOrderChange}
                required
                placeholder="Order"
                value={order.id}
              >
                {orders.filter(order => order.locationId == location.id).map((val) => (
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
        {/* If they select Order Item, we show them all order items associated with the selected order. */}
        {((filter === "Location / Order / Order Item") || (filter == "Order / Order Item")) &&
          (<div className="flex flex-col w-1/2">
            <h1>Order Item</h1>
            {(order.items.length > 0) ? (<div className="p-0 my-0">
              <select
                name="orderItem"
                className="px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 mb-2 rounded-b"
                onChange={handleOrderItemChange}
                required
                placeholder="Order / Order Item"
                value={orderItem.id}
              >
                {order.items.map((val) => (
                  <option key={val.id} value={val.id}>
                    {val.id}
                  </option>
                ))
                }
              </select>
            </div>) : (<div
              className="px-1 py-1 border-x-2 border-y text-lg w-full bg-red-900 border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 mb-2 rounded-b"
            >
              No Order Items
            </div>)}
          </div>)
        }
        {/* If they select Sku or Location Sku, we show them all available skus. */}
        {(filter === "Sku" || filter === "Location / Sku") && (
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
        demo={demo}
        initialSettings={getSettingsByFilter()}
        events={getEventsByFilter()}
      />
    </div>
  );
}

export default TrackingWithFilter;
