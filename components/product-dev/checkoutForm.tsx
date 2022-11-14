import { Company } from "@prisma/client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { PaymentMethod } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import AddressField from "../form/address-field";
import DoubleAddressField from "../form/double-address-field";

export default function CheckoutForm({
  company,
  companyName,
  customerId,
  id,
  paymentMethods,
}: {
  company: Company | null;
  companyName: string;
  customerId: string;
  id: string;
  paymentMethods: PaymentMethod[];
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dropdown, setDropdown] = useState<string>("");

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: find a better way to do parse form
    const formElements = (e.target as any).elements as HTMLInputElement[];

    setIsLoading(true);
    if (stripe && elements) {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: window.location.origin + "/product-dev/success",
        },
        redirect: "if_required",
      });
      if (error) {
        // This will only be reached if there is a payment error
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message ?? "error");
        } else {
          setMessage("An unexpected error occurred.");
        }
      } else {
        await fetch("/api/product-dev/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: id,
            companyName: companyName,
            customerId: customerId,
            firstName: formElements[0].value,
            lastName: formElements[1].value,
            email: formElements[2].value,
          }),
        });
        router.replace("/product-dev/success");
      }
      setIsLoading(false);
    }
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
          <AddressField
            placeholder="Company Name"
            bottom
            required
            value={companyName}
          />
        </div>
      </div>
      {company != null && (
        <select
          className={`w-full bg-stripe-gray border-white border rounded py-2 ${
            dropdown == "new" ? "mb-2" : "mb-6"
          }`}
          value={dropdown}
          onChange={(e) => setDropdown(e.target.value)}
        >
          <option value="" key="placeholder">
            Choose a payment method
          </option>
          {paymentMethods.map((method) => (
            <option
              key={method.id}
              value={method.id}
            >{`${method.card?.brand} – ${method.card?.last4}`}</option>
          ))}
          <option value="new" key="new">
            New payment method
          </option>
        </select>
      )}
      {dropdown == "new" && (
        <PaymentElement id="payment-element" className="my-4" />
      )}
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
