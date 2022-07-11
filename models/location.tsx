export class Location {
  city: string;
  country: string;
  line1: string;
  line2: string;
  locationId: string;
  lastOrderDate: number;
  nickName: string;
  numOrders: number;
  shippingName: string;
  state: string;
  zip: string;

  constructor() {
    this.city = "";
    this.country = "";
    this.line1 = "";
    this.line2 = "";
    this.locationId = "";
    this.lastOrderDate = Date.now();
    this.nickName = "";
    this.numOrders = 0;
    this.shippingName = "";
    this.state = "";
    this.zip = "";
  }
}
