import {
  Company,
  Location,
  LocationType,
  Product,
  Sku,
  User,
} from "@prisma/client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { PaymentMethod } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import AddressField from "../form/address-field";
import DoubleAddressField from "../form/double-address-field";

export default function CheckoutInfo({
  company,
  locations,
  orderString,
  paymentId,
  paymentMethods,
  products,
  skus,
  user,
}: {
  company: Company;
  locations: Location[];
  orderString: string;
  paymentId: string;
  paymentMethods?: PaymentMethod[];
  products: Product[];
  skus: Sku[];
  user: User;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dropdown, setDropdown] = useState<string>("");

  const ordersByLocation = orderString.split("*");
  const locationIds = ordersByLocation.map(
    (orderByLocation) => orderByLocation.split("_")[0]
  );

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

  async function addOrRemoveLocation(
    action: string,
    location?: Location,
    locationId?: string
  ): Promise<string | undefined> {
    console.log(action);
    if (action == "add" && location) {
      const result = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: location }),
      }).then(async (res) => await res.json());
      return result.id as string;
    }
    if (action == "remove" && locationId) {
      const result = await fetch("/api/location", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId: locationId }),
      });
    }
    return undefined;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElements = (e.target as any).elements as HTMLInputElement[];
    console.log(formElements);

    setIsLoading(true);

    // Save New Location
    let newLocationId: string | undefined = undefined;
    if (locationIds.includes("new")) {
      console.log(formElements[0]);
      const newLocation: Location = {
        id: "",
        city: formElements[4].value,
        country: formElements[1].value,
        companyId: company.id,
        displayName: null,
        line1: formElements[2].value,
        line2: formElements[3].value,
        trackingLocation: "",
        shippingName: formElements[0].value,
        state: formElements[6].value,
        type: LocationType.SHIPPING,
        zip: formElements[5].value,
      };
      newLocationId = await addOrRemoveLocation("add", newLocation, undefined);
    }

    // Process payment with new payment method
    if (stripe && elements && dropdown == "new") {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: window.location.origin + "/dashboard",
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
        // Remove newly added location on error
        if (newLocationId) {
          await addOrRemoveLocation("remove", undefined, newLocationId);
        }
      } else {
        let _orderString = orderString;
        if (locationIds.includes("new") && newLocationId) {
          _orderString = _orderString.replace(/new/g, newLocationId);
        }
        await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyId: company.id,
            orderString: _orderString,
            products: products,
            skus: skus,
            userId: user.id,
          }),
        });
        router.replace("/dashboard");
      }
    }

    // Process payment with existing payment method
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
            let _orderString = orderString;
            if (locationIds.includes("new") && newLocationId) {
              _orderString = _orderString.replace(/new/g, newLocationId);
            }
            await fetch("/api/order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                companyId: company.id,
                orderString: _orderString,
                products: products,
                skus: skus,
                userId: user.id,
              }),
            });
            router.replace("/dashboard");
          }
        })
        .catch(async (error) => {
          setMessage(error);

          // Remove newly added location on error
          if (newLocationId) {
            await addOrRemoveLocation("remove", undefined, newLocationId);
          }
        });
    }

    setIsLoading(false);
  };

  const addresses = locationIds.map((locationId) => {
    const location: Location | undefined = locations.find(
      (loc) => loc.id == locationId
    );
    return (
      <div className="py-4" key={locationId + "address"}>
        {ordersByLocation.length > 1 ? (
          <div className="text-lg font-semibold">{`${
            location ? location.displayName ?? location.city : "New Location"
          } Shipping Address`}</div>
        ) : (
          <div className="text-lg font-semibold">{`Shipping Address`}</div>
        )}
        <AddressField
          placeholder="Name"
          top
          required
          value={location?.shippingName!}
        />
        <AddressField
          placeholder="Country"
          required
          value={location?.country!}
        />
        <AddressField
          placeholder="Address Line 1"
          required
          value={location?.line1!}
        />
        <AddressField
          placeholder="Address Line 2"
          value={location?.line2 ?? ""}
        />
        <DoubleAddressField
          leftPlaceholder="City"
          leftValue={location?.city!}
          rightPlaceholder="Zip"
          rightValue={location?.zip!}
          required
        />
        <AddressField
          placeholder="State"
          bottom
          required
          value={location?.state!}
        />
      </div>
    );
  });

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
            New payment method
          </option>
        </select>
      )}
      {dropdown == "new" && (
        <PaymentElement id="payment-element" className="my-4" />
      )}
      <div className="flex w-full place-content-center">
        <button
          disabled={isLoading || !stripe || !elements || dropdown == ""}
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
