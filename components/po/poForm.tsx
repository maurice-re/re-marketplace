"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type POFormProps = {
  orderString: string;
};

export default function POForm({ orderString }: POFormProps) {
  const router = useRouter();
  const [buyerName, setBuyerName] = useState<string>("");
  const [buyerBillingAddressLine, setBuyerBillingAddressLine] =
    useState<string>("");
  const [buyerShippingAddressLine, setBuyerShippingAddressLine] =
    useState<string>("");
  const [buyerPhone, setBuyerPhone] = useState<string>("");
  const [buyerTaxId, setBuyerTaxId] = useState<string>("");
  const [requestioner, setRequestioner] = useState<string>("");
  const [shippedVia, setShippedVia] = useState<string>("");
  const [fobPoint, setFobPoint] = useState<string>("");
  const [terms, setTerms] = useState<string>("");

  return (
    <form className="w-1/4 my-4 flex-col">
      <div>
        <div className="py-4">
          <div className="text-lg font-semibold">Your Info</div>
          <div className="p-0 my-0">
            <input
              name={"Contact Name"}
              className={
                "p-1 border-x border-y text-lg w-full bg-re-dark-green-500 border-re-gray-300 outline-re-gray-100 border-t mt-2 rounded-t-md"
              }
              type="text"
              value={buyerName}
              placeholder={"Contact Name"}
              onChange={(e) => setBuyerName(e.target.value)}
              required
            />
          </div>
          <div className="p-0 my-0">
            <input
              name={"Billing Address Line"}
              className={
                "p-1 border-x border-y text-lg w-full bg-re-dark-green-500 border-re-gray-300 outline-re-gray-200"
              }
              type="text"
              value={buyerBillingAddressLine}
              placeholder={"Billing Address Line"}
              onChange={(e) => setBuyerBillingAddressLine(e.target.value)}
              required
            />
          </div>
          <div className="p-0 my-0">
            <input
              name={"Shipping Address Line"}
              className={
                "p-1 border-x border-y text-lg w-full bg-re-dark-green-500 border-re-gray-300 outline-re-gray-300"
              }
              type="text"
              value={buyerShippingAddressLine}
              placeholder={"Shipping Address Line"}
              onChange={(e) => setBuyerShippingAddressLine(e.target.value)}
              required
            />
          </div>
          <div className="p-0 my-0">
            <input
              name={"Buyer Phone"}
              className={
                "p-1 border-x border-y text-lg w-full bg-re-dark-green-500 border-re-gray-300 outline-re-gray-300"
              }
              type="text"
              value={buyerPhone}
              placeholder={"Buyer Phone"}
              onChange={(e) => setBuyerPhone(e.target.value)}
              required
            />
          </div>
          <div className="p-0 my-0">
            <input
              name={"Buyer Tax ID"}
              className={
                "p-1 border-x border-y text-lg w-full bg-re-dark-green-500 border-re-gray-300 outline-re-gray-300 border-b mb-2 rounded-b"
              }
              type="text"
              value={buyerTaxId}
              placeholder={"Buyer Tax ID"}
              onChange={(e) => setBuyerTaxId(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <div>
        <div className="py-4">
          <div className="text-lg font-semibold">Other Info</div>
          <div className="p-0 my-0">
            <input
              name={"Requestioner"}
              className={
                "p-1 border-x border-y text-lg w-full bg-re-dark-green-500 border-re-gray-300 outline-re-gray-300 border-t mt-2 rounded-t"
              }
              type="text"
              value={requestioner}
              placeholder={"Requestioner"}
              onChange={(e) => setRequestioner(e.target.value)}
              required
            />
          </div>
          <div className="p-0 my-0">
            <input
              name={"Shipped Via"}
              className={
                "p-1 border-x border-y text-lg w-full bg-re-dark-green-500 border-re-gray-300 outline-re-gray-300"
              }
              type="text"
              value={shippedVia}
              placeholder={"Shipped Via"}
              onChange={(e) => setShippedVia(e.target.value)}
              required
            />
          </div>
          <div className="p-0 my-0">
            <input
              name={"FOB Point"}
              className={
                "p-1 border-x border-y text-lg w-full bg-re-dark-green-500 border-re-gray-300 outline-re-gray-300"
              }
              type="text"
              value={fobPoint}
              placeholder={"FOB Point"}
              onChange={(e) => setFobPoint(e.target.value)}
              required
            />
          </div>
          <div className="p-0 my-0">
            <input
              name={"Terms"}
              className={
                "p-1 border-x border-y text-lg w-full bg-re-dark-green-500 border-re-gray-300 outline-re-gray-300 border-b mb-2 rounded-b-md"
              }
              type="text"
              value={terms}
              placeholder={"Terms"}
              onChange={(e) => setTerms(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <Link
        className={`flex flex-col my-1 w-1/2 mx-auto ${
          orderString == "" && "pointer-events-none"
        }`}
        href={{
          pathname: "/po/pdf",
          query: {
            orderString: orderString,
            buyerName: buyerName,
            buyerBillingAddressLine: buyerBillingAddressLine,
            buyerShippingAddressLine: buyerShippingAddressLine,
            buyerPhone: buyerPhone,
            buyerTaxId: buyerTaxId,
            requestioner: requestioner,
            shippedVia: shippedVia,
            fobPoint: fobPoint,
            terms: terms,
          },
        }}
      >
        <button
          id="submit"
          className={`${
            orderString === ""
              ? "text-re-gray-text border-1/2 border-re-gray-300"
              : "bg-re-blue-500"
          }  rounded py-1 font-theinhardt-300 text-white text-lg w-full`}
          onClick={() => router.push("/po/pdf")}
        >
          Go to PDF
        </button>
      </Link>
    </form>
  );
}
