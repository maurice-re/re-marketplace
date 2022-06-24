import { SKU } from "./products";

export class FormState {
  locations: string[];
  routes: { name: string; active: boolean; city: string }[];
  cart: { [city: string]: SKU[] } = {};

  constructor() {
    this.locations = []; //["NY", "TOR"];
    this.cart = {
      // NY: [
      //   new SKU(
      //     "1.5 L Recycled Polypropylene",
      //     "/images/takeout_vent.png",
      //     "90"
      //   ),
      //   new SKU(
      //     "1 L Recycled Polypropylene",
      //     "/images/takeout_vent.png",
      //     "100"
      //   ),
      // ],
      // TOR: [
      //   new SKU(
      //     "1.5 L Recycled Polypropylene",
      //     "/images/takeout_vent.png",
      //     "50"
      //   ),
      // ],
    };
    this.routes = [{ name: "location", active: true, city: "" }];
  }

  addLocation(location: string) {
    this.locations.push(location);
    this.routes.push(
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
      }
    );
  }

  removeLocation(location: string) {
    this.locations = this.locations.filter((city) => city != location);
    this.routes = this.routes.filter((r) => r.city != location);
  }

  addSummary() {
    this.routes.push({ name: `checkout`, active: true, city: "" });
  }

  static getCity(name: string): string {
    const index = name.indexOf("city");
    if (index != -1) {
      return name.slice(index + 5);
    }
    return "";
  }

  addRoute(route: string, city: string) {
    const index = this.routes.findIndex(
      (r) => r.name.startsWith(route) && r.active == false && r.city == city
    );
    if (index != -1) {
      this.routes[index] = {
        name: route + `&city=${city}`,
        active: true,
        city: city,
      };
    }
  }

  removeRoute(route: string, city: string) {
    const index = this.routes.findIndex(
      (r) => r.name.startsWith(route) && r.active == true && r.city == city
    );
    if (index != -1) {
      this.routes[index] = {
        name: route + `&city=${city}`,
        active: false,
        city: city,
      };
    }
  }

  nextRoute(index: number): string {
    const route = this.routes.find((route, i) => i > index && route.active);
    if (route) {
      return route.name;
    }
    return "";
  }

  addToCart(sku: SKU, city: string) {
    if (sku.image == "" && sku.quantity == "" && sku.title == "") {
      return;
    }

    if (this.cart[city] == undefined) {
      this.cart[city] = [];
    }

    const index = this.cart[city].findIndex((s) => s.title == sku.title);
    if (index != -1) {
      this.cart[city][index].quantity = sku.quantity;
    } else {
      this.cart[city].push(sku);
    }
  }

  toCheckoutString(): string {
    let output: string[] = [];
    this.locations.map((city) => {
      this.cart[city].map((item) => {
        output.push(item.title + "^" + item.quantity);
      });
    });
    return output.join(",");
  }

  calculateCost(): number {
    let cost = 0;
    for (let city in this.cart) {
      cost += 100; //shipping
      this.cart[city].map((sku) => {
        cost += sku.price * parseInt(sku.quantity);
      });
    }
    return cost;
  }
}
