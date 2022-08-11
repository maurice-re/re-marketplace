import { FormEvent, useState } from "react";
import { useFormState } from "../../context/form-context";
import { saveToLocalStorage } from "../../utils/form/localStorage";
import AddressField from "./address-field";
import DoubleAddressField from "./double-address-field";

export default function PreOrderForm() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { cart, locations, customerId } = useFormState();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElements = (e.target as any).elements as HTMLInputElement[];
    let shippingInfo: string[] = [];
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

  const addresses = locations.map((city) => (
    <div className="py-4" key={city}>
      {locations.length > 1 ? (
        <div className="text-lg font-semibold">{`${city} Shipping Address`}</div>
      ) : (
        <div className="text-lg font-semibold">{`Shipping Address`}</div>
      )}
      <AddressField placeholder="Name" top required />
      <AddressField placeholder="Country" required />
      <AddressField placeholder="Address Line 1" required />
      <AddressField placeholder="Address Line 2" />
      <DoubleAddressField
        leftPlaceholder="City"
        rightPlaceholder="Zip"
        required
      />
      <AddressField placeholder="State" bottom required />
    </div>
  ));

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
