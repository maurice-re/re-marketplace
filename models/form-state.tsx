import { SKU } from "./products";

export class FormState {
  routes: { name: string; active: boolean }[];
  cart: SKU[];

  constructor() {
    this.cart = [
      // new SKU("1.5L Recycled Polypropylene", "/images/takeout_vent.png", "30"),
      // new SKU("1L Recycled Polypropylene", "/images/takeout_vent.png", "50"),
    ];
    this.routes = [
      { name: "location", active: true },
      { name: "types?id=business", active: true },
      { name: "types?id=food", active: false },
      { name: "types?id=drinks", active: false },
      { name: "product?id=swapbox", active: false },
      { name: "product?id=swapcup", active: false },
      { name: "summary", active: true },
    ];
  }

  addRoute(route: string) {
    const index = this.routes.findIndex(
      (r) => r.name == route && r.active == false
    );
    if (index != -1) {
      this.routes[index] = { name: route, active: true };
    }
  }

  removeRoute(route: string) {
    const index = this.routes.findIndex(
      (r) => r.name == route && r.active == true
    );
    if (index != -1) {
      this.routes[index] = { name: route, active: false };
    }
  }

  nextRoute(index: number): string {
    const route = this.routes.find((route, i) => i > index && route.active);
    if (route) {
      return route.name;
    }
    return "";
  }

  addToCart(sku: SKU) {
    if (sku.image == "" && sku.quantity == "" && sku.title == "") {
      return;
    }

    const index = this.cart.findIndex((s) => s.title == sku.title);
    if (index != -1) {
      this.cart[index].quantity = sku.quantity;
    } else {
      this.cart.push(sku);
    }
  }

  toCheckoutString(): string {
    let output: string[] = [];
    this.cart.map((item) => {
      output.push(item.title + "^" + item.quantity);
    });
    return output.join(",");
  }
}
