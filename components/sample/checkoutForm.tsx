import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { FormEvent, useState } from "react";
import { saveToLocalStorage } from "../../utils/form/localStorage";
import { SampleOrderWithSkuID } from "../../utils/sample/sampleUtils";
import AddressField from "../form/address-field";
import DoubleAddressField from "../form/double-address-field";

export default function CheckoutForm({
  transaction,
}: {
  transaction: SampleOrderWithSkuID;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const { cart, locations, customerId } = useFormState();

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent) {
        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElements = (e.target as any).elements as HTMLInputElement[];
    let shippingInfo: string[] = [];
    for (let i = 0; i < formElements.length - 1; i++) {
      shippingInfo.push(formElements[i].value);
    }

    saveToLocalStorage(
      [transaction, shippingInfo],
      ["transaction", "shipping"]
    );

    setIsLoading(true);
    if (stripe && elements) {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: window.location.origin + "/sample/success",
        },
      });

      // This will only be reached if there is a payment error
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message ?? "error");
      } else {
        setMessage("An unexpected error occurred.");
      }
      setIsLoading(false);
    }
  };

  const addresses = (
    <div className="py-4">
      <div className="text-lg font-semibold">{`Shipping Address`}</div>

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
  );

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
      <div>{addresses}</div>
      <PaymentElement id="payment-element" className="my-4" />
      <div className="flex w-full place-content-center">
        <button
          disabled={isLoading || !stripe || !elements}
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
