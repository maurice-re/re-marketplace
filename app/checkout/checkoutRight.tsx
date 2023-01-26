import {
  Company,
  Product,
  ProductDevelopment,
  Sku,
  User,
} from "@prisma/client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { PaymentMethod } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { CheckoutType, getCheckoutTotal } from "../../utils/checkoutUtils";

export default function CheckoutRight({
  company,
  customerId,
  eol,
  orderString,
  paymentIntentId,
  paymentMethods,
  productDevelopment,
  products,
  skus,
  type,
  user,
}: {
  company: Company | null;
  customerId: string;
  eol: boolean;
  orderString: string;
  paymentIntentId: string;
  paymentMethods?: PaymentMethod[];
  productDevelopment: ProductDevelopment | null;
  products: Product[] | null;
  skus: Sku[] | null;
  type: CheckoutType;
  user: User | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dropdown, setDropdown] = useState<string>("");

  useEffect(() => {
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
    let hasError = false;
    setIsLoading(true);

    const useNewPaymentMethod =
      dropdown == "new" ||
      (dropdown == "" && type == CheckoutType.SAMPLE) ||
      (type == CheckoutType.PRODUCT_DEVELOPMENT && company == null);

    // Process payment with new payment method
    if (stripe && elements && useNewPaymentMethod) {
      const redirectPathName = CheckoutType.ORDER
        ? "/dashboard"
        : "/product-dev/success";
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: window.location.origin + redirectPathName,
        },
        redirect: "if_required",
      });

      if (error) {
        // This will only be reached if there is a payment error
        if (error.type === "card_error" || error.type === "validation_error") {
          hasError = true;
          setMessage(error.message ?? "error");
        } else {
          hasError = true;
          setMessage("An unexpected error occurred.");
        }
        return;
      }
    }

    // Process payment with existing payment method
    if (stripe && dropdown != "new" && dropdown != "") {
      const res = await fetch("/api/payment/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          paymentIntentId: paymentIntentId,
          paymentMethod: dropdown,
          total: getCheckoutTotal(
            orderString,
            productDevelopment,
            products,
            skus,
            type
          ),
        }),
      });
      if (res.status != 200) {
        hasError = true;
        const { message } = await res.json();
        setMessage(message);
        setIsLoading(false);
        return;
      }
    }

    if (!hasError) {
      if (type == CheckoutType.PRODUCT_DEVELOPMENT && productDevelopment) {
        const res = await fetch("/api/product-development", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: productDevelopment.id,
            companyId: productDevelopment.companyId,
            companyName: productDevelopment.companyName,
            customerId: customerId,
            firstName: formElements[0].value,
            lastName: formElements[1].value,
            email: formElements[2].value,
          }),
        });
        if (res.ok) {
          router.replace("/product-dev/success");
        } else {
          setMessage("An unexpected error occurred.");
        }
        return;
      } else if (type == CheckoutType.ORDER && company && user) {
        await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyId: company.id,
            orderString: orderString,
            products: products,
            skus: skus,
            userId: user.id,
            paymentId: paymentIntentId,
          }),
        }).catch(async (error) => {
          setMessage(error);
          return;
        });
        router.replace("/dashboard");
      }
    }

    setIsLoading(false);
  };
  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="flex-col rounded px-10 py-4 h-full items-start"
    >
      {company != null && paymentMethods && (
        <select
          className={`w-full bg-re-dark-green-200  border border-re-gray-300 rounded p-4 ${
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
            >{`${method.us_bank_account?.account_type} – ${method.us_bank_account?.routing_number}`}</option>
          ))}
          <option value="new" key="new">
            New payment method
          </option>
        </select>
      )}
      {(dropdown == "new" || company == null) && (
        <PaymentElement id="payment-element" className="my-4" />
      )}
      {type == CheckoutType.ORDER && (
        <button
          onClick={() => document.getElementById("eol-modal")?.click()}
          type="button"
          disabled={isLoading || !stripe || !elements || dropdown == ""}
          className={`btn modal-button text-center mb-6 w-full ${
            eol ? "text-re-green-500" : "btn-error btn-outline"
          }`}
        >
          {eol ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          ) : (
            "EOL Policy"
          )}
        </button>
      )}
      <div className="flex w-full place-content-center">
        <button
          disabled={
            isLoading ||
            !stripe ||
            !elements ||
            (dropdown == "" && company != undefined) ||
            (type == CheckoutType.ORDER && !eol)
          }
          id="submit"
          className={`btn btn-accent btn-outline px-4 py-2 w-1/2 mb-4 ${
            isLoading ? "loading" : ""
          }`}
        >
          Pay Now
        </button>
      </div>
      {/* Show any error or success messages */}
      {message && (
        <div
          id="payment-message"
          className="font-theinhardt text-error text-center"
        >
          {message}
        </div>
      )}
    </form>
  );
}
