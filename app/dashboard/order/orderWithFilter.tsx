"use client";
import { Company } from "@prisma/client";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import DropdownField from "../../../components/form/dropdown-field";
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

    //   // Update events and settings on changes
    //   useEffect(() => {
    //     /* Update events. */
    //     let newEvents: Event[] = [];
    //     if (filter == "Location") {
    //       newEvents = location.events;
    //     }
    //     if (filter == "Group") {
    //       group.locations.forEach((location: FullLocation) => {
    //         location.events.forEach((event: Event) => {
    //           newEvents.push(event);
    //         });
    //       });
    //     }
    //     if (filter == "Sku") {
    //       locations.forEach((location: FullLocation) => {
    //         location.events.forEach((event: Event) => {
    //           if (event.skuId == sku.id) {
    //             newEvents.push(event);
    //           }
    //         });
    //       });
    //     }
    //     if (filter == "Location / Sku") {
    //       location.events.forEach((event: Event) => {
    //         if (event.skuId == sku.id) {
    //           newEvents.push(event);
    //         }
    //       });
    //     }
    //     if (filter == "All Locations") {
    //       location.events.forEach((event: Event) => {
    //         newEvents.push(event);
    //       });
    //     }
    //     if (filter == "Location / Order") {
    //       // TODO(Suhana): Ensure that Event model's itemId is the same as the orderItem ID
    //       // All events associated with the items in the selected order (container-specific)
    //       order.items.forEach((orderItem: OrderItem) => {
    //         location.events.forEach((event: Event) => { // Check selected location
    //           if (event.itemId === orderItem.id) {
    //             newEvents.push(event);
    //           }
    //         });
    //       });
    //     }
    //     if (filter == "Order") {
    //       // All events associated with the items in the order (container-specific)
    //       order.items.forEach((orderItem: OrderItem) => {
    //         locations.forEach((location: FullLocation) => { // Check all locations
    //           location.events.forEach((event: Event) => {
    //             if (event.itemId === orderItem.id) {
    //               newEvents.push(event);
    //             }
    //           });
    //         });
    //       });
    //     }
    //     if (filter == "Location / Order / Order Item") {
    //       location.events.forEach((event: Event) => { // Check selected location
    //         if (event.itemId === orderItem.id) {
    //           newEvents.push(event);
    //         }
    //       });
    //     }
    //     if (filter == "Order / Order Item") {
    //       locations.forEach((location: FullLocation) => { // Check all locations
    //         location.events.forEach((event: Event) => {
    //           if (event.itemId === orderItem.id) {
    //             newEvents.push(event);
    //           }
    //         });
    //       });
    //     }
    //     if (filter == "Consumer") {
    //       locations.forEach((location: FullLocation) => {
    //         location.events.forEach((event: Event) => {
    //           if (event.consumerId == consumerId) {
    //             newEvents.push(event);
    //           }
    //         });
    //       });
    //     }
    //     if (filter == "Location / Consumer") {
    //       location.events.forEach((event: Event) => {
    //         if (event.consumerId == consumerId) {
    //           newEvents.push(event);
    //         }
    //       });
    //     }
    //     setEvents(newEvents);
    //   }, [filter, group, location, sku, order, orderItem, consumerId, locations]);

    const handleFilterTypeChange = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        const { value } = e.target;
        setFilter(value);
    };

    //   const handleGroupChange = (
    //     e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    //   ) => {
    //     const selectedGroup = groups.find(
    //       (group) => (group.name === e.target.value || group.id === e.target.value)
    //     );
    //     if (selectedGroup) {
    //       setGroup(selectedGroup);
    //     }
    //   };

    //   const handleConsumerChange = (
    //     e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    //   ) => {
    //     const { value } = e.target;
    //     setConsumerId(value);
    //   };

    //   const handleLocationChange = (
    //     e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    //   ) => {
    //     const selectedLocation = locations.find(
    //       (location) => (location.displayName === e.target.value || location.id === e.target.value)
    //     );
    //     if (selectedLocation) {
    //       setLocation(selectedLocation);
    //     }
    //   };

    //   const handleOrderChange = (
    //     e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    //   ) => {
    //     const selectedOrder = orders.find(
    //       (order) => (order.id === e.target.value)
    //     );
    //     if (selectedOrder) {
    //       setOrder(selectedOrder);
    //     }
    //   };

    //   const handleOrderItemChange = (
    //     e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    //   ) => {
    //     const selectedOrderItem = order.items.find(
    //       (orderItem) => (orderItem.id === e.target.value)
    //     );
    //     if (selectedOrderItem) {
    //       setOrderItem(selectedOrderItem);
    //     }
    //   };

    //   function handleSkuChange(selectedSku: FullSku) {
    //     setSku(selectedSku);
    //   }

    return (
        <div>
            <div className="flex w-full items-start justify-center border-b-[0.5px] border-white pb-6 mb-10 gap-3">
                <div className="flex flex-col w-1/2">
                    <h1>Filter</h1>
                    <DropdownField top bottom options={filters} placeholder={"Filter"} value={filter} name={"filter"} onChange={handleFilterTypeChange} />
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
