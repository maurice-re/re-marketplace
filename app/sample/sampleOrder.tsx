"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SkuProduct } from "../../utils/dashboard/dashboardUtils"; // TODO(Suhana): Stop using dashboardUtils for sample

function Sample({ skus }: { skus: SkuProduct[] }) {
  const [selected, setSelected] = useState(new Set<string>());
  const [info, setInfo] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function requestSamples(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/sample", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        info: info,
        quantity: selected.size,
        skuIds: Array.from(selected).join(", "),
      }),
    });
    if (res.status === 200) {
      router.replace("/sample/success");
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full justify-start items-center h-full gap-8 pb-6">
      <div className="columns-2 gap-8 w-3/4 xl:w-3/5">
        {skus.map((sku, index) => (
          <div
            className={`flex bg-re-dark-green-300 border-2 rounded-md mb-3 hover:border-re-green-500 active:border-re-green-700 cursor-pointer ${
              selected.has(sku.id)
                ? "border-re-green-700"
                : "border-re-gray-300"
            }`}
            key={sku.id}
            onClick={() => {
              if (selected.has(sku.id)) {
                selected.delete(sku.id);
                setSelected(new Set(selected));
              } else {
                selected.add(sku.id);
                setSelected(new Set(selected));
              }
            }}
          >
            <Image
              src={sku.mainImage}
              alt={"Image of Sku"}
              height={880}
              width={880}
              className={`rounded-md w-32 p-1 hover:w-1/2 hover:absolute hover:top-10 ${
                index > 2 ? "hover:left-0" : "hover:right-0"
              }`}
            />
            <div className="flex flex-col justify-evenly items-start py-1 px-4">
              <div className="text-white text-base">
                {sku.size} {sku.product.name}
              </div>
              <div>
                <div className="text-re-gray-text text-sm ">
                  Material: {sku.material}
                </div>
                <div className="text-re-gray-text text-sm ">
                  Color : {sku.color[0].toUpperCase()}
                  {sku.color.slice(1)}
                </div>
              </div>
              <div className="text-sm">{sku.product.description}</div>
            </div>
          </div>
        ))}
      </div>
      <form
        className="flex flex-col w-full gap-8 items-center"
        onSubmit={requestSamples}
      >
        <div className=" w-1/2 flex flex-col justify-center">
          <div className="bg-re-dark-green-300 border border-re-gray-300 rounded-md flex flex-col">
            <div className="flex">
              <input
                type={"text"}
                placeholder={"First Name"}
                required
                className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
                onChange={(e) => {
                  setInfo({ ...info, firstName: e.target.value });
                }}
              />
              <div className="w-px h-full bg-re-gray-300" />
              <input
                type={"text"}
                placeholder={"Last Name"}
                required
                className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
                onChange={(e) => {
                  setInfo({ ...info, lastName: e.target.value });
                }}
              />
            </div>
            <div className="h-px bg-re-gray-300 w-full"></div>
            <div className="flex">
              <input
                type={"email"}
                placeholder={"Email"}
                required
                className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
                onChange={(e) => {
                  setInfo({ ...info, email: e.target.value });
                }}
              />
              <div className="w-px h-full bg-re-gray-300" />
              <input
                type={"tel"}
                placeholder={"Phone Number"}
                required
                className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
                onChange={(e) => {
                  setInfo({ ...info, phoneNumber: e.target.value });
                }}
              />
            </div>
            <div className="h-px bg-re-gray-300 w-full"></div>
            <input
              type={"text"}
              placeholder={"Company"}
              required
              className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
              onChange={(e) => {
                setInfo({ ...info, company: e.target.value });
              }}
            />
            <div className="h-px bg-re-gray-300 w-full"></div>
            <input
              type={"text"}
              placeholder={"Country"}
              required
              className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
              onChange={(e) => {
                setInfo({ ...info, country: e.target.value });
              }}
            />
            <div className="h-px bg-re-gray-300 w-full"></div>
            <input
              type={"text"}
              placeholder={"Address Line 1"}
              required
              className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
              onChange={(e) => {
                setInfo({ ...info, line1: e.target.value });
              }}
            />
            <div className="h-px bg-re-gray-300 w-full"></div>
            <input
              type={"text"}
              placeholder={"Address Line 2"}
              required
              className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
              onChange={(e) => {
                setInfo({ ...info, line2: e.target.value });
              }}
            />
            <div className="h-px bg-re-gray-300 w-full"></div>

            <div className="flex">
              <input
                type={"text"}
                placeholder={"City"}
                required
                className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
                onChange={(e) => {
                  setInfo({ ...info, city: e.target.value });
                }}
              />
              <div className="w-px h-full bg-re-gray-300" />
              <input
                type={"text"}
                placeholder={"State"}
                required
                className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
                onChange={(e) => {
                  setInfo({ ...info, state: e.target.value });
                }}
              />
              <div className="w-px h-full bg-re-gray-300" />
              <input
                type={"text"}
                placeholder={"Zip"}
                required
                className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
                onChange={(e) => {
                  setInfo({ ...info, zip: e.target.value });
                }}
              />
            </div>
          </div>
        </div>
        {loading ? (
          <svg
            aria-hidden="true"
            className="mr-2 w-8 h-8 text-re-purple-400 animate-spin fill-re-dark-green-300"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        ) : (
          <button
            className=" w-1/5 py-2 bg-re-purple-400 rounded text-white hover:bg-re-purple-600 disabled:bg-re-gray-text cursor-pointer mb-5"
            disabled={selected.size == 0}
            type={"submit"}
          >
            Request Samples
          </button>
        )}
      </form>
    </div>
  );
}

export default Sample;
