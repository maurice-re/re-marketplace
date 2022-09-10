import { Product, Sku } from "@prisma/client";
import { createContext, ReactNode, useContext, useState } from "react";
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

type FormState = {
  activateRoute: (route: string, city: string) => void;
  addLocation: (location: string) => void;
  addSummary: () => void;
  addToCart: (skuId: string, quantity: string, city: string) => void;
  calculateTotal: () => number;
  calculatePrice: (
    id: string,
    _quantity: number | string,
    tax?: number
  ) => number;
  canCheckout: boolean;
  cart: CartOrder[];
  customerId: string;
  deactivateRoute: (route: string, city: string) => void;
  disableCheckout: () => void;
  getCity: (name: string) => string;
  initializeCatalog: (skus: Sku[], products: Product[]) => void;
  locations: string[];
  nextRoute: (index: number) => string;
  productCatalog: Product[];
  removeLocation: (location: string) => void;
  routes: FormRoute[];
  setCustomerId: (id: string) => void;
  skipToCheckout: (checkout: string) => void;
  skuCatalog: Sku[];
  shippingData: string[];
};
const FormContext = createContext<FormState>({} as FormState);

export function FormStateProvider({ children }: { children: ReactNode }) {
  const [skuCatalog, setSkuCatalog] = useState<Sku[]>([] as Sku[]);
  const [productCatalog, setProductCatalog] = useState<Product[]>(
    [] as Product[]
  );

  const [locations, setLocations] = useState<string[]>([]);
  const [routes, setRoutes] = useState<FormRoute[]>([
    { name: "location", active: true, city: "" },
  ]);
  const [cart, setCart] = useState<CartOrder[]>([]);
  const [shippingData, setShippingData] = useState<string[]>([]);
  const [customerId, setCustomerIdInt] = useState<string>("");
  const [canCheckout, setCanCheckout] = useState<boolean>(true);

  function activateRoute(route: string, city: string) {
    const index = routes.findIndex(
      (r) => r.name.startsWith(route) && r.active == false && r.city == city
    );
    if (index != -1) {
      setRoutes((curr) =>
        curr.map((r, i) => (i == index ? { ...r, active: true } : r))
      );
    }
  }

  function addLocation(location: string) {
    setLocations((currLocations) => [...currLocations, location]);
    setRoutes((currRoutes) => [
      ...currRoutes,
      {
        name: `types?id=business&city=${location}`,
        active: true,
        city: location,
      },
      { name: `types?id=food&city=${location}`, active: false, city: location },
      {
        name: `types?id=drinks&city=${location}`,
        active: false,
        city: location,
      },
      {
        name: `product?id=swapbox&city=${location}`,
        active: false,
        city: location,
      },
      {
        name: `product?id=swapcup&city=${location}`,
        active: false,
        city: location,
      },
    ]);
  }

  function addSummary() {
    if (canCheckout) {
      setRoutes((curr) => [
        ...curr,
        {
          active: true,
          name: "summary",
          city: "",
        },
        {
          active: true,
          name: "checkout",
          city: "",
        },
      ]);
    } else {
      setRoutes((curr) => [
        ...curr,
        {
          active: true,
          name: "quote",
          city: "",
        },
      ]);
    }
  }

  function addToCart(skuId: string, quantity: string, city: string) {
    const sku = skuCatalog.filter((s) => s.id == skuId)[0];
    const product = productCatalog.filter((p) => p.id == sku.productId)[0];

    const skuExists = cart.filter(
      (order) => order.sku.id == skuId && order.location == city
    );

    if (skuExists.length == 0) {
      setCart((curr) => [
        ...curr,
        {
          location: city,
          product: product,
          quantity: parseInt(quantity),
          sku: sku,
        },
      ]);
    } else {
      setCart((curr) => {
        curr.forEach((order) => {
          if (order.sku.id == skuId && order.location == city) {
            order.quantity = parseInt(quantity);
          }
        });
        return curr;
      });
    }
  }

  function calculatePrice(
    id: string,
    quantity: number | string,
    tax?: number
  ): number {
    return calculatePriceFromCatalog(
      skuCatalog,
      productCatalog,
      id,
      quantity,
      tax
    );
  }

  function calculateTotal(): number {
    return cart.reduce(
      (total, o) => total + calculatePrice(o.sku.id, o.quantity),
      0
    );
  }

  function disableCheckout() {
    setCanCheckout(false);
  }

  function deactivateRoute(route: string, city: string) {
    const index = routes.findIndex(
      (r) => r.name.startsWith(route) && r.active == true && r.city == city
    );
    if (index != -1) {
      routes[index] = {
        name: route + `&city=${city}`,
        active: false,
        city: city,
      };
    }
  }

  function initializeCatalog(skus: Sku[], products: Product[]) {
    setSkuCatalog(skus);
    setProductCatalog(products);
  }

  function getCity(name: string): string {
    const index = name.indexOf("city");
    if (index != -1) {
      return name.slice(index + 5);
    }
    return "";
  }

  function nextRoute(index: number): string {
    const route = routes.find((route, i) => i > index && route.active);
    if (route) {
      return route.name;
    }
    return "";
  }

  function removeLocation(location: string) {
    setLocations((curr) => curr.filter((city) => city != location));
    setRoutes((curr) => curr.filter((r) => r.city != location));
  }

  function setCustomerId(id: string) {
    setCustomerIdInt(id);
  }

  function skipToCheckout(checkout: string) {
    const separated = checkout.split("*");

    let newLocations: string[] = [];
    let newCart: CartOrder[] = [];

    separated.forEach((itemOrder) => {
      const [location, quantity, size] = itemOrder.split("^");
      if (!newLocations.includes(location)) {
        newLocations.push(location);
      }

      const sku = skuCatalog.filter(
        (s) => s.material == "Recycled Polypropylene" && s.size == size
      )[0];
      const product = productCatalog.filter((p) => p.id == sku.productId)[0];
      if (sku) {
        newCart.push({
          location: location,
          product: product,
          quantity: parseInt(quantity),
          sku: sku,
        });
      }
    });

    setLocations(newLocations);
    setCart(newCart);
  }

  return (
    <FormContext.Provider
      value={{
        activateRoute,
        addLocation,
        addSummary,
        addToCart,
        calculateTotal,
        calculatePrice,
        canCheckout,
        cart,
        customerId,
        deactivateRoute,
        disableCheckout,
        getCity,
        initializeCatalog,
        locations,
        nextRoute,
        productCatalog,
        removeLocation,
        routes,
        setCustomerId,
        skipToCheckout,
        skuCatalog,
        shippingData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormState() {
  return useContext(FormContext);
}
