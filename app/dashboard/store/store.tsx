"use client";

import { Company, Location, LocationType, Product, Sku } from "@prisma/client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import AddressField from "../../../components/form/address-field";
import DoubleAddressField from "../../../components/form/double-address-field";
import { useCartStore } from "../../../stores/cartStore";
import { LocationWithOneItem } from "../../../utils/dashboard/dashboardUtils";
import { getPriceFromTable } from "../../../utils/prisma/dbUtils";
import Cart from "./cart";

type StoreProps = {
  company: Company;
  initialLocations: LocationWithOneItem[];
  products: Product[];
  skus: Sku[];
};

type BreadcrumbsInfo = {
  step: string;
  title: string;
  passed: boolean;
};

const breadcrumbsInfo: BreadcrumbsInfo[] = [
  {
    step: "1",
    title: "Choose the location",
    passed: true,
  },
  {
    step: "2",
    title: "Choose your product",
    passed: true,
  },
  {
    step: "3",
    title: "Set properties",
    passed: false,
  },
];

export default function StorePage({
  company,
  initialLocations,
  products,
  skus,
}: StoreProps) {
  const [locations, setLocations] = useState(initialLocations);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [locationId, setLocationId] = useState<string | undefined>(undefined);
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [skuId, setSkuId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<string>("");

  const addToCart = useCartStore((state) => state.addToCart);

  function changeSize(newSize: string) {
    if (skuId == undefined) {
      return;
    }

    const [pId, size, mShort, color] = skuId.split("-");
    if (size == newSize.split("-")[0]) {
      return;
    }

    setSkuId(pId + "-" + newSize.split(" ")[0] + "-" + mShort + "-" + color);
  }

  function changeColor(newColor: string) {
    if (skuId == undefined) {
      return;
    }

    const [pId, size, mShort, color] = skuId.split("-");
    if (color == newColor.toUpperCase()) {
      return;
    }

    setSkuId(pId + "-" + size + "-" + mShort + "-" + newColor.toUpperCase());
  }

  function getLocationById(
    locationId: string
  ): LocationWithOneItem | undefined {
    return locations.find((location) => location.id === locationId);
  }

  function getLocationName(locationId: string): string {
    const location: LocationWithOneItem | undefined =
      getLocationById(locationId);
    return location?.displayName ?? location?.city ?? "Your Location";
  }

  function handleAddToCart() {
    if (locationId == undefined || skuId == undefined || quantity == "") {
      return;
    }
    addToCart(locationId, skuId + "~" + quantity);
  }

  const handleAddLocation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElements = (e.target as any).elements as HTMLInputElement[];
    setIsLoading(true);

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
      tagId: "",
    };

    await fetch("/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: newLocation }),
    }).then(async (res) => await res.json());

    const results = await fetch(
      `/api/location?companyId=${company.id}&withItems=true`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    ).then(async (res) => await res.json());
    setLocations(results.locations as LocationWithOneItem[]);
    setIsLoading(false);
    document.getElementById("newLocation-modal")?.click();
  };

  if (locationId === undefined) {
    const locationCards = locations.map((location) => (
      <div
        key={location.id}
        className="bg-re-dark-green-300 h-24 rounded-md border-re-gray-300 border-1/2 shadow-xl font-theinhardt justify-center hover:bg-re-dark-green-200 cursor-pointer"
        onClick={() => setLocationId(location.id)}
      >
        <div className="flex flex-col items-start justify-center p-4">
          <div className="w-full items-center justify-between flex">
            <h2 className="text-left text-lg leading-none text-white">
              {location.displayName ?? location.city}
            </h2>
            {location.orderItems.length != 0 && (
              <div className="rounded-2xl px-2 bg-re-product-green border-re-product-green">
                <div className="flex items-center text-sm font-theinhardt-300 w-full gap-1">
                  <div className="text-gray-200">
                    {"Last ordered: " +
                      new Date(
                        location.orderItems[0].createdAt
                      ).toLocaleDateString("en-us", {
                        day: "numeric",
                        month: "short",
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col w-full re-gray-100 font-theinhardt-300 text-sm mt-1">
            <h2>{location.line1}</h2>
            <h2 className="leading-none">
              {location.city + ", " + location.country + ", " + location.zip}
            </h2>
          </div>
        </div>
      </div>
    ));

    breadcrumbsInfo[0].passed = true;
    breadcrumbsInfo[1].passed = false;
    breadcrumbsInfo[2].passed = false;
    const breadcrumbs = breadcrumbsInfo.map((info) => (
      <div
        className={`w-1/${breadcrumbsInfo.length} flex flex-col py-2`}
        key={"location" + info.step}
      >
        <div
          className={`h-0.5 ${info.passed ? "bg-re-green-500" : "bg-re-gray-300"
            } mb-2 w-full`}
        />
        <div className="w-full flex items-center justify-start mt-1">
          <h2 className="font-theinhardt-300 text-re-green-500 mr-1">
            Step {info.step}:
          </h2>
          <h2 className=" font-theinhardt-300 text-white">{info.title}</h2>
        </div>
      </div>
    ));

    return (
      <div className="h-screen bg-black flex">
        {/* <head>
          <title>Store</title>
          <meta name="store" content="shop for products" />
          <link rel="icon" href="/favicon.ico" />
        </head> */}
        <input
          type="checkbox"
          id="newLocation-modal"
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add a new location</h3>
            <form id="add-location-form" onSubmit={handleAddLocation}>
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
              <div className="modal-action flex">
                <button
                  className="btn btn-outline btn-error"
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    document.getElementById("newLocation-modal")?.click()
                  }
                >
                  Close
                </button>
                <button
                  className={`btn btn-outline btn-accent ${loading ? "loading" : ""
                    }`}
                  type="submit"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
        <main className="flex flex-col w-full h-full overflow-y-auto font-theinhardt">
          {/* <div className="flex mt-4 py-4 pl-6 text-white border-y-1/2 border-re-gray-300">
            <h1 className="font-theinhardt text-lg">Shop</h1>
          </div> */}
          <div className="flex h-full justify-between overflow-hidden">
            <div className="flex flex-col w-full">
              <div className="w-full flex gap-6 items-center py-4 px-6 ">
                {breadcrumbs}
              </div>
              <div className="flex py-4 pl-6 text-white border-y-1/2 border-re-gray-300">
                <h1 className="font-theinhardt text-lg">Locations</h1>
              </div>
              <div className="bg-re-dark-green-500 h-full pt-4">
                <div className="mt-2 px-2 grid grid-cols-3 gap-4 py-1 mx-4 items-start justify-start ">
                  {locationCards}
                  <div
                    key={"new"}
                    className="bg-re-dark-green-300 h-24 flex gap-1 rounded-md border-re-gray-300 border-1/2 shadow-xl font-theinhardt justify-center items-center hover:bg-re-dark-green-200 cursor-pointer"
                    onClick={() =>
                      document.getElementById("newLocation-modal")?.click()
                    }
                  >
                    <h2 className="text-lg leading-none text-white">
                      {"Add new location"}
                    </h2>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2.25C8.27344 2.25 5.25 5.12766 5.25 8.67188C5.25 12.75 9.75 19.2127 11.4023 21.4448C11.4709 21.5391 11.5608 21.6157 11.6647 21.6686C11.7686 21.7215 11.8835 21.749 12 21.749C12.1165 21.749 12.2314 21.7215 12.3353 21.6686C12.4392 21.6157 12.5291 21.5391 12.5977 21.4448C14.25 19.2136 18.75 12.7533 18.75 8.67188C18.75 5.12766 15.7266 2.25 12 2.25Z"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 11.25C13.2426 11.25 14.25 10.2426 14.25 9C14.25 7.75736 13.2426 6.75 12 6.75C10.7574 6.75 9.75 7.75736 9.75 9C9.75 10.2426 10.7574 11.25 12 11.25Z"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <Cart companyId={company.id} locations={locations} skus={skus} />
          </div>
        </main>
      </div>
    );
  }

  if (locationId != undefined && productId == undefined) {
    const productCards = products
      .filter((product) => product.active)
      .map((product) => (
        <div
          key={product.id}
          className="w-full rounded-b-md justify-center cursor-pointer"
          onClick={() => {
            setSkuId(skus.find((sku) => sku.productId == product.id)?.id);
            setProductId(product.id);
          }}
        >
          <figure className="rounded-t-md overflow-hidden">
            <Image
              src={product.mainImage}
              alt={product.name}
              height={350}
              width={400}
            />
          </figure>
          <div className="p-3 flex w-full items-end justify-between border-b-1/2 bg-re-dark-green-300 hover:bg-re-dark-green-200 border-re-gray-300 border-x-1/2 rounded-b-md">
            <div className="w-5/6">
              <h3 className="text-white text-lg leading-none">
                {product.name}
              </h3>
              <h3 className="mt-2 leading-none text-re-gray-100">
                {product.materials}
              </h3>
              <h3 className="mt-1 leading-none text-re-gray-100">
                {product.sizes.split(", ").join(" | ")}
              </h3>
            </div>
            <div className="w-1/6 flex justify-end">
              {" "}
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 12C21 7.03125 16.9688 3 12 3C7.03125 3 3 7.03125 3 12C3 16.9688 7.03125 21 12 21C16.9688 21 21 16.9688 21 12Z"
                  stroke="white"
                  strokeMiterlimit="10"
                />
                <path
                  d="M12 8.25V15.75M15.75 12H8.25"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      ));

    breadcrumbsInfo[0].passed = true;
    breadcrumbsInfo[1].passed = true;
    breadcrumbsInfo[2].passed = false;

    // TODO(Suhana): DRY breadcrumbs
    const breadcrumbs = breadcrumbsInfo.map((info) => (
      <div
        className={`w-1/${breadcrumbsInfo.length} flex flex-col py-2`}
        key={"sku" + info.step}
      >
        <div
          className={`h-0.5 ${info.passed ? "bg-re-green-500" : "bg-re-gray-300"
            } mb-2 w-full`}
        />
        <div className="w-full flex items-center justify-start mt-1">
          <h2 className="font-theinhardt-300 text-re-green-500 mr-1">
            Step {info.step}:
          </h2>
          <h2 className=" font-theinhardt-300 text-white">{info.title}</h2>
        </div>
      </div>
    ));

    return (
      <div className="h-screen bg-black flex">
        {/* <head>
        <title>Store</title>
        <meta name="store" content="shop for products" />
        <link rel="icon" href="/favicon.ico" />
      </head> */}
        <main className="flex flex-col w-full h-full overflow-y-auto font-theinhardt-300">
          {/* <div className="flex mt-4 py-4 pl-6 text-white border-y-1/2 border-re-gray-300">
            <h1 className="font-theinhardt text-lg">Shop</h1>
          </div> */}
          <div className="flex h-full justify-between overflow-hidden">
            <div className="flex flex-col w-full">
              <div className="w-full flex gap-6 items-center py-4 px-6 ">
                {breadcrumbs}
              </div>
              <div className="flex py-4 pl-6 text-white border-y-1/2 border-re-gray-300 items-center justify-start gap-2">
                <button
                  onClick={() => {
                    setLocationId(undefined);
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.4598 5.10577L8.56554 12.0001L15.4598 18.8944C15.7527 19.1872 15.7527 19.6621 15.4598 19.955C15.1669 20.2479 14.6921 20.2479 14.3992 19.955L6.97455 12.5304C6.8339 12.3897 6.75488 12.199 6.75488 12.0001C6.75488 11.8011 6.8339 11.6104 6.97455 11.4697L14.3992 4.04511C14.4358 4.0085 14.4752 3.97646 14.5168 3.949C14.8079 3.75679 15.2035 3.78883 15.4598 4.04511C15.7527 4.338 15.7527 4.81288 15.4598 5.10577Z"
                      fill="white"
                    />
                  </svg>
                </button>
                <h1 className="font-theinhardt text-lg">
                  Locations / {getLocationName(locationId)}
                </h1>
              </div>
              <div className="bg-re-dark-green-500 h-full">
                <div className="mt-6 grid grid-cols-4 gap-6 py-1 items-start justify-start px-6">
                  {productCards}
                </div>
              </div>
            </div>
            <Cart companyId={company.id} locations={locations} skus={skus} />
          </div>
        </main>
      </div>
    );
  }

  if (locationId != undefined && productId != undefined) {
    const product = products.find((product) => product.id === productId)!;
    const sku = skus.find((sku) => sku.id === skuId)!;
    const sizes = product.sizes.split(", ");
    const materials = product.materials.split(", ");
    const colors = product.colors.split(", ");
    console.log(colors);

    breadcrumbsInfo[0].passed = true;
    breadcrumbsInfo[1].passed = true;
    breadcrumbsInfo[2].passed = true;

    const breadcrumbs = breadcrumbsInfo.map((info) => (
      <div
        className={`w-1/${breadcrumbsInfo.length} flex flex-col py-2`}
        key={"product" + info.step}
      >
        <div
          className={`h-0.5 ${info.passed ? "bg-re-green-500" : "bg-re-gray-300"
            } mb-2 w-full`}
        />
        <div className="w-full flex items-center justify-start mt-1">
          <h2 className="font-theinhardt-300 text-re-green-500 mr-1">
            Step {info.step}:
          </h2>
          <h2 className=" font-theinhardt-300 text-white">{info.title}</h2>
        </div>
      </div>
    ));

    return (
      <div className="h-screen bg-black flex">
        <main className="flex flex-col w-full h-full overflow-y-auto font-theinhardt">
          {/* <div className="flex mt-4 py-4 pl-6 text-white border-y-1/2 border-re-gray-300">
            <h1 className="font-theinhardt text-lg">Shop</h1>
          </div> */}
          <div className="flex h-full justify-between overflow-hidden">
            <div className="flex flex-col w-full">
              <div className="w-full flex gap-6 items-center py-4 px-6 ">
                {breadcrumbs}
              </div>
              <div className="flex py-4 pl-6 text-white border-y-1/2 border-re-gray-300 items-center justify-start gap-2">
                <button
                  onClick={() => {
                    setProductId(undefined);
                    setQuantity("");
                    setSkuId(undefined);
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.4598 5.10577L8.56554 12.0001L15.4598 18.8944C15.7527 19.1872 15.7527 19.6621 15.4598 19.955C15.1669 20.2479 14.6921 20.2479 14.3992 19.955L6.97455 12.5304C6.8339 12.3897 6.75488 12.199 6.75488 12.0001C6.75488 11.8011 6.8339 11.6104 6.97455 11.4697L14.3992 4.04511C14.4358 4.0085 14.4752 3.97646 14.5168 3.949C14.8079 3.75679 15.2035 3.78883 15.4598 4.04511C15.7527 4.338 15.7527 4.81288 15.4598 5.10577Z"
                      fill="white"
                    />
                  </svg>
                </button>
                <h1 className="font-theinhardt text-lg">
                  Locations / {getLocationName(locationId)} / {product.name}
                </h1>
              </div>
              <div className="bg-re-dark-green-500 h-full font-theinhardt overflow-y-auto">
                <div className=" bg-opacity-70 rounded-10 my-4 px-4 pt-4 items-stretch flex flex-col mx-4 h-96">
                  <div className="flex w-full px-24 gap-16 pb-8">
                    <div className="flex flex-col w-1/2">
                      <h1 className="text-3xl text-left text-white">
                        {product.name}
                      </h1>
                      <h2 className="text-white text-lg my-4">
                        {`$${getPriceFromTable(
                          sku.priceTable,
                          quantity == "" ? 1 : quantity
                        )}`}
                      </h2>
                      <div className="flex gap-2 text-white text-md items-center">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask id="path-1-inside-1_162_5337" fill="white">
                            <path d="M10.4984 3.3054C10.6453 3.1594 10.646 2.92196 10.5 2.77507C10.4818 2.75671 10.4621 2.74063 10.4414 2.72684C10.3928 2.69455 10.3383 2.67478 10.2825 2.66756C10.2549 2.66398 10.227 2.66347 10.1993 2.66604C10.1156 2.67379 10.034 2.70959 9.96975 2.77346L4.48862 8.22141L2.0304 5.77926C1.88348 5.63331 1.64604 5.63411 1.50008 5.78101C1.35411 5.92796 1.35489 6.16541 1.50182 6.31136L4.2244 9.01611C4.37067 9.16141 4.60681 9.16141 4.75305 9.01606L10.4984 3.3054Z" />
                          </mask>
                          <path
                            d="M10.4984 3.3054C10.6453 3.1594 10.646 2.92196 10.5 2.77507C10.4818 2.75671 10.4621 2.74063 10.4414 2.72684C10.3928 2.69455 10.3383 2.67478 10.2825 2.66756C10.2549 2.66398 10.227 2.66347 10.1993 2.66604C10.1156 2.67379 10.034 2.70959 9.96975 2.77346L4.48862 8.22141L2.0304 5.77926C1.88348 5.63331 1.64604 5.63411 1.50008 5.78101C1.35411 5.92796 1.35489 6.16541 1.50182 6.31136L4.2244 9.01611C4.37067 9.16141 4.60681 9.16141 4.75305 9.01606L10.4984 3.3054Z"
                            fill="black"
                          />
                          <path
                            d="M10.4984 3.3054L9.91101 2.71433L9.91098 2.71436L10.4984 3.3054ZM10.5 2.77507L9.90895 3.36247L9.90901 3.36253L10.5 2.77507ZM10.4414 2.72684L10.9026 2.0328L10.9026 2.03277L10.4414 2.72684ZM10.2825 2.66756L10.1754 3.49397L10.1755 3.49399L10.2825 2.66756ZM10.1993 2.66604L10.1225 1.83625L10.1224 1.83626L10.1993 2.66604ZM9.96975 2.77346L10.5572 3.3645L10.5573 3.36444L9.96975 2.77346ZM4.48862 8.22141L3.9013 8.8126L4.48877 9.39622L5.07609 8.81245L4.48862 8.22141ZM2.0304 5.77926L2.61772 5.18808L2.61769 5.18805L2.0304 5.77926ZM1.50008 5.78101L0.908945 5.19364L0.908845 5.19374L1.50008 5.78101ZM1.50182 6.31136L2.08914 5.72017L2.08911 5.72015L1.50182 6.31136ZM4.2244 9.01611L3.63708 9.6073L3.63711 9.60732L4.2244 9.01611ZM4.75305 9.01606L5.34051 9.6071L5.34052 9.6071L4.75305 9.01606ZM11.0859 3.89646C11.5593 3.42595 11.5615 2.66086 11.0911 2.18761L9.90901 3.36253C9.73062 3.18306 9.73139 2.89284 9.91101 2.71433L11.0859 3.89646ZM11.0912 2.18767C11.0333 2.12949 10.9702 2.07769 10.9026 2.0328L9.98015 3.42088C9.95411 3.40358 9.93025 3.38392 9.90895 3.36247L11.0912 2.18767ZM10.9026 2.03277C10.7451 1.92809 10.5689 1.86434 10.3896 1.84112L10.1755 3.49399C10.1078 3.48522 10.0405 3.461 9.98019 3.42091L10.9026 2.03277ZM10.3897 1.84115C10.301 1.82963 10.2113 1.82803 10.1225 1.83625L10.2761 3.49582C10.2427 3.49892 10.2089 3.49832 10.1754 3.49397L10.3897 1.84115ZM10.1224 1.83626C9.8531 1.86121 9.5888 1.97711 9.38222 2.18248L10.5573 3.36444C10.4792 3.44206 10.3781 3.48637 10.2762 3.49581L10.1224 1.83626ZM9.38229 2.18242L3.90116 7.63037L5.07609 8.81245L10.5572 3.3645L9.38229 2.18242ZM5.07594 7.63023L2.61772 5.18808L1.44308 6.37045L3.9013 8.8126L5.07594 7.63023ZM2.61769 5.18805C2.14422 4.71771 1.37921 4.72036 0.908945 5.19364L2.09121 6.36838C1.91288 6.54786 1.62274 6.54891 1.44311 6.37048L2.61769 5.18805ZM0.908845 5.19374C0.438618 5.66714 0.441021 6.43221 0.914528 6.90258L2.08911 5.72015C2.26877 5.89861 2.26961 6.18878 2.09131 6.36828L0.908845 5.19374ZM0.914502 6.90255L3.63708 9.6073L4.81172 8.42492L2.08914 5.72017L0.914502 6.90255ZM3.63711 9.60732C4.10834 10.0754 4.86923 10.0755 5.34051 9.6071L4.16558 8.42502C4.34439 8.24729 4.633 8.24739 4.81169 8.4249L3.63711 9.60732ZM5.34052 9.6071L11.0859 3.89644L9.91098 2.71436L4.16558 8.42502L5.34052 9.6071Z"
                            fill="#58FEC4"
                            mask="url(#path-1-inside-1_162_5337)"
                          />
                        </svg>
                        <h2>In stock and ready to ship</h2>
                      </div>
                      <h2 className="text-white text-lg mt-4 mb-2">
                        Description
                      </h2>
                      <h2 className="text-re-gray-100 text-lg leading-tight">
                        {product.description && product.description !== ""
                          ? product.description
                          : "A carefully-crafted product available in various colours and sizes. Leak-proof and sustainably-sourced to help you fulfill all your packaging needs responsibly."}
                      </h2>
                      <h2 className="text-white text-lg mt-4 mb-3">Size</h2>
                      <div className="grid grid-cols-2 gap-4 items-start justify-start text-white text-md">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            className={`border-1/2 h-20 rounded-md bg-re-dark-green-300 ${sku.size == size
                              ? "border-re-green-500"
                              : "border-re-gray-300"
                              }`}
                            onClick={() => changeSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      <h2 className="text-white text-lg my-4">Color</h2>
                      <div className="flex gap-2">
                        {colors.map((color) => (
                          <button
                            key={color}
                            className={`rounded-full w-8 h-8 border-1/2 mr-2 ${color === "green"
                              ? "bg-re-product-green"
                              : "bg-re-product-gray"
                              } ${sku.color == color
                                ? "border-white"
                                : "border-none"
                              }`}
                            onClick={() => changeColor(color)}
                          ></button>
                        ))}
                      </div>
                      <h2 className="text-white text-lg mt-4 mb-3">Material</h2>
                      <div className="flex flex-col text-white text-md">
                        {materials.map((material) => (
                          <button
                            key={material}
                            className={`border-1/2 h-12 rounded-md bg-re-dark-green-300 ${sku.material == material
                              ? "border-re-green-500"
                              : "border-re-gray-300"
                              }`}
                          >
                            {material}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col w-1/2">
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="rounded-md"
                      />
                      <div className="flex  items-center justify-center mt-4 font-theinhardt-300 text-md text-white">
                        <div className="flex py-2 w-1/5 rounded-l-md justify-center h-full items-center border-re-blue border-1/2">
                          <input
                            type="number"
                            placeholder="0"
                            className="input w-full pr-1 items-center h-full text-center bg-black focus:outline-none"
                            required
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                        </div>
                        <button
                          className="bg-re-blue border-re-blue border-1/2 w-4/5 h-full rounded-r-md text-lg"
                          onClick={handleAddToCart}
                          disabled={quantity === ""}
                        >
                          Add to cart
                        </button>
                      </div>
                      <div className="flex gap-2 text-white text-md items-center justify-center mt-6">
                        <svg
                          width="20"
                          height="13"
                          viewBox="0 0 20 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.00487 2.06073L2.81554 5.25H13.0049C16.7328 5.25 19.7549 8.2721 19.7549 12V12.25C19.7549 12.6642 19.4191 13 19.0049 13C18.5907 13 18.2549 12.6642 18.2549 12.25V12C18.2549 9.1005 15.9044 6.75 13.0049 6.75H2.81554L6.00487 9.9394C6.04148 9.976 6.07351 10.0155 6.10097 10.057C6.29318 10.3482 6.26115 10.7438 6.00487 11C5.71197 11.2929 5.2371 11.2929 4.94421 11L0.47455 6.5304C0.18166 6.2375 0.18166 5.7626 0.47455 5.4697L4.94421 1.00007C5.2371 0.707171 5.71197 0.707171 6.00487 1.00007C6.29776 1.29296 6.29776 1.76783 6.00487 2.06073Z"
                            fill="#58FEC4"
                          />
                        </svg>
                        <div className="flex">
                          <h2>Shop more</h2>
                          <button
                            onClick={() => {
                              setProductId(undefined);
                              setQuantity("");
                              setSkuId(undefined);
                            }}
                            className="decoration-re-green-300 decoration-1 underline underline-offset-2 mx-1"
                          >
                            products
                          </button>
                          <h2>or</h2>
                          <button
                            className="ml-1 decoration-re-green-300 decoration-1 underline underline-offset-2"
                            onClick={() => {
                              setLocationId(undefined);
                            }}
                          >
                            locations
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 text-white text-md items-center justify-center mt-1">
                        <h2>or go to checkout</h2>
                        <svg transform="scale(0.8)" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.045 2.4593L16.5858 8H1C0.44771 8 0 8.4478 0 9C0 9.5523 0.44771 10 1 10H16.5858L11.045 15.5408C10.6545 15.9313 10.6545 16.5645 11.045 16.955C11.4356 17.3455 12.0687 17.3455 12.4592 16.955L19.7071 9.7072C20.0976 9.3166 20.0976 8.6835 19.7071 8.2929L12.4592 1.04509C12.2633 0.849151 12.0063 0.751521 11.7495 0.752201C11.6864 0.752371 11.6233 0.758471 11.5611 0.770501C11.372 0.807111 11.1915 0.898641 11.045 1.04509C10.6545 1.43561 10.6545 2.06878 11.045 2.4593Z" fill="#58FEC4" />
                        </svg>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Cart companyId={company.id} locations={locations} skus={skus} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className=" h-screen bg-black flex">
      <head>
        <title>Store</title>
        <meta name="store" content="shop for products" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
        <div className="text-white font-theinhardt text-28">Coming Soon</div>
      </main>
      <Cart companyId={company.id} locations={locations} skus={skus} />
    </div>
  );
}
