import { Company, Event, Location, Order, OrderItem, Product, Settings, Sku, User } from "@prisma/client";
import { FullLocation } from "../../app/server-store";
import { calculatePriceFromCatalog } from "../prisma/dbUtils";

export type ItemSkuProduct = OrderItem & {
  sku: Sku & {
    product: Product;
  };
  location: {
    displayName: string | null;
    city: string | null;
  };
};

export type FullOrderLocationSku = Order & {
  items: ItemLocationSku[];
};

export type ItemLocationSku = OrderItem & {
  location: Location;
  sku: Sku;
};

export type OrderItemSku = OrderItem & {
  sku: Sku & {
    product: Product;
  };
};

export type OrderLocation = Order & {
  location: Location;
};

export type ItemLocationSkuProduct = OrderItem & {
  location: Location;
  sku: Sku & {
    product: Product;
  };
};

export type SkuProduct = Sku & {
  product: Product;
};

export type UserCompany = User & {
  company: Company;
};

export function getUniqueLocations(locations: FullLocation[]) {
  const uniqueLocations: FullLocation[] = [];
  locations.forEach((location: FullLocation) => {
    if (!uniqueLocations.some((l) => l.id === location.id)) {
      uniqueLocations.push(location);
    }
  });
  return uniqueLocations;
}

export function getConsumerIds(byLocation: boolean, location: FullLocation, locations: FullLocation[]): string[] {
  const consumerIds: string[] = [];

  if (byLocation) {
    location.events.forEach((event: Event) => {
      if (event.consumerId && !consumerIds.includes(event.consumerId)) {
        consumerIds.push(event.consumerId);
      }
    });
  } else {
    // Get consumer IDs across all locations
    locations.forEach((location: FullLocation) => {
      location.events.forEach((event: Event) => {
        if (event.consumerId && !consumerIds.includes(event.consumerId)) {
          consumerIds.push(event.consumerId);
        }
      });
    });
  }

  return consumerIds;
}

export type OrderItemLocationName = Order & {
  items: OrderItem & {
    location: {
      city: string | null;
      displayName: string | null;
    };
    sku: Sku & {
      product: Product;
    };
  }[];
};

export function getUniqueSkus(orders: ItemSkuProduct[]): SkuProduct[] {
  const ids: string[] = [];
  return orders.reduce((prev, curr) => {
    if (ids.includes(curr.skuId)) {
      return prev;
    } else {
      ids.push(curr.skuId);
      return [...prev, curr.sku];
    }
  }, [] as SkuProduct[]);
}


export function numItemsBySkuId(orders: ItemSkuProduct[], id: string): number {
  return orders.reduce((prev, curr) => {
    if (curr.skuId == id) {
      return prev + curr.quantity;
    } else {
      return prev;
    }
  }, 0);
}

export function addDays(date: Date, numDays: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + numDays);
  return d;
}

export function skuName(sku: SkuProduct | undefined): string {
  return sku ? sku.size + " " + sku.materialShort + " " + sku.product.name : "";
}

export function totalFromOrders(orderItems: ItemLocationSkuProduct[], onlyOrders?: OrderItem[], skus?: Sku[], products?: Product[]): number {
  if (onlyOrders) {
    return onlyOrders.reduce((prev, item) => prev + calculatePriceFromCatalog(skus ?? [], item.skuId, item.quantity), 0);
  }
  return orderItems.reduce((prev, item) => prev + calculatePriceFromCatalog(item.sku, item.skuId, item.quantity), 0);
}

export function dayMonthYear(d: Date): string {
  const date = new Date(d);
  const day = date.toLocaleString("en-us", {
    day: "numeric"
  });
  const month = date.toLocaleString("en-us", {
    month: "long"
  });
  const year = date.toLocaleString("en-us", {
    year: "numeric"
  });
  return day + " " + month + " " + year;
}
export function monthDayYear(d: Date): string {
  const date = new Date(d);
  const day = date.toLocaleString("en-us", {
    day: "2-digit"
  });
  const month = date.toLocaleString("en-us", {
    month: "2-digit"
  });
  const year = date.toLocaleString("en-us", {
    year: "numeric"
  });
  return month + "/" + day + "/" + year;
}

export function fullProductName(order: ItemSkuProduct): string {
  return order.sku.size + " " + order.sku.materialShort + " " + order.sku.product.name;
}