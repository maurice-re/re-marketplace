import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import ProductPage from "../../components/form/product-page";
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

      <ProductPage product={product} />
    </div>
  );
};

export default Product;
