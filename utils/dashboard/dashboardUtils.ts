import { Location, Order, Sku, Transaction } from "@prisma/client";

type OrderSkuProduct = Order & {
  sku: Sku & {
    product: {
      name: string;
    };
  };
  location: {
    displayName: string | null;
    city: string;
};
};

export type SkuProduct = Sku & {
    product: {
      name: string;
    };
  };

export type TransactionCustomerOrders = Transaction & {
  company: {
    customerId: string | null;
  };
  orders: (Order & {
    location: Location;
    sku: Sku & {
      product: {
        name: string;
      };
    };
  })[];
};


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
    let output: OrderSkuProduct[][] = [];
    locationIds.forEach(loc => {   
        const or = orders.filter(o => o.locationId == loc);
        output.push(or)
    })
    return output
    }


export function totalFromTransaction(transaction: TransactionCustomerOrders): number {
  const total  = transaction.orders.reduce((prev, curr) => prev + curr.quantity * curr.sku.price, 0)
  return parseFloat(total.toFixed(2));
}

export function getLocationsFromTransaction(transaction: TransactionCustomerOrders): Location[] {
  return transaction.orders.reduce((prev, curr) => {
    if(prev.find(l => l.id == curr.locationId)){
      return prev;
    } else {
      return [...prev, curr.location ]
    }
  }, [] as Location[])
}