import 'tailwindcss/tailwind.css';
import PODisplay from '../../../components/po/poDisplay';
import ReLogo from '../../../components/form/re-logo';

export default async function Page({
    searchParams,
}: {
    searchParams?: { orderString: string; };
}) {
    if (!(searchParams && searchParams.orderString)) {
        return <div>An error occurred</div>;
    }

    const { orderString } = searchParams;

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center text-white">
            <ReLogo />
            <main className="flex flex-col items-center justify-center w-full py-6 text-white font-theinhardt px-4">
                <h1 className="text-5xl font-theinhardt text-white text-center py-10">
                    Thank you for your purchase
                </h1>
                <div className="mx-auto">
                    <PODisplay />
                </div>
            </main>
        </div>
    );
}
