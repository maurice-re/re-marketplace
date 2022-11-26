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

let breadcrumbsInfo: BreadcrumbsInfo[] = [
  {
    step: "1",
    title: "Choose the location",
    passed: true
  },
  {
    step: "2",
    title: "Choose your product",
    passed: true
  },
  {
    step: "3",
    title: "Set properties",
    passed: false
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

  function getLocationById(locationId: string): LocationWithOneItem | undefined {
    return locations.find(location => location.id === locationId);
  }

  function getLocationName(locationId: string): string {
    const location: LocationWithOneItem | undefined = getLocationById(locationId);
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
        className="bg-re-dark-green-500 h-24 rounded-md border-re-dark-green-100 border-1/2 shadow-xl font-theinhardt justify-center hover:bg-re-dark-green-400 cursor-pointer"
        onClick={() => setLocationId(location.id)}
      >
        <div className="flex flex-col items-start justify-center p-4">
          <div className="w-full items-center justify-between flex"><h2 className="text-left text-lg leading-none text-white">
            {location.displayName ?? location.city}
          </h2>
            {location.orderItems.length != 0 && (
              <div className="rounded-2xl px-2 bg-re-dark-green-800 border-re-dark-green-800">
                <div className="flex items-center text-sm font-theinhardt-300 w-full gap-1">
                  <div className="text-gray-200">
                    {"Last ordered: " + new Date(
                      location.orderItems[0].createdAt
                    ).toLocaleDateString("en-us", {
                      day: "numeric",
                      month: "short",
                    })
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col w-full re-dark-green-700 font-theinhardt-300 text-sm mt-1">
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
      <div className={`w-1/${breadcrumbsInfo.length} flex flex-col py-2`}>
        <div className={`h-0.5 ${info.passed ? "bg-re-green-500" : "bg-re-dark-green-100"} mb-2 w-full`} />
        <div className="w-full flex items-center justify-start mt-1">
          <h2 className="font-theinhardt-300 text-re-green-500 mr-1">
            Step {info.step}:
          </h2>
          <h2 className=" font-theinhardt-300 text-white">
            {info.title}
          </h2>
        </div>
      </div>));

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
        <main className="flex flex-col w-full h-full overflow-y-auto pt-3 font-theinhardt">
          <div className="flex mt-4 py-4 pl-6 text-white border-y-1/2 border-re-dark-green-100">
            <h1 className="font-theinhardt text-lg">Shop</h1>
          </div>
          <div className="flex h-full justify-between">
            <div className="flex flex-col w-full h-screen">
              <div className="w-full flex gap-6 items-center py-4 px-6 ">{breadcrumbs}</div>
              <div className="flex py-4 pl-6 text-white border-y-1/2 border-re-dark-green-100">
                <h1 className="font-theinhardt text-lg">Locations</h1>
              </div>
              <div className="bg-re-dark-green-600 h-full pt-4">
                <div className="mt-2 px-2 grid grid-cols-3 gap-4 py-1 mx-4 items-start justify-start ">
                  {locationCards}
                  <div
                    key={"new"}
                    className="bg-re-dark-green-500 h-24 flex gap-1 rounded-md border-re-dark-green-100 border-1/2 shadow-xl font-theinhardt justify-center items-center hover:bg-re-dark-green-400 cursor-pointer"
                    onClick={() =>
                      document.getElementById("newLocation-modal")?.click()
                    }
                  >
                    <h2 className="text-lg leading-none text-white">
                      {"Add new location"}
                    </h2>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.25C8.27344 2.25 5.25 5.12766 5.25 8.67188C5.25 12.75 9.75 19.2127 11.4023 21.4448C11.4709 21.5391 11.5608 21.6157 11.6647 21.6686C11.7686 21.7215 11.8835 21.749 12 21.749C12.1165 21.749 12.2314 21.7215 12.3353 21.6686C12.4392 21.6157 12.5291 21.5391 12.5977 21.4448C14.25 19.2136 18.75 12.7533 18.75 8.67188C18.75 5.12766 15.7266 2.25 12 2.25Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M12 11.25C13.2426 11.25 14.25 10.2426 14.25 9C14.25 7.75736 13.2426 6.75 12 6.75C10.7574 6.75 9.75 7.75736 9.75 9C9.75 10.2426 10.7574 11.25 12 11.25Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
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
    let productCards = products
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
          <div className="p-3 flex items-center justify-between border-b-1/2 bg-re-dark-green-500 hover:bg-re-dark-green-400 border-re-dark-green-100 border-x-1/2 rounded-b-md">
            <div >
              <h3 className="text-white text-lg leading-none">{product.name}</h3>
              <h3 className="mt-2 leading-none text-re-dark-green-700">{product.materials}</h3>
              <h3 className="mt-1 leading-none text-re-dark-green-700">{product.sizes.split(', ').join(' | ')}</h3>
            </div>
          </div>
        </div>
      ));

    breadcrumbsInfo[0].passed = true;
    breadcrumbsInfo[1].passed = true;
    breadcrumbsInfo[2].passed = false;

    // TODO(Suhana): DRY breadcrumbs
    const breadcrumbs = breadcrumbsInfo.map((info) => (
      <div className={`w-1/${breadcrumbsInfo.length} flex flex-col py-2`}>
        <div className={`h-0.5 ${info.passed ? "bg-re-green-500" : "bg-re-dark-green-100"} mb-2 w-full`} />
        <div className="w-full flex items-center justify-start mt-1">
          <h2 className="font-theinhardt-300 text-re-green-500 mr-1">
            Step {info.step}:
          </h2>
          <h2 className=" font-theinhardt-300 text-white">
            {info.title}
          </h2>
        </div>
      </div>));

    return (
      <div className="h-screen bg-black flex">
        {/* <head>
        <title>Store</title>
        <meta name="store" content="shop for products" />
        <link rel="icon" href="/favicon.ico" />
      </head> */}
        <main className="flex flex-col w-full h-full overflow-y-auto pt-3 font-theinhardt-300">
          <div className="flex mt-4 py-4 pl-6 text-white border-y-1/2 border-re-dark-green-100">
            <h1 className="font-theinhardt text-lg">Shop</h1>
          </div>
          <div className="flex h-full justify-between">
            <div className="flex flex-col w-full h-screen">
              <div className="w-full flex gap-6 items-center py-4 px-6 ">{breadcrumbs}</div>
              <div className="flex py-4 pl-6 text-white border-y-1/2 border-re-dark-green-100 items-center justify-start gap-2">
                <button
                  onClick={() => {
                    setLocationId(undefined);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.4598 5.10577L8.56554 12.0001L15.4598 18.8944C15.7527 19.1872 15.7527 19.6621 15.4598 19.955C15.1669 20.2479 14.6921 20.2479 14.3992 19.955L6.97455 12.5304C6.8339 12.3897 6.75488 12.199 6.75488 12.0001C6.75488 11.8011 6.8339 11.6104 6.97455 11.4697L14.3992 4.04511C14.4358 4.0085 14.4752 3.97646 14.5168 3.949C14.8079 3.75679 15.2035 3.78883 15.4598 4.04511C15.7527 4.338 15.7527 4.81288 15.4598 5.10577Z" fill="white" />
                  </svg>
                </button>
                <h1 className="font-theinhardt text-lg">Locations / {getLocationName(locationId)}</h1>
              </div>
              <div className="bg-re-dark-green-600 h-full">

                <div className={`mt-6 grid grid-cols-4 gap-6 py-1 items-start justify-start ${productCards.length > 3 ? 'px-28' : 'px-6'}`}>
                  {/* <div className="max-h-full rounded-10 my-4 px-28 grid grid-cols-3 gap-8 overflow-y-auto py-1 items-stretch mx-4"> */}
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
      <div className={`w-1/${breadcrumbsInfo.length} flex flex-col py-2`}>
        <div className={`h-0.5 ${info.passed ? "bg-re-green-500" : "bg-re-dark-green-100"} mb-2 w-full`} />
        <div className="w-full flex items-center justify-start mt-1">
          <h2 className="font-theinhardt-300 text-re-green-500 mr-1">
            Step {info.step}:
          </h2>
          <h2 className=" font-theinhardt-300 text-white">
            {info.title}
          </h2>
        </div>
      </div>));

    return (
      <div className="h-screen bg-black flex">
        {/* <head>
        <title>Store</title>
        <meta name="store" content="shop for products" />
        <link rel="icon" href="/favicon.ico" />
      </head> */}
        <main className="flex flex-col w-full h-full overflow-y-auto pt-3 font-theinhardt">
          <div className="flex mt-4 py-4 pl-6 text-white border-y-1/2 border-re-dark-green-100">
            <h1 className="font-theinhardt text-lg">Shop</h1>
          </div>
          <div className="flex h-full justify-between">
            <div className="flex flex-col w-full h-screen">
              <div className="w-full flex gap-6 items-center py-4 px-6 ">{breadcrumbs}</div>
              <div className="flex py-4 pl-6 text-white border-y-1/2 border-re-dark-green-100 items-center justify-start gap-2">
                <button
                  onClick={() => {
                    setProductId(undefined);
                    setQuantity("");
                    setSkuId(undefined);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.4598 5.10577L8.56554 12.0001L15.4598 18.8944C15.7527 19.1872 15.7527 19.6621 15.4598 19.955C15.1669 20.2479 14.6921 20.2479 14.3992 19.955L6.97455 12.5304C6.8339 12.3897 6.75488 12.199 6.75488 12.0001C6.75488 11.8011 6.8339 11.6104 6.97455 11.4697L14.3992 4.04511C14.4358 4.0085 14.4752 3.97646 14.5168 3.949C14.8079 3.75679 15.2035 3.78883 15.4598 4.04511C15.7527 4.338 15.7527 4.81288 15.4598 5.10577Z" fill="white" />
                  </svg>
                </button>
                <h1 className="font-theinhardt text-lg">Locations / {getLocationName(locationId)} / {product.name}</h1>
              </div>
              <div className="bg-re-dark-green-600 h-full pt-4">
                <div className="max-h-full bg-opacity-70 rounded-10 my-4 px-4 overflow-y-auto pt-4 pb-4 items-stretch flex flex-col mx-4">

                  <h1 className="text-3xl mb-4 text-center text-white">
                    {product.name}
                  </h1>
                  <div className="flex justify-evenly">
                    <div className="flex flex-col">
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="rounded-10"
                      />
                    </div>
                    <div className="flex flex-col justify-evenly">
                      <div className="flex flex-col p-6 w-full bg-re-gray-400 rounded-10">
                        <div>Size</div>
                        <div className="flex flex-wrap">
                          {sizes.map((size) => (
                            <button
                              key={size}
                              className={`btn btn-outline mr-2 ${sku.size == size ? "btn-accent" : ""
                                }`}
                              onClick={() => changeSize(size)}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                        <div className="h-4" />
                        <div>Color</div>
                        <div className="flex flex-wrap">
                          {colors.map((color) => (
                            <button
                              key={color}
                              className={`btn btn-outline mr-2 ${sku.color == color ? "btn-accent" : ""
                                }`}
                              onClick={() => changeColor(color)}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                        <div className="h-4" />
                        <div>Material</div>
                        {materials.map((material) => (
                          <button
                            key={material}
                            className={`btn btn-outline mr-2 ${sku.material == material ? "btn-accent" : ""
                              }`}
                          >
                            {material}
                          </button>
                        ))}
                      </div>
                      <div className="flex p-4 bg-re-gray-400 rounded-10 items-center">
                        <h2>{`\$${getPriceFromTable(
                          sku.priceTable,
                          quantity == "" ? 1 : quantity
                        )}`}</h2>
                        <div className="w-6" />
                        <input
                          type="number"
                          placeholder="Quantity"
                          className="input w-full max-w-xs bg-black"
                          required
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </div>
                      <button
                        className="btn btn-outline btn-accent font-theinhardt tracking-wide"
                        onClick={handleAddToCart}
                      >
                        Add To Cart
                      </button>
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
