import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import ProductPage from "../../components/form/product-page";
import ProgressBar from "../../components/form/progress-bar";
import { swapboxProduct, swapcupProduct } from "../../constants/form";
import styles from "../../styles/Form.module.css";

const Product: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const product = id == "swapcup" ? swapcupProduct : swapboxProduct;

  return (
    <div className={styles.container}>
      <Head>
        <title>Find your perfect setup</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProgressBar pageName={router.asPath.slice(6)} />
      <ProductPage product={product} route={router.asPath.slice(6)} />
    </div>
  );
};

export default Product;
