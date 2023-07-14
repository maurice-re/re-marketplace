"use client";

import { UploadDropzone } from "@uploadthing/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import ReLogo from "../../components/form/re-logo";
import { OurFileRouter } from "../api/uploadthing/core";

type QuoteProduct = {
  name: string;
  image: string;
};

const products: QuoteProduct[] = [
  { name: "8oz Hot Cup", image: "/images/swapcup_main.png" },
  { name: "12oz Hot Cup", image: "/images/12_swapcup_main.png" },
  { name: "16oz Hot Cup", image: "/images/16_swapcup_main.png" },
  { name: "20oz Cold Cup", image: "/images/coldcup_main.png" },
  { name: "1 L Swapbox", image: "/images/swapbox_main.png" },
  { name: "1.5 L Swapbox", image: "/images/1_5L_swapbox_main.png" },
  { name: "Clamshell", image: "/images/clamshell_main.png" },
];

type QuoteRequest = {
  name: string;
  image: string;
  quantity: number;
  color: string;
  logo: boolean;
};

const colorToName: Record<string, string> = {
  "#D3163B": "Red",
  "#3D5FA0": "Dark Blue",
  "#004645": "Green",
  clear: "Clear",
  "#6C7982": "Base Grey",
  "#A4D5EE": "Light Blue",
};

