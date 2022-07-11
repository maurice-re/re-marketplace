import { signInAnonymously, UserCredential } from "firebase/auth";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "../../constants/firebase";
import { FormCart } from "../../context/form-context";
import { OrderItem, OrderLocation } from "../../models/order";

export async function addToFirebase(cart: FormCart, locations:string[], shippingData: string[]) {
    const now = Timestamp.now();
    // Create User
    const cred: UserCredential = await signInAnonymously(auth).catch((e) => {
      console.warn(e);
      return e;
    });

    // Create Locations
    let cityToId: { [key: string]: string } = {};
    let cityToLine1: { [key: string]: string } = {};
    await Promise.all(
      locations.map(async (city, index) => {
        const loc = {
          city: shippingData[4 + 7 * index],
          country: shippingData[1 + 7 * index],
          dateAdded: now,
          line1: shippingData[2 + 7 * index],
          line2: shippingData[3 + 7 * index],
          lastOrderDate: now,
          nickName: "",
          numOrders: 1,
          shippingName: shippingData[0 + 7 * index],
          state: shippingData[6 + 7 * index],
          userId: cred.user.uid,
          zip: shippingData[5 + 7 * index],
        };
        console.log(loc);
        const locRef = await addDoc(collection(db, "locations"), loc);
        cityToId[city] = locRef.id;
        cityToLine1[city] = shippingData[2 + 7 * index];
      })
    );

    // Create Order
    let items: OrderItem[] = [];
    for (let city in cart) {
      cart[city].map((sku) => {
        items.push({
          price: sku.price,
          quantity: parseInt(sku.quantity),
          title: sku.title,
          productId: "",
          image: sku.image,
          locationName: cityToLine1[city],
          locationId: cityToId[city],
        });
      });
    }

    let orderLocations: OrderLocation[] = [];
    locations.map(async (city, index) => {
      orderLocations.push({
        line1: shippingData[3 + 7 * index],
        locationId: cityToId[city],
        nickname: "",
        shippingName: shippingData[0 + 7 * index],
      });
    });

    const order = {
      items: items,
      locations: orderLocations,
      numItems: items.reduce<number>((total, item) => total + item.quantity, 0),
      timestamp: now,
      total: parseFloat(
        items
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2)
      ),
      userId: cred.user.uid,
    };
    await addDoc(collection(db, "orders"), order);
  }
