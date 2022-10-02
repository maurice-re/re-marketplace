import { Company, Location, Order, OrderItem, Product, Sku, User } from "@prisma/client";
import { calculatePriceFromCatalog } from "../prisma/dbUtils";

export type UserOrderItems = User & {
  company: {
    name: string;
    customerId: string;
  };
  orders: (Order & {
    items: (OrderItem & {
      sku: SkuProduct;
      location: {
        displayName: string | null;
        city: string;
      };
    })[];
  })[];
};

export type ItemSkuProduct = OrderItem & {
  sku: Sku & {
    product: Product;
  };
  location: {
    displayName: string | null;
    city: string | null;
};
};

export type SkuProduct = Sku & {
    product: Product;
  };

export type OrderCustomerOrderItems = Order & {
  company: {
    name?: string;
    customerId: string;
  };
  orderItems: (OrderItem & {
    location: Location;
    sku: Sku & {
      product: Product;
    };
  })[];
};

export type OrderWithItemsLocationSku = Order & {
  items: ItemLocationSku[];
};

export type ItemLocationSku = OrderItem & {
  location: Location;
  sku: Sku;
}

export type OrderItemLocation = OrderItem & {
  location: Location;
  sku: Sku & {
      product: Product;
  };
};

export type ItemLocationSkuProduct = OrderItem & {
  location: Location;
  sku: Sku & {
    product: Product;
  };
}

export type OrderWithItems = Order & {
  items: OrderItem[]
}

export type UserCompany = User & {
  company: Company
}


export function getUniqueSkus(orders: ItemSkuProduct[]): SkuProduct[] {
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


export function numItemsBySkuId(orders: ItemSkuProduct[], id: string): number {
    return orders.reduce((prev, curr) => {
        if(curr.skuId == id) {
            return prev + curr.quantity
        } else {
            return prev;
        }
    }, 0)
}

export function getLocationNames(orders: ItemSkuProduct[]): string[] {
    let ids: string[] = [];
    return orders.reduce((prev, curr) => {
        if (ids.includes(curr.locationId)) {
        return prev;
        } else {
        ids.push(curr.locationId);
        return [...prev, curr.location.displayName ?? curr.location.city!];
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

function getLocationIds(orders: OrderItem[]): string[]{
    console.log(orders)
    return orders.reduce((prev, curr) => {
        if(prev.includes(curr.locationId)) {
            return prev
        } else {
            return [...prev, curr.locationId]
        }
    }, [] as string[])
} 

export function separateByLocationId(orders: OrderItem[]):OrderItem[][]  {
    const locationIds = getLocationIds(orders);
    console.log(locationIds)
    let output: OrderItem[][] = [];
    locationIds.forEach(loc => {   
        const or = orders.filter(o => o.locationId == loc);
        output.push(or)
    })
    console.log(output);
    return output
    }


export function totalFromOrders(orderItems: ItemLocationSkuProduct[], onlyOrders?: OrderItem[], skus?: Sku[], products? :Product[]): number {
  if (onlyOrders) {
    return onlyOrders.reduce((prev, item) => prev + calculatePriceFromCatalog(skus ?? [], item.skuId, item.quantity), 0);
  }
  return orderItems.reduce((prev, item) => prev + calculatePriceFromCatalog(item.sku, item.skuId, item.quantity), 0);
}

export function getLocationsFromOrders(orderItems: ItemLocationSkuProduct[]): Location[] {
  return orderItems.reduce((prev, curr) => {
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

export function fullProductName(order: ItemSkuProduct): string {
  return order.sku.size + " " + order.sku.materialShort + " " + order.sku.product.name
}