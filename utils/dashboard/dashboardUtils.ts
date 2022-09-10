import { Location, Order, Product, Sku, Transaction } from "@prisma/client";
import { calculatePriceFromCatalog } from "../prisma/dbUtils";

export type OrderSkuProduct = Order & {
  sku: Sku & {
    product: Product;
  };
  location: {
    displayName: string | null;
    city: string;
};
};

export type SkuProduct = Sku & {
    product: Product;
  };

export type TransactionCustomerOrders = Transaction & {
  company: {
    name?: string;
    customerId: string;
  };
  orders: (Order & {
    location: Location;
    sku: Sku & {
      product: Product;
    };
  })[];
};

export type OrderCustomerLocation = Order & {
  company: {
      name?: string;
      customerId: string;
  };
  location: Location;
  sku: Sku & {
      product: Product;
  };
};

export type OrderLocationSku = Order & {
  location: Location;
  sku: Sku & {
    product: Product;
  };
}


export function getUniqueSkus(orders: OrderSkuProduct[]): SkuProduct[] {
  let ids: string[] = [];
  return orders.reduce((prev, curr) => {
    if (ids.includes(curr.skuId)) {
      return prev;
    } else {
      ids.push(curr.skuId);
      return [...prev, curr.sku];
    }
  }, [] as SkuProduct[]);
}


export function numItemsBySkuId(orders: OrderSkuProduct[], id: string): number {
    return orders.reduce((prev, curr) => {
        if(curr.skuId == id) {
            return prev + curr.quantity
        } else {
            return prev;
        }
    }, 0)
}

export function getLocationNames(orders: OrderSkuProduct[]): string[] {
    let ids: string[] = [];
    return orders.reduce((prev, curr) => {
        if (ids.includes(curr.locationId)) {
        return prev;
        } else {
        ids.push(curr.locationId);
        return [...prev, curr.location.displayName ?? curr.location.city];
        }
    }, [] as string[]);
}

export function addDays(date: Date, numDays: number) {
    let d = new Date(date);
    d.setDate(d.getDate() + numDays)
    return d;
}

export function skuName(sku: SkuProduct): string {
    return sku.size + " " + sku.materialShort + " " + sku.product.name
}

function getLocationIds(orders: OrderSkuProduct[]): string[]{
    console.log(orders)
    return orders.reduce((prev, curr) => {
        if(prev.includes(curr.locationId)) {
            return prev
        } else {
            return [...prev, curr.locationId]
        }
    }, [] as string[])
} 

export function separateByLocationId(orders: OrderSkuProduct[]):OrderSkuProduct[][]  {
    const locationIds = getLocationIds(orders);
    console.log(locationIds)
    let output: OrderSkuProduct[][] = [];
    locationIds.forEach(loc => {   
        const or = orders.filter(o => o.locationId == loc);
        output.push(or)
    })
    console.log(output);
    return output
    }


export function totalFromOrders(orders: OrderLocationSku[]): number {
  return orders.reduce((prev, order) => prev + calculatePriceFromCatalog(order.sku, order.sku.product, order.skuId, order.quantity), 0);
}

export function getLocationsFromOrders(orders: OrderLocationSku[]): Location[] {
  return orders.reduce((prev, curr) => {
    if(prev.find(l => l.id == curr.locationId)){
      return prev;
    } else {
      return [...prev, curr.location ]
    }
  }, [] as Location[])
}

export function dayMonthYear(d: Date) : string {
  const date = new Date(d);
  const day = date.toLocaleString("en-us", {
    day: "numeric"
  })
  const month = date.toLocaleString("en-us", {
    month: "long"
  })
  const year = date.toLocaleString("en-us", {
    year: "numeric"
  })
  return day + " " + month + " " + year;
}
export function monthDayYear(d: Date) : string {
  const date = new Date(d);
  const day = date.toLocaleString("en-us", {
    day: "2-digit"
  })
  const month = date.toLocaleString("en-us", {
    month: "2-digit"
  })
  const year = date.toLocaleString("en-us", {
    year: "numeric"
  })
  return month + "/" + day + "/" + year;
}

export function fullProductName(order: OrderSkuProduct): string {
  return order.sku.size + " " + order.sku.materialShort + " " + order.sku.product.name
}