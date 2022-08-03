import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { PaymentMethod } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import {
  getLocationsFromOrders,
  OrderCustomerLocation,
  OrderLocationSku,
  TransactionCustomerOrders,
} from "../../utils/dashboard/dashboardUtils";
import AddressField from "../form/address-field";
import DoubleAddressField from "../form/double-address-field";

export default function CheckoutInfo({
  paymentId,
  paymentMethods,
  order,
  transaction,
}: {
  paymentId: string;
  paymentMethods?: PaymentMethod[];
  order?: OrderCustomerLocation;
  transaction?: TransactionCustomerOrders;
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

    setIsLoading(true);
    if (stripe && elements && dropdown == "new") {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: window.location.origin + "/dashboard",
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

    if (stripe && dropdown != "new" && dropdown != "") {
      console.log("yep");
      await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: paymentId,
          paymentMethod: dropdown,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.status == "succeeded") {
            if (transaction) {
              await fetch("/api/transaction/repeat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  transaction: transaction,
                }),
              });
            }
            if (order) {
              await fetch("/api/order/repeat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  order: order,
                }),
              });
            }
            router.replace("/dashboard");
          }
        })
        .catch((error) => setMessage(error));
      setIsLoading(false);
    }
  };

  const orders = (): OrderLocationSku[] => {
    if (transaction) {
      return transaction.orders;
    }
    if (order) {
      return [order];
    }
    return [];
  };

  const addresses = getLocationsFromOrders(orders()).map((location) => (
    <div className="py-4" key={location.id + "address"}>
      {getLocationsFromOrders(orders()).length > 1 ? (
        <div className="text-lg font-semibold">{`${
          location.displayName ?? location.city
        } Shipping Address`}</div>
      ) : (
        <div className="text-lg font-semibold">{`Shipping Address`}</div>
      )}
      <AddressField
        placeholder="Name"
        top
        required
        value={location.shippingName}
      />
      <AddressField placeholder="Country" required value={location.country} />
      <AddressField
        placeholder="Address Line 1"
        required
        value={location.line1}
      />
      <AddressField placeholder="Address Line 2" value={location.line2 ?? ""} />
      <DoubleAddressField
        leftPlaceholder="City"
        leftValue={location.city}
        rightPlaceholder="Zip"
        rightValue={location.zip}
        required
      />
      <AddressField
        placeholder="State"
        bottom
        required
        value={location.state}
      />
    </div>
  ));

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="flex-col border-l border-grey-500 rounded px-10 py-4 h-full items-start overflow-auto"
    >
      <div>{addresses}</div>
      {paymentMethods && (
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
            >{`${method.card?.brand} – ${method.card?.last4}`}</option>
          ))}
          <option value="new" key="new">
            Use a new card
          </option>
        </select>
      )}
      {dropdown == "new" && (
        <PaymentElement id="payment-element" className="my-4" />
      )}
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
