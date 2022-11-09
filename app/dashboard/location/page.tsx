import Head from "next/head";

export default function Page() {
    return (
        <div className="w-screen h-screen bg-black flex">
            <Head>
                <title>Locations</title>
                <meta name="locations" content="Manage locations" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
                <div className="text-white font-theinhardt text-28">Coming Soon</div>
            </main>
        </div>
    );
};