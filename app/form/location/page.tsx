"use client";

import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormNextButton from "../../../components/form/next-button";
import ProgressBar from "../../../components/form/progress-bar";
import ReLogo from "../../../components/form/re-logo";
import { cities } from "../../../constants/cities";
import { FormStore, useFormStore } from "../../../stores/formStore";

export default function Page() {
  const {
    addLocation,
    addSummary,
    disableCheckout,
    initializeCatalog,
    locations,
    removeLocation,
  } = useFormStore((state: FormStore) => ({
    addLocation: state.addLocation,
    addSummary: state.addSummary,
    disableCheckout: state.disableCheckout,
    initializeCatalog: state.initializeCatalog,
    locations: state.locations,
    removeLocation: state.removeLocation,
  }));
  const [query, setQuery] = useState<string>("");
  const [drawerOpen, toggleDrawer] = useState<boolean>();
  const searchParams = useSearchParams();
  const checkout = searchParams ? searchParams.get("checkout") : "";

  useEffect(() => {
    const fetchCatalog = async () => {
      const products = await fetch("/api/product").then((res) => res.json());
      const skus = await fetch("/api/sku").then((res) => res.json());
      initializeCatalog(skus, products);
    };
    fetchCatalog();
  }, [initializeCatalog]);

  useEffect(() => {
    if (checkout == "false") {
      disableCheckout();
    }
  }, [disableCheckout, checkout]);

  function handleClick(city: string) {
    if (locations.includes(city)) {
      removeLocation(city);
    } else {
      addLocation(city);
    }
    setQuery("");
    toggleDrawer(false);
  }

  const options = cities
    .filter((city) => city.toLowerCase().startsWith(query.toLowerCase()))
    .map((city) => (
      <div
        key={city}
        className="flex justify-between p-2 hover:bg-re-green-500 border-b-2 hover:text-black text-white align-middle group"
        onMouseDown={() => handleClick(city)}
      >
        <div className=" text-25 pl-6 font-theinhardt-300">{city}</div>
        {locations.includes(city) ? (
          <div className="bg-re-green-500 h-6 w-6 group-hover:bg-white mr-5 rounded-full pl-1 my-auto">
            <Image
              src="/icons/check.png"
              height={10}
              width={15}
              alt="check mark"
            />
          </div>
        ) : null}
      </div>
    ));

  const chosen = locations.map((city: string) => (
    <div
      className="bg-re-black text-sm text-white pr-2 py-1 rounded mr-3 my-1 flex border border-white font-theinhardt-300"
      key={city}
    >
      <button
        className="pl-1 pr-1 text-white hover:text-red-300"
        onClick={() => handleClick(city)}
      >
        &times;
      </button>
      <div>{city}</div>
    </div>
  ));

  const inputBorderRadius: string = drawerOpen
    ? " rounded-10 rounded-b-none"
    : " rounded-10";

  return (
    <div className=" w-screen h-screen bg-re-black flex">
      <Head>
        <title>What cities do you operate in</title>
        <meta
          name="location"
          content="Choose locations that your company needs service for"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProgressBar pageName={"form/location"} />
      <ReLogo />
      <div className="absolute left-4 top-6 flex text-white">
        <div className="text-white">
          <span>Already have an account? </span>
          <span
            className="hover:text-re-green-500 cursor-pointer"
            onClick={() => signIn()}
          >
            Log In
          </span>
        </div>
      </div>
      <main className="flex flex-col container mx-auto self-end h-2/3 items-center">
        <div className="">
          <h1 className=" text-5xl font-theinhardt text-white">
            What cities do you operate in?
          </h1>
          <div className=" text-sm italic self-right mb-14 font-theinhardt text-white ml-1">
            Select all that apply
          </div>
        </div>
        <div className="w-3/5 max-w-lg">
          <input
            className={
              "text-25 pl-8 py-2 border-2 border-white bg-re-black w-full text-white font-theinhardt-300" +
              inputBorderRadius
            }
            type="text"
            value={query}
            onFocus={() => toggleDrawer(true)}
            onBlur={() => toggleDrawer(false)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city..."
            required
          />
          {!drawerOpen && <div className="flex flex-wrap pt-2">{chosen}</div>}
          {drawerOpen && (
            <div className=" bg-re-black border-2 border-t-0 max-h-64 overflow-auto">
              {options}
            </div>
          )}
          {!drawerOpen && (
            <FormNextButton
              pageName={"form/location"}
              disabled={locations.length < 1}
              onClick={() => addSummary()}
              green
            />
          )}
        </div>
      </main>
    </div>
  );
}