function ColorPicker({
  index,
  quoteRequests,
  updateRequest,
}: {
  index: number;
  quoteRequests: QuoteRequest[];
  updateRequest: Dispatch<SetStateAction<QuoteRequest[]>>;
}): JSX.Element {
  return (
    <div className="flex w-full flex-col items-center text-base xl:text-lg">
      <div className="mb-2 grid grid-cols-3 gap-1 xl:gap-2">
        <div
          onClick={() => {
            updateRequest((currRequests) => {
              const newRequests = [...currRequests];
              newRequests[index].color = "#D3163B";
              return newRequests;
            });
          }}
          className={`h-6 w-6 rounded bg-[#D3163B] hover:border hover:border-white xl:h-10 xl:w-10 ${
            quoteRequests[index].color == "#D3163B"
              ? "border border-re-green-500"
              : ""
          }`}
        ></div>
        <div
          onClick={() => {
            updateRequest((currRequests) => {
              const newRequests = [...currRequests];
              newRequests[index].color = "#3D5FA0";
              return newRequests;
            });
          }}
          className={`h-6 w-6 rounded bg-[#3D5FA0] hover:border hover:border-white xl:h-10 xl:w-10 ${
            quoteRequests[index].color === "#3D5FA0"
              ? "border border-re-green-500"
              : ""
          }`}
        ></div>
        <div
          onClick={() => {
            updateRequest((currRequests) => {
              const newRequests = [...currRequests];
              newRequests[index].color = "#004645";
              return newRequests;
            });
          }}
          className={`h-6 w-6 rounded bg-[#004645] hover:border hover:border-white xl:h-10 xl:w-10 ${
            quoteRequests[index].color === "#004645"
              ? "border border-re-green-500"
              : ""
          }`}
        ></div>
        <div
          onClick={() => {
            updateRequest((currRequests) => {
              const newRequests = [...currRequests];
              newRequests[index].color = "clear";
              return newRequests;
            });
          }}
          className={`flex h-6 w-6 items-center justify-center rounded border border-black bg-transparent text-xs hover:border hover:border-white xl:h-10 xl:w-10 xl:text-sm ${
            quoteRequests[index].color === "clear" ? "border-re-green-500" : ""
          }`}
        >
          clear
        </div>
        <div
          onClick={() => {
            updateRequest((currRequests) => {
              const newRequests = [...currRequests];
              newRequests[index].color = "#6C7982";
              return newRequests;
            });
          }}
          className={`h-6 w-6 rounded bg-[#6C7982] hover:border hover:border-white xl:h-10 xl:w-10 ${
            quoteRequests[index].color === "#6C7982"
              ? "border border-re-green-500"
              : ""
          }`}
        ></div>
        <div
          onClick={() => {
            updateRequest((currRequests) => {
              const newRequests = [...currRequests];
              newRequests[index].color = "#A4D5EE";
              return newRequests;
            });
          }}
          className={`h-6 w-6 rounded bg-[#A4D5EE] hover:border hover:border-white xl:h-10 xl:w-10 ${
            quoteRequests[index].color === "#A4D5EE"
              ? "border border-re-green-500"
              : ""
          }`}
        ></div>
      </div>
      <input
        className={`w-3/5 rounded bg-re-dark-green-500 py-1 pl-2 text-white`}
        type="text"
        placeholder="Hex Code"
        value={quoteRequests[index].color}
        onChange={(event) => {
          updateRequest((currRequests) => {
            const newRequests = [...currRequests];
            newRequests[index].color = event.target.value;
            return newRequests;
          });
        }}
      />
      {quoteRequests[index].color != "#6C7982" && (
        <p className="mt-1 text-xs text-error">
          MOQ for this color is 3,000 units
        </p>
      )}
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const [quoteRequests, updateRequest] = useState<QuoteRequest[]>(
    products.reduce<QuoteRequest[]>((requests, product) => {
      requests.push({
        name: product.name,
        image: product.image,
        quantity: 0,
        color: "#6C7982",
        logo: false,
      });
      return requests;
    }, [])
  );
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    // Send Email
    let quoteRequested = "";
    console.log(quoteRequests);
    quoteRequests.forEach((request) => {
      const quantity = request.quantity;
      const quantityNumber = quantity;
      console.log(quantityNumber);
      if (quantityNumber > 0) {
        const logo = request.logo ? "with Logo" : "without Logo";
        quoteRequested += `${request.name}, ${quantity} units, color: ${
          colorToName[request.color]
            ? colorToName[request.color]
            : "custom color code: " + request.color
        }, ${logo} \n`;
      }
    });

    await fetch("/api/mail/send-quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: quoteRequested,
        email: email,
      }),
    });

    router.push("/quote/success");
  }

  function minQuantity(quoteReq: QuoteRequest): number {
    if (quoteReq.quantity == 0) {
      return 0;
    } else if (quoteReq.quantity < 3000 && quoteReq.color != "#6C7982") {
      return 3000;
    }
    return 500;
  }
  return (
    <div className="flex h-screen w-full flex-col overflow-auto bg-re-black font-theinhardt text-white">
      <ReLogo />
      <div className="container mx-auto my-10 w-3/5">
        <h1
          className="mb-6 bg-gradient-to-r from-white
        to-[#58FEC467] bg-clip-text text-center text-7xl text-transparent"
        >
          Quotation Request <br /> Form
        </h1>
        <p className="text-center text-2xl text-white">
          Once this form is submitted we will generate your quote and <br />{" "}
          email it directly to you. Shipping logistics will be organized <br />{" "}
          separately, we will reach out to you for that information
        </p>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="border-re-grey-300 m-1 mx-auto w-11/12 rounded-lg xl:w-4/5">
          <table className="w-full">
            <thead>
              <tr className="bg-re-dark-green-500 text-base xl:text-lg">
                <th className="py-3">Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Color</th>
                <th>Customization</th>
                <th>Logo File (optional)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-re-gray-300">
              {quoteRequests.map((request, index) => {
                return (
                  <tr
                    key={request.name}
                    className="divide-x divide-re-gray-300 text-center text-base odd:bg-re-table-odd even:bg-re-table-even xl:text-lg"
                  >
                    <td>
                      <Image
                        src={request.image}
                        alt={request.name}
                        width={120}
                        height={120}
                        className="mx-auto bg-white"
                      />
                    </td>
                    <td className="px-2">{request.name}</td>
                    <td>
                      <input
                        className="w-24 rounded bg-re-dark-green-500 py-1 pl-2 text-white"
                        type="number"
                        value={parseInt("" + request.quantity)}
                        min={minQuantity(request)}
                        onChange={(event) => {
                          updateRequest((currRequest) => {
                            const newRequests = [...currRequest];
                            newRequests[index] = {
                              ...newRequests[index],
                              quantity:
                                event.target.value == ""
                                  ? 0
                                  : parseInt(event.target.value, 10),
                            };
                            return newRequests;
                          });
                        }}
                      />
                    </td>
                    <td className="py-2">
                      <ColorPicker
                        index={index}
                        quoteRequests={quoteRequests}
                        updateRequest={updateRequest}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="mr-2 bg-re-dark-green-500"
                        value={request.logo ? 1 : 0}
                        onChange={(event) => {
                          updateRequest((currRequest) => {
                            const index = currRequest.findIndex(
                              (curr) => curr.name === request.name
                            );
                            if (index < 0) return currRequest;
                            const newRequests = [...currRequest];
                            newRequests[index] = {
                              ...newRequests[index],
                              logo: event.target.checked,
                            };
                            return newRequests;
                          });
                        }}
                      />
                      <label>Logo (pad printing)</label>
                    </td>
                    <td className="flex items-center justify-center">
                      <div className=" w-min text-sm">
                        <UploadDropzone<OurFileRouter> endpoint="blobUploader" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mx-auto my-10 flex w-3/5 justify-between text-xl">
          <input
            className="w-3/5 rounded border border-re-gray-300 bg-re-dark-green-500 py-2 pl-4 text-white"
            value={email}
            type="text"
            placeholder="Email(s) for quote to be sent to"
            required
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <button
            className="flex w-1/5 items-center justify-center rounded-md bg-re-purple-500 disabled:bg-re-gray-300"
            disabled={quoteRequests.every(
              (request) => request.quantity === 0 || isNaN(request.quantity)
            )}
          >
            Submit
            {loading && (
              <span className="loading loading-spinner loading-xs ml-4"></span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
