import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { CartOrder } from "../../context/form-context";
import { OrderCustomerLocation } from "../../utils/dashboard/dashboardUtils";
import { allLocations } from "../../utils/prisma/cart";
import { SampleTransactionOrders } from "../../utils/sample/sampleUtils";

const Summary: NextPage = () => {
  // const [cart, setCart] = useState<CartOrder[]>([]);

  useEffect(() => {
    // Retrieve from local storage
    console.log("Made it to success page");
    const transaction: string | null = localStorage.getItem("transaction");
    const shippingInfo: string | null = localStorage.getItem("shipping");
    // Send to Firebase
    if (transaction != null && shippingInfo != null) {
      const jTransaction: SampleTransactionOrders = JSON.parse(transaction);
      const jForm: string[] = JSON.parse(shippingInfo);
      console.log(jTransaction);
      console.log(jForm);
      create(jTransaction, jForm);
      localStorage.clear();
      // setCart(jCart);
    }
  }, []);

  async function create(transaction: SampleTransactionOrders, form: string[]) {
    console.log("In create within success with ");
    console.log(transaction);
    console.log(form);
    if (transaction && form) {
      await fetch("/api/sample/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction: transaction,
          form: form,
        }),
      })
        .then((res) => {
          console.log("res");
          console.log(res);
        })
        .catch((e) => {
          console.log("e");
          console.log(e);
        });
    }
  }

  // let items: (JSX.Element | JSX.Element[])[] = [];
  // allLocations(cart).forEach((city) => {
  //   items.push(
  //     <div>
  //       <div>{`${city} orders`}</div>
  //     </div>
  //   );
  //   items.push(
  //     cart.map((order) => {
  //       if (order.location != city) {
  //         return <div key={order.sku.id + city} />;
  //       }
  //       return (
  //         <div
  //           className="flex columns-2 justify-between items-center mr-4 my-4"
  //           key={order.sku.id + city}
  //         >
  //           <div className="flex columns-2 justify-start items-center">
  //             <div className="h-16 w-16 overflow-hidden rounded place-content-center mr-3">
  //               <Image
  //                 src={order.product.mainImage}
  //                 alt={"takeout front"}
  //                 height={"100%"}
  //                 width={"100%"}
  //               />
  //             </div>
  //             <div>
  //               <div className="text-md font-semibold mb-0.5">
  //                 {`${order.sku.size} ${order.sku.materialShort} ${order.product.name}`}
  //               </div>
  //               <div className="text-sm text-gray-300">{`Qty ${order.quantity}`}</div>
  //             </div>
  //           </div>
  //         </div>
  //       );
  //     })
  //   );
  //   items.push(<div className="h-8" />);
  // });

  return (
    <div className="w-screen h-screen bg-black flex overflow-hidden">
      <Head>
        <title>Congrats</title>
        <meta
          name="successful purchase"
          content="Congrats on making a purchase"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col container mx-auto items-center py-4 text-white">
        <Confetti width={1800} height={1200} />
        <h1 className="text-5xl font-theinhardt text-white text-center">
          Congrats on your purchase!
        </h1>
        {/* <div className=" mt-16 border-2 rounded-xl px-8 pt-8">{items}</div> */}
        <div className="border-2 border-white px-8 py-4 mt-4 text-center rounded-md">
          <div>Your sample is on the way</div>
        </div>
      </main>
    </div>
  );
};

export default Summary;
