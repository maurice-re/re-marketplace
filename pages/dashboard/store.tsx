import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../../components/dashboard/sidebar";

const Store: NextPage = () => {
  async function addToTrackiing() {
    const options = {
      method: "POST",
      headers: {
        Authorization:
          "Bearer YWZTgtFhd9aCRjyYryWVjE7YH2fDGPSTbXba7Z4mn8VELoHSI9C4sMXjE11tEMYV",
        "content-type": "application/json",
      },
      body: '{"locationId":"SPS-CSC","skuId":"SB21.5RPPG","action":"BORROW","itemId":"cvAOfWT6kuvHQrL1Z8vSN"}',
    };

    fetch("http://localhost:3000/api/tracking/create-event", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }

  return (
    <Sidebar>
      <div className="w-screen h-screen bg-black flex">
        <Head>
          <title>Store</title>
          <meta name="store" content="shop for products" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
          <div className="text-white font-theinhardt text-28">Coming Soon</div>
          <button
            className="btn btn-accent btn-outline"
            onClick={addToTrackiing}
          >
            {" "}
            LOG Tracking
          </button>
        </main>
      </div>
    </Sidebar>
  );
};

export default Store;
