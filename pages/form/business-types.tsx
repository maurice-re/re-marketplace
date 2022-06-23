import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import FormButtonPage from "../../components/form/button-page";
import { business_types } from "../../constants/form";
import styles from "../../styles/Form.module.css";

const BusinessTypesPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Find your perfect setup</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <FormButtonPage
        title="What types of products are you packaging"
        items={business_types}
        oneToOne={true}
        pageName={"business-types"}
      />
    </div>
  );
};

export default BusinessTypesPage;
