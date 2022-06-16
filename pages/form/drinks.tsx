import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import FormButtonPage from "../../components/form/button-page";
import { drink_types } from "../../constants/form";
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
        items={drink_types}
        oneToOne={false}
        pageName={"drinks"}
      />
    </div>
  );
};

export default BusinessTypesPage;
