import { loadStripe } from "@stripe/stripe-js";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { swapboxProduct, swapcupProduct } from "../../constants/form";
import { useAppContext } from "../../context/context-provider";
import styles from "../../styles/Form.module.css";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

const Summary: NextPage = () => {
  const [numChanges, cartChanged] = useState<number>(0);
  const [context, updateAppContext] = useAppContext();
  const router = useRouter();
  // let width = 1000;
  let height = 1000;

  const { cart } = router.query;

  useEffect(() => {
    if (cart) {
      const cartArr = cart.toString().split(",");
      console.log(cartArr);
      context.cart = [];
      cartArr.map((i) => {
        const item = i.split("^");
        [swapboxProduct, swapcupProduct].map((p) => {
          const skuIndex = p.getSkuFromTitle(item[0]);
          if (skuIndex != "0") {
            let sku = p.sku.get(skuIndex)!;
            sku.quantity = item[1];
            context.addToCart(sku);
          }
        });
      });
      updateAppContext(context);
      cartChanged(numChanges + 1);
    }
  }, [cart, numChanges, updateAppContext, context]);

  const items = context.cart.map((sku) => (
    <li style={{ display: "inline" }} key={sku.title}>
      <div className={styles.summaryRow}>
        <Image src={sku.image} height={100} width={125} alt={"takeout front"} />
        <div className={styles.summaryText}>{sku.title}</div>
        <div>{"x" + sku.quantity}</div>
      </div>
    </li>
  ));

  return (
    <div className={styles.container}>
      <Head>
        <title>Find your perfect setup</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Confetti width={1000} height={1000} />
        <h1 className={styles.title}>Congrats on your purchase!</h1>
        <div>
          <ul>{items}</ul>
        </div>
      </main>
    </div>
  );
};

export default Summary;
