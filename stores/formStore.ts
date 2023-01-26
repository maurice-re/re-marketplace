import { Product, Sku } from "@prisma/client";
import { create } from "zustand";
import { calculatePriceFromCatalog } from "../utils/prisma/dbUtils";


type FormRoute = {
    active: boolean;
    city: string;
    name: string;
  };
  
  export type CartOrder = {
    location: string;
    product: Product;
    quantity: number;
    sku: Sku;
  };

interface FormStore {
    locations: string[];
    canCheckout: boolean;
    cart: CartOrder[];
    customerId: string;
    productCatalog: Product[];
    routes: FormRoute[];
    skuCatalog: Sku[];
    activateRoute: (route: string, city: string) => void;
    addLocation: (location: string) => void;
    addSummary: () => void;
    addToCart: (skuId: string, quantity: string, city: string) => void;
    calculatePrice: (
      id: string,
      _quantity: number | string,
      tax?: number
    ) => number;
    calculateTotal: () => number;
    deactivateRoute: (route: string, city: string) => void;
    disableCheckout: () => void;
    getCity: (name: string) => string;
    initializeCatalog: (skus: Sku[], products: Product[]) => void;
    nextRoute: (index: number) => string;
    prettyString: () => string;
    removeLocation: (location: string) => void;
    setCustomerId: (id: string) => void;
    skipToCheckout: (checkout: string) => void;
  }

  export const useFormStore = create<FormStore>((set, get) => ({
    locations: [],
    canCheckout: true,
    cart: [],
    customerId: "",
    productCatalog: [],
    routes: [
        {active: true, city: "", name: "form/location"}
    ],
    skuCatalog: [],
    activateRoute: (route: string, city: string) =>
        set((state) => {

            const index = state.routes.findIndex(
                (r) => r.name.startsWith("form/" + route) && r.active == false && r.city == city
                );
            if (index > -1) {
                const newRoutes = state.routes.map((r, i) => {
                    if (i == index) {
                        r.active = true;
                    }
                    return r;
                });
                return { routes: newRoutes };
            }
            return { routes: state.routes };
        }),
    addLocation: (location: string) =>
        set((state) => {
            const newLocations = [...state.locations, location];
            const newRoutes = [...state.routes, {
                active: true,
                city: location,
                name: `form/types?id=business&city=${location}`,
              },
              { active: false, city: location, name: `form/types?id=food&city=${location}` },
              {
                active: false,
                city: location,
                name: `form/types?id=drinks&city=${location}`,
              },
              {
                active: false,
                city: location,
                name: `form/product?id=swapbox&city=${location}`,
              },
              {
                active: false,
                city: location,
                name: `form/product?id=swapcup&city=${location}`,
              },];
            return { locations: newLocations, routes: newRoutes };
        }),
    addSummary: () =>
        set((state) => {
            if (state.canCheckout) {
                const newRoutes = [...state.routes,{
                    active: true,
                    city: "",
                    name: "form/summary",
                  },
                  {
                    active: true,
                    city: "",
                    name: "form/checkout",
                  }];
                return { routes: newRoutes };
            } else {
                const newRoutes = [...state.routes,{
                    active: true,
                    city: "",
                    name: "form/quote",
                  }];
                return { routes: newRoutes };
            }
        }),
    addToCart: (skuId: string, quantity: string, city: string) =>
        set((state) => {
            const sku = state.skuCatalog.find((s) => s.id == skuId);
            const product = state.productCatalog.find(
                (p) => p.id == sku?.productId
            );
            if (!sku || !product) {
                return { cart: state.cart };
            }

            const existsInCart = state.cart.find((order) => order.sku.id == skuId && order.location == city);
            if (existsInCart) {
                const newCart = state.cart.map((order) => {
                    if (order.sku.id == skuId && order.location == city) {
                        order.quantity = Number(quantity);
                    }
                    return order;
                });
                return { cart: newCart };
            } else {
            const newCart = [...state.cart, { location: city, product, quantity: parseInt(quantity), sku }];
            return { cart: newCart };
            }
        }),
    calculatePrice: (id: string, _quantity: number | string, tax?: number) => {
        return calculatePriceFromCatalog(get().skuCatalog, id, _quantity, tax);
    },
    calculateTotal: () => {
        return get().cart.reduce((total, order) => {
            return total + get().calculatePrice(order.sku.id, order.quantity);
        }, 0);
    },
    deactivateRoute: (route: string, city: string) =>
        set((state) => {
            const index = state.routes.findIndex(
                (r) => r.name.startsWith("form/" + route) && r.active == true && r.city == city
            );
            if (index > -1) {
                const newRoutes = state.routes.map((r, i) => {
                    if (i == index) {
                        r.active = false;
                    }
                    return r;
                });
                return { routes: newRoutes };
            }
            return { routes: state.routes };
        }),
    disableCheckout: () => 
        set((state) => {
            return { canCheckout: false };
        }),
    getCity: (name: string) => {
        const index = name.indexOf("city");
        if (index > -1) {
            return name.slice(index + 5);
        }
        return "";
    },
    initializeCatalog: (skus: Sku[], products: Product[]) =>
        set((state) => {
            return { skuCatalog: skus, productCatalog: products };
        }),
    nextRoute: (index: number) => {
        const nextRoute = get().routes.find((r, i) => i > index && r.active);
        if (nextRoute) {
            return nextRoute.name;
        }
        return "";
    },
    prettyString: () => {
        return get().cart.map((order) => {
            return `${order.location}: ${order.quantity}x ${order.sku.size} ${order.product.name}`;
        }).join(", ");
    },
    removeLocation: (location: string) =>
        set((state) => {
            const newLocations = state.locations.filter((l) => l != location);
            const newRoutes = state.routes.filter((r) => r.city != location);
            return { locations: newLocations, routes: newRoutes };
        }),
    setCustomerId: (id: string) =>
        set((state) => {
            return { customerId: id };
        }),
    skipToCheckout: (checkout: string) =>
        set((state) => {
            const separated = checkout.split("*");
            const newLocations: string[] = [];
            const newCart: CartOrder[] = [];

            separated.forEach((itemOrder) => {
                const [location, quantity, size] = itemOrder.split("^");
                if (!newLocations.includes(location)) {
                  newLocations.push(location);
                }
          
                const sku = state.skuCatalog.filter(
                  (s) => s.material == "Recycled Polypropylene" && s.size == size
                )[0];
                const product = state.productCatalog.filter((p) => p.id == sku.productId)[0];
                if (sku) {
                  newCart.push({
                    location: location,
                    product: product,
                    quantity: parseInt(quantity),
                    sku: sku,
                  });
                }
              });
                return { cart: newCart, locations: newLocations };
        }),
  }));