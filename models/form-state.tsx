import { SKU } from "./products";

export class FormState {
  routes: string[];
  cart: SKU[];

  constructor() {
    this.cart = [];
    this.routes = ["location"];
  }

  addRoute(route: string) {
    if (!this.routes.includes(route) && route != "") {
      this.routes.push(route);
    }
  }

  removeRoute(route: string) {
    if (this.routes.includes(route)) {
      this.routes = this.routes.filter((r) => r != route);
    }
  }

  addToCart(sku: SKU) {
    if (this.cart.filter((s) => s.title == sku.title).length > 0) {
      let i = this.cart.indexOf(sku);
      this.cart[i].quantity = sku.quantity;
    } else {
      this.cart.push(sku);
    }
  }
}
