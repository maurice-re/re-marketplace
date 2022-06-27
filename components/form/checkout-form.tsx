import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { FormEvent, useState } from "react";
import { useAppContext } from "../../context/context-provider";
import AddressField from "./address-field";
import DoubleAddressField from "./double-address-field";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [context, _] = useAppContext();

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

    let formData: [string, string][] = [];
    for (let i = 1; i < formElements.length; i++) {
      formData.push([formElements[i].name, formElements[i].value]);
    }
    console.log(formData);
    console.log(context.cart);

    const msg: string = `An order was just placed! The form data is: ${formData.toString()} the cart is ${context.toCheckoutString()}`;
    const res = await fetch("/api/sendgrid", {
      body: JSON.stringify({
        msg: msg,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { er } = await res.json();
    if (er) {
      console.log(er);
      return;
    }

    setIsLoading(true);
    if (stripe && elements) {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: "https://marketplace.re.company/form/success",
        },
      });

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message ?? "error");
      } else {
        setMessage("An unexpected error occurred.");
      }

      setIsLoading(false);
    }
  };

  const addresses = context.locations.map((city) => (
    <div className="py-4" key={city}>
      {context.locations.length > 1 ? (
        <div className="text-lg font-semibold">{`${city} Shipping Address`}</div>
      ) : (
        <div className="text-lg font-semibold">{`Shipping Address`}</div>
      )}
      <AddressField placeholder="Name" top />
      <AddressField placeholder="Country" />
      <AddressField placeholder="Address Line 1" />
      <AddressField placeholder="Address Line 2" />
      <DoubleAddressField leftPlaceholder="City" rightPlaceholder="Zip" />
      <AddressField placeholder="State" bottom />
    </div>
  ));

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="flex-col border-l border-grey-500 rounded px-10 py-4 items-start h-148 overflow-auto"
    >
      <div className="text-lg font-semibold mb-1">EOL Agreement</div>
      <div className="inline-block text-sm">
        <input type="checkbox" className="text-sm" id="eol"></input>
        <label htmlFor="eol" className="text-base pl-1 inline-block">
          Agree to EOL policy
        </label>
      </div>
      <div>{addresses}</div>
      <PaymentElement id="payment-element" className="my-4" />
      <div className="flex w-full place-content-center">
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className=" bg-aquamarine-500 px-4 py-2 w-1/2 mb-4 rounded-md hover:bg-aquamarine-400 place-content-center flex"
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
