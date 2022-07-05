import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import FormButtonPage from "../../components/form/button-page";
import ProgressBar from "../../components/form/progress-bar";
import ReLogo from "../../components/form/re-logo";
import { business_types, drink_types, food_types } from "../../constants/form";
import { FormButtonModel } from "../../models/form-button";

const BusinessTypesPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  const types: FormButtonModel[] = (() => {
    if (id == "business") {
      return business_types;
    } else if (id == "food") {
      return food_types;
    }
    return drink_types;
  })();

  const title: string = (() => {
    if (id == "business") {
      return "What types of products are you packaging?";
    } else if (id == "food") {
      return "What types of food are you packaging?";
    }
    return "What types of drinks are you packaging?";
  })();

  return (
    <div className="w-screen h-screen bg-black flex">
      <Head>
        <title>Find your perfect setup</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProgressBar pageName={router.asPath.slice(6)} />
      <ReLogo />
      <FormButtonPage
        items={types}
        oneToOne={id == "business" ? true : false}
        title={title}
        pageName={router.asPath.slice(6)}
      />
    </div>
  );
};

export default BusinessTypesPage;
