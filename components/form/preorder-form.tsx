import { FormEvent, useState } from "react";
import { FormStore, useFormStore } from "../../stores/formStore";
import { saveToLocalStorage } from "../../utils/form/localStorage";
import AddressField from "./address-field";
import DoubleAddressField from "./double-address-field";

export default function PreOrderForm() {
  const [message] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { cart, locations, customerId } = useFormStore((state: FormStore) => ({
    cart: state.cart,
    locations: state.locations,
    customerId: state.customerId,
  }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: find a better way to do parse form
    const formElements = (e.target as any).elements as HTMLInputElement[];
    const shippingInfo: string[] = [];
    for (let i = 0; i < formElements.length - 1; i++) {
      shippingInfo.push(formElements[i].value);
    }

    saveToLocalStorage(
      [cart, shippingInfo, locations, customerId],
      ["cart", "shipping", "locations", "customerId"]
    );

    setIsLoading(true);

    setIsLoading(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="flex-col border-l border-grey-500 rounded px-10 py-4 h-full items-start overflow-auto"
    >
      <div>
        <div className="py-4">
          <div className="text-lg font-semibold">Your Info</div>
          <DoubleAddressField
            leftPlaceholder="First Name"
            rightPlaceholder="Last Name"
            top
            required
          />
          <AddressField placeholder="Email" required />
          <AddressField placeholder="Company Name" bottom required />
        </div>
      </div>
      <div className="flex w-full place-content-center">
        <button
          disabled={isLoading}
          id="submit"
          className=" bg-re-green-500 px-4 py-2 w-1/2 mb-4 rounded-md hover:bg-aquamarine-400 place-content-center flex"
        >
          {isLoading ? (
            <div className=" animate-spin h-6 w-6 border-t-2 border-l-2 border-black rounded-full" />
          ) : (
            <span className="text-black text-base font-medium">Pay now</span>
          )}
        </button>
      </div>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
