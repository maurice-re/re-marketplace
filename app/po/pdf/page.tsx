import 'tailwindcss/tailwind.css';
import POFile from '../../../components/po/poFile';
import ReLogo from '../../../components/form/re-logo';

export type POItem = {
    qty: number;
    unit: string;
    description: string;
    unitPrice: number;
    total: number;
};

export default async function Page({
    searchParams,
}: {
    searchParams?: { orderString: string; };
}) {
    if (!(searchParams && searchParams.orderString)) {
        return <div>An error occurred</div>;
    }

    const { orderString } = searchParams;

    // TODO(Suhana): Generate actual items form the orderString using a helper function
    const items: POItem[] = [{ qty: 5000, unit: " ", unitPrice: 4, description: "22oz Cold Beverage Cup (PP material, with pad printing)", total: 4, }];

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center text-white">
            <ReLogo />
            <main className="flex flex-col items-center justify-center w-full py-6 text-white font-theinhardt px-4">
                <h1 className="text-5xl font-theinhardt text-white text-center py-10">
                    Thank you for your purchase
                </h1>
                <div className="mx-auto">
                    {/* TODO(Suhana): Pass actual total here */}
                    <POFile items={items} total={0} />
                </div>
            </main>
        </div>
    );
}
