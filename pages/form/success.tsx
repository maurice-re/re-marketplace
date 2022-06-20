import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/Form.module.css";

const Success: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Find your perfect setup</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Congrats on your purchase!</h1>
      </main>
    </div>
  );
};

export default Success;
