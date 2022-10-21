import { Company, Location, LocationType, Product, Sku } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Image from "next/image";
import { FormEvent, useState } from "react";
import Cart from "../../components/dashboard/cart";
import Sidebar from "../../components/dashboard/sidebar";
import AddressField from "../../components/form/address-field";
import DoubleAddressField from "../../components/form/double-address-field";
import prisma from "../../constants/prisma";
import { useCartStore } from "../../stores/cartStore";
import { LocationWithOneItem } from "../../utils/dashboard/dashboardUtils";
import { getPriceFromTable } from "../../utils/prisma/dbUtils";
import { authOptions } from "../api/auth/[...nextauth]";

type StoreProps = {
  company: Company;
  initialLocations: LocationWithOneItem[];
  products: Product[];
  skus: Sku[];
};

const Store: NextPage<StoreProps> = ({
  company,
  initialLocations,
  products,
  skus,
}) => {
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
        className="card card-compact w-full h-72 my-3 bg-base-100 shadow-xl font-theinhardt justify-center hover:bg-base-200 cursor-pointer"
        onClick={() => setLocationId(location.id)}
      >
        <div className="card-body justify-center">
          <h2 className="card-title leading-none text-white">
            {location.displayName ?? location.city}
          </h2>
          <div className="h-px bg-white my-1 w-full" />
          <div className="flex flex-col w-full">
            <div>{location.line1}</div>
            <div className="font-theinhardt-300 text-sm text-gray-200 leading-none">
              {location.city + " | " + location.country + " | " + location.zip}
            </div>
          </div>
          <div className="flex items-center text-sm font-theinhardt-300 gap-1">
            <div className="text-re-green-600">{`Last order date`}</div>
            <div className="text-gray-200">
              {` — ${
                location.orderItems.length == 0
                  ? "No orders placed"
                  : new Date(
                      location.orderItems[0].createdAt
                    ).toLocaleDateString("en-us", {
                      day: "numeric",
                      month: "short",
                    })
              }`}
            </div>
          </div>
        </div>
      </div>
    ));

    return (
      <Sidebar>
        <div className="w-screen h-screen bg-black flex">
          <Head>
            <title>Store</title>
            <meta name="store" content="shop for products" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
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
                    className={`btn btn-outline btn-accent ${
                      loading ? "loading" : ""
                    }`}
                    type="submit"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
          <main className="flex flex-col w-full h-full py-3 font-theinhardt">
            <div className="flex justify-between px-10 py-6 text-white">
              <h1 className="font-theinhardt text-3xl">Shop</h1>
              <h1 className="font-theinhardt text-3xl">{company.name}</h1>
            </div>
            <div className="flex h-full justify-between">
              <div className="flex flex-col w-full">
                <h1 className="text-center text-3xl text-white">
                  Which location are you shopping for?
                </h1>
                <div className="max-h-full bg-re-gray-500 bg-opacity-70 rounded-10 my-4 px-8 grid grid-cols-3 gap-8 overflow-y-auto py-1 items-stretch mx-4">
                  {locationCards}
                  <div
                    key={"new"}
                    className="card card-compact w-full h-72 my-3 bg-base-100 shadow-xl font-theinhardt justify-center hover:bg-base-200 cursor-pointer"
                    onClick={() =>
                      document.getElementById("newLocation-modal")?.click()
                    }
                  >
                    <div className="card-body justify-center">
                      <h2 className="card-title leading-none text-white self-center">
                        {"New Location"}
                      </h2>
                      <div className="text-3xl text-center">+</div>
                    </div>
                  </div>
                </div>
              </div>
              <Cart companyId={company.id} locations={locations} skus={skus} />
            </div>
          </main>
        </div>
      </Sidebar>
    );
  }

  if (locationId != undefined && productId == undefined) {
    const productCards = products
      .filter((product) => product.active)
      .map((product) => (
        <div
          key={product.id}
          className="card card-compact w-full my-3 bg-base-100 shadow-xl font-theinhardt justify-center hover:bg-base-200 cursor-pointer"
          onClick={() => {
            setSkuId(skus.find((sku) => sku.productId == product.id)?.id);
            setProductId(product.id);
          }}
        >
          <figure>
            <Image
              src={product.mainImage}
              alt={product.name}
              height={350}
              width={400}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{product.name}</h2>
          </div>
        </div>
      ));

    return (
      <Sidebar>
        <div className="w-screen h-screen bg-black flex">
          <Head>
            <title>Store</title>
            <meta name="store" content="shop for products" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex flex-col w-full h-full py-3 font-theinhardt">
            <div className="flex justify-between px-10 py-6 text-white">
              <h1 className="font-theinhardt text-3xl">Shop</h1>
              <h1 className="font-theinhardt text-3xl">{company.name}</h1>
            </div>
            <div className="flex h-full justify-between">
              <div className="flex flex-col w-full">
                <h1 className="text-center text-3xl text-white">
                  Re Catalogue
                </h1>
                <button
                  className="btn btn-square btn-outline"
                  onClick={() => {
                    setLocationId(undefined);
                  }}
                >
                  Back
                </button>
                <div className="max-h-full bg-re-gray-500 bg-opacity-70 rounded-10 my-4 px-8 grid grid-cols-3 gap-8 overflow-y-auto py-1 items-stretch mx-4">
                  {productCards}
                </div>
              </div>
              <Cart companyId={company.id} locations={locations} skus={skus} />
            </div>
          </main>
        </div>
      </Sidebar>
    );
  }

  if (locationId != undefined && productId != undefined) {
    const product = products.find((product) => product.id === productId)!;
    const sku = skus.find((sku) => sku.id === skuId)!;
    const sizes = product.sizes.split(", ");
    const materials = product.materials.split(", ");
    const colors = product.colors.split(", ");
    console.log(colors);

    return (
      <Sidebar>
        <div className="w-screen h-screen bg-black flex">
          <Head>
            <title>Store</title>
            <meta name="store" content="shop for products" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex flex-col w-full h-full py-3 font-theinhardt">
            <div className="flex justify-between px-10 py-6 text-white">
              <h1 className="font-theinhardt text-3xl">Shop</h1>
              <h1 className="font-theinhardt text-3xl">{company.name}</h1>
            </div>
            <div className="flex h-full justify-between">
              <div className="flex flex-col w-full">
                <div className="max-h-full bg-re-gray-500 bg-opacity-70 rounded-10 my-4 px-4 overflow-y-auto pt-4 pb-4 items-stretch flex flex-col mx-4">
                  <button
                    className="btn btn-square btn-outline"
                    onClick={() => {
                      setProductId(undefined);
                      setQuantity("");
                      setSkuId(undefined);
                    }}
                  >
                    Back
                  </button>
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
                              className={`btn btn-outline mr-2 ${
                                sku.size == size ? "btn-accent" : ""
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
                              className={`btn btn-outline mr-2 ${
                                sku.color == color ? "btn-accent" : ""
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
                            className={`btn btn-outline mr-2 ${
                              sku.material == material ? "btn-accent" : ""
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
              <Cart companyId={company.id} locations={locations} skus={skus} />
            </div>
          </main>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="w-screen h-screen bg-black flex">
        <Head>
          <title>Store</title>
          <meta name="store" content="shop for products" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
          <div className="text-white font-theinhardt text-28">Coming Soon</div>
        </main>
        <Cart companyId={company.id} locations={locations} skus={skus} />
      </div>
    </Sidebar>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session && session.user && session.user.email) {
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
      include: {
        company: {
          include: {
            locations: {
              include: {
                orderItems: {
                  take: 1,
                  orderBy: {
                    createdAt: "desc",
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!user) {
      return { props: {} };
    }

    const products = await prisma.product.findMany({});
    const skus = await prisma.sku.findMany({});

    return {
      props: {
        company: JSON.parse(JSON.stringify(user.company)),
        initialLocations: JSON.parse(JSON.stringify(user.company.locations)),
        products: JSON.parse(JSON.stringify(products)),
        skus: JSON.parse(JSON.stringify(skus)),
      },
    };
  }
  return { props: {} };
};

export default Store;
