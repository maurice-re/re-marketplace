import { Timestamp } from "firebase/firestore";

export type OrderItem = {
  title: string;
  price: number;
  quantity: number;
  productId: string;
  image: string;
  locationName: string;
  locationId: string;
};

export type OrderLocation = {
  line1: string;
  locationId: string;
  nickname: string;
  shippingName: string;
};

export class Order {
  items: OrderItem[];
  locations: OrderLocation[];
  numItems: number;
  orderId: string;
  total: number;
  userId: string;
  timestamp: Timestamp;

  constructor(userId: string, items: OrderItem[], locations: OrderLocation[]) {
    this.items = items;
    this.locations = locations;
    this.numItems = items.reduce((total, item) => total + item.quantity, 0);
    this.orderId = "";
    this.total = parseFloat(
      items
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2)
    );
    this.userId = userId;
    this.timestamp = Timestamp.now();
  }
}

export const fakeOrder = new Order(
  "000",
  [
    {
      title: "swaptray",
      price: 5,
      quantity: 2,
      productId: "000",
      image: "",
      locationName: "Max",
      locationId: "000",
    },
  ],
  [
    {
      nickname: "narnia",
      shippingName: "Max",
      line1: "wall st",
      locationId: "00",
    },
  ]
);
export function createFakeOrder() {
  fetch("/api/orders/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ json: JSON.stringify(fakeOrder) }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}
