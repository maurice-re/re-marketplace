"use client";

import { UploadDropzone } from "@uploadthing/react";
import Image from "next/image";
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
];

const indexToName: Record<number, string> = {
  0: "8oz Hot Cup",
  4: "12oz Hot Cup",
  8: "16oz Hot Cup",
  12: "20oz Cold Cup",
  16: "1 L Swapbox",
  20: "1.5 L Swapbox",
};

function ColorPicker() {
  const [selectedColor, changeColor] = useState<string>("#6C7982");

  return (
    <div className="flex w-full flex-col items-center text-base xl:text-lg">
      <div className="mb-2 grid grid-cols-3 gap-1 xl:gap-2">
        <div
          onClick={() => {
            changeColor("#D3163B");
          }}
          className={`h-6 w-6 rounded bg-[#D3163B] hover:border hover:border-white xl:h-10 xl:w-10 ${
            selectedColor == "#D3163B" ? "border border-re-green-500" : ""
          }`}
        ></div>
        <div
          onClick={() => {
            changeColor("#3D5FA0");
          }}
          className={`h-6 w-6 rounded bg-[#3D5FA0] hover:border hover:border-white xl:h-10 xl:w-10 ${
            selectedColor === "#3D5FA0" ? "border border-re-green-500" : ""
          }`}
        ></div>
        <div
          onClick={() => {
            changeColor("#004645");
          }}
          className={`h-6 w-6 rounded bg-[#004645] hover:border hover:border-white xl:h-10 xl:w-10 ${
            selectedColor === "#004645" ? "border border-re-green-500" : ""
          }`}
        ></div>
        <div
          onClick={() => {
            changeColor("clear");
          }}
          className={`flex h-6 w-6 items-center justify-center rounded border border-black bg-transparent text-xs hover:border hover:border-white xl:h-10 xl:w-10 xl:text-sm ${
            selectedColor === "clear" ? "border-re-green-500" : ""
          }`}
        >
          clear
        </div>
        <div
          onClick={() => {
            changeColor("#6C7982");
          }}
          className={`h-6 w-6 rounded bg-[#6C7982] hover:border hover:border-white xl:h-10 xl:w-10 ${
            selectedColor === "#6C7982" ? "border border-re-green-500" : ""
          }`}
        ></div>
        <div
          onClick={() => {
            changeColor("#A4D5EE");
          }}
          className={`h-6 w-6 rounded bg-[#A4D5EE] hover:border hover:border-white xl:h-10 xl:w-10 ${
            selectedColor === "#A4D5EE" ? "border border-re-green-500" : ""
          }`}
        ></div>
      </div>
      <input
        className={`w-3/5 rounded bg-re-dark-green-500 py-1 pl-2 text-white`}
        type="text"
        placeholder="Hex Code"
        value={selectedColor}
        onChange={(event) => {
          changeColor(event.target.value);
        }}
      />
    </div>
  );
}

export default function Page() {
  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElements = (event.target as any).elements as HTMLInputElement[];
    console.log(formElements);
    const quantityIndexes = [0, 4, 8, 12, 16, 20];
    let quoteRequested = "";
    for (let i = 0; i < quantityIndexes.length; i++) {
      let quantity = formElements[quantityIndexes[i]].value;
      quantity = quantity.replace(",", "");
      const quantityNumber = parseInt(quantity);
      console.log(quantityNumber);
      if (isNaN(quantityNumber)) {
        continue;
      } else if (quantityNumber <= 0) {
        continue;
      } else {
        const name = indexToName[quantityIndexes[i]];
        const quantity = quantityNumber;
        const color = formElements[quantityIndexes[i] + 1].value;
        const logo = formElements[quantityIndexes[i] + 2].checked
          ? "with Logo"
          : "without Logo";
        quoteRequested += `${name}, ${quantity} units, color code: ${color}, ${logo} \n`;
      }
    }

    await fetch("/api/mail/send-quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: quoteRequested,
        email: formElements[24].value,
      }),
    });
    console.log("sent");
  }
  return (
    <div className="flex h-screen w-full flex-col overflow-auto bg-re-black font-theinhardt text-white">
      <ReLogo />
      <div className="container mx-auto my-10 w-1/2">
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
              {products.map((product) => {
                return (
                  <tr
                    key={product.name}
                    className="divide-x divide-re-gray-300 text-center text-base odd:bg-re-table-odd even:bg-re-table-even xl:text-lg"
                  >
                    <td>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="p-2"
                      />
                    </td>
                    <td className="px-2">{product.name}</td>
                    <td>
                      <input
                        className="w-24 rounded bg-re-dark-green-500 py-1 pl-2 text-white"
                        type="text"
                        placeholder="0"
                        onInput={(event) => {
                          const inputElement = event.target as HTMLInputElement;
                          const value = inputElement.value;
                          // Remove existing commas from the value
                          const sanitizedValue = value.replace(/,/g, "");
                          // Convert the sanitized value to a number
                          const numberValue = Number(sanitizedValue);
                          // Check if the number is valid
                          if (!isNaN(numberValue)) {
                            // Format the number with commas
                            const formattedValue = numberValue.toLocaleString();
                            // Set the formatted value back to the input
                            inputElement.value = formattedValue;
                          }
                        }}
                      />
                    </td>
                    <td className="py-2">
                      <ColorPicker />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="mr-2 bg-re-dark-green-500"
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
            type="text"
            placeholder="Email(s) for quote to be sent to"
            required
          />
          <button className="w-1/5 rounded-md bg-re-purple-500">Submit</button>
        </div>
      </form>
    </div>
  );
}
