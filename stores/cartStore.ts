import create from "zustand";

interface CartStore {
    orderString: string;
    addToCart: (locationId: string, skuQuantity: string) => void;
    removeFromCart: (locationId: string, skuQuantity: string) => void;
    clearCart: () => void;
  }
  
  export const useCartStore = create<CartStore>((set) => ({
    orderString: "",
    addToCart: (locationId, skuQuantity) =>
      set((state) => {
        if (state.orderString.includes(locationId)) {
          const orderStringSeparated = state.orderString.split("*");
          const orderForLocation = orderStringSeparated.find(
            (order) =>
              order.includes(locationId) &&
              order.includes(skuQuantity.split("~")[0])
          );
          if (!orderForLocation) {
            return {
              orderString: state.orderString.replace(
                locationId,
                `${locationId}_${skuQuantity}`
              ),
            };
          } else {
            const orderForLocationSeparated = orderForLocation.split("_");
            const newOrderForLocation = orderForLocationSeparated
              .map((order) => {
                if (order.includes(skuQuantity.split("~")[0])) {
                  return skuQuantity;
                }
                return order;
              })
              .join("_");
            return {
              orderString: state.orderString.replace(
                orderForLocation,
                newOrderForLocation
              ),
            };
          }
        } else {
          if (state.orderString === "") {
            return { orderString: `${locationId}_${skuQuantity}` };
          } else {
            return {
              orderString:
                state.orderString + "*" + `${locationId}_${skuQuantity}`,
            };
          }
        }
      }),
    removeFromCart: (locationId, skuQuantity) =>
      set((state) => {
        if (!state.orderString.includes(locationId)) {
          return { orderString: state.orderString };
        }
        const orderStringSeparated = state.orderString.split("*");
        const orderForLocation = orderStringSeparated.find(
          (order) => order.includes(locationId) && order.includes(skuQuantity)
        );
        if (!orderForLocation) {
          return { orderString: state.orderString };
        }
  
        if (orderForLocation.split("_").length > 2) {
          const newOrderForLocation = orderForLocation.replace(skuQuantity, "");
          return {
            orderString: state.orderString.replace(
              orderForLocation,
              newOrderForLocation
            ),
          };
        } else {
          return { orderString: state.orderString.replace(orderForLocation, "") };
        }
      }),
    clearCart: () => set((state) => ({ orderString: "" })),
  }));