import { loadStripe } from "@stripe/stripe-js";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/context-provider";
import styles from "../../styles/Form.module.css";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

const Summary: NextPage = () => {
  const [eol, checkEol] = useState<boolean>(false);
  const [context, _] = useAppContext();
  const router = useRouter();

  const { canceled } = router.query;

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

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
        <h1 className={styles.title}>Your perfect setup</h1>
        <div>
          <ul>{items}</ul>
        </div>
        <div>
          <input
            type="checkbox"
            id="eol"
            checked={eol}
            onChange={(e) => checkEol(!eol)}
          />
          <label htmlFor="eol">Agree to EOL policy</label>
        </div>
        <div style={{ marginTop: "20px" }}>
          <form action="/api/checkout" method="POST">
            <button className={styles.checkoutButton} type="submit" role="link">
              {`Checkout: \$${2000 * context.cart.length}`}
            </button>
          </form>
        </div>
        {canceled && (
          <div className={styles.payErrorText}>
            Something went wrong, please try again
          </div>
        )}
      </main>
    </div>
  );
};

export default Summary;
