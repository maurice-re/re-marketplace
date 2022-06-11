import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useAppContext } from "../../context/context-provider";
import styles from "../../styles/Form.module.css";

const Summary: NextPage = () => {
  const [eol, checkEol] = useState<boolean>(false);
  const [context, _] = useAppContext();

  const items = context.cart.map((sku) => (
    <li style={{ display: "inline" }} key={sku.title}>
      <div className={styles.summaryRow}>
        <Image
          src="/images/takeout_front.png"
          height={100}
          width={125}
          alt={"takeout front"}
        />
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
          <button className={styles.checkoutButton} type="button">
            {`Checkout: \$${2000 * context.cart.length}`}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Summary;
