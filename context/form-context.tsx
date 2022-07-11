import { createDecipheriv } from "crypto";
import { createContext, ReactNode, useContext, useState } from "react";
import {
  checkoutCipherAlgorithm,
  checkoutCipherIv,
  checkoutCipherKey,
  swapboxProduct,
  swapcupProduct,
} from "../constants/form";
import { OrderItem } from "../models/order";
import { SKU } from "../models/products";

type FormRoute = {
  active: boolean;
  city: string;
  name: string;
};
export type FormCart = {
  [city: string]: SKU[];
};

type FormState = {
  activateRoute: (route: string, city: string) => void;
  addLocation: (location: string) => void;
  addSummary: () => void;
  addToCart: (sku: SKU, city: string) => void;
  calculateTotal: () => number;
  cart: FormCart;
  deactivateRoute: (route: string, city: string) => void;
  getCity: (name: string) => string;
  locations: string[];
  nextRoute: (index: number) => string;
  toItems: () => OrderItem[];
  removeLocation: (location: string) => void;
  routes: FormRoute[];
  skipToCheckout: (checkout: string) => void;
  shippingData: string[];
};
const FormContext = createContext<FormState>({} as FormState);

export function FormStateProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<string[]>([]);
  const [routes, setRoutes] = useState<FormRoute[]>([
    { name: "location", active: true, city: "" },
  ]);
  const [cart, setCart] = useState<FormCart>({});
  const [shippingData, setShippingData] = useState<string[]>([]);

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
    setCart((currCart) => ({ ...currCart, [location]: [] }));
  }

  function addSummary() {
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
  }

  function addToCart(sku: SKU, city: string) {
    if (sku.image == "" && sku.quantity == "" && sku.title == "") {
      return;
    }

    const index = cart[city].findIndex((s) => s.title == sku.title);
    if (index != -1) {
      cart[city][index].quantity = sku.quantity;
    } else {
      cart[city].push(sku);
    }
  }

  function addShippingData(elements: HTMLInputElement[]) {
    let shippingInfo: string[] = [];
    for (let i = 0; i < elements.length - 1; i++) {
      shippingInfo.push(elements[i].value);
    }
    setShippingData(shippingInfo);
  }

  function calculateTotal(): number {
    let cost = 0;
    for (let city in cart) {
      cost += 0; //shipping
      cart[city].map((sku) => {
        cost += sku.price * parseInt(sku.quantity);
      });
    }
    return cost;
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

  function toItems(): OrderItem[] {
    let items: OrderItem[] = [];
    for (let city in cart) {
      cart[city].map((sku) => {
        items.push({
          price: sku.price,
          quantity: parseInt(sku.quantity),
          title: sku.title,
          productId: "",
          image: sku.image,
          locationName: city,
          locationId: "00",
        });
      });
    }
    return items;
  }

  function removeLocation(location: string) {
    setLocations((curr) => curr.filter((city) => city != location));
    setRoutes((curr) => curr.filter((r) => r.city != location));
    setCart((curr) => {
      delete curr[location];
      return curr;
    });
  }

  function skipToCheckout(checkout: string) {
    const decipher = createDecipheriv(
      checkoutCipherAlgorithm,
      checkoutCipherKey,
      checkoutCipherIv
    );
    const decrypted =
      decipher.update(checkout, "hex", "utf8") + decipher.final("utf8");
    const seperated = decrypted.split("*");

    let newLocations: string[] = [];
    let newCart: FormCart = {};

    seperated.forEach((itemOrder) => {
      const [location, quantity, size] = itemOrder.split("^");
      if (!newLocations.includes(location)) {
        console.log(`set ${location}`);
        newLocations.push(location);
        newCart[location] = [];
      }

      const product =
        size == "1 L" || size == "1.5 L" ? swapboxProduct : swapcupProduct;
      const id: string = product.getSku(size, "Recycled Polypropylene");

      let sku = product.sku.get(id);
      if (sku) {
        sku.quantity = quantity;
        newCart[location].push(sku);
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
        cart,
        deactivateRoute,
        getCity,
        locations,
        nextRoute,
        toItems,
        removeLocation,
        routes,
        skipToCheckout,
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
