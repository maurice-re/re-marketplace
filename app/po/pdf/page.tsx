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
export type POTotal = {
    name: string;
    value: number;
};

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        orderString: string;
        buyerName: string;
        buyerBillingAddressLine: string;
        buyerShippingAddressLine: string;
        buyerPhone: string;
        buyerTaxId: number;
        requestioner: string;
        shippedVia: string;
        fobPoint: string;
        terms: string;
    };
}) {
    if (!(searchParams && searchParams.orderString && searchParams.buyerName && searchParams.buyerBillingAddressLine && searchParams.buyerShippingAddressLine && searchParams.buyerPhone && searchParams.buyerTaxId && searchParams.requestioner && searchParams.shippedVia && searchParams.fobPoint && searchParams.terms)) {
        console.log(searchParams);
        return <div>An error occurred</div>;
    }

    const {
        orderString,
        buyerName,
        buyerBillingAddressLine,
        buyerShippingAddressLine,
        buyerPhone,
        buyerTaxId,
        requestioner,
        shippedVia,
        fobPoint,
        terms
    } = searchParams;
    console.log("On this page");
    console.log(buyerName);

    // TODO(Suhana): Generate actual items from the orderString using a helper function
    const items: POItem[] = [{ qty: 5000, unit: " ", unitPrice: 4, description: "22oz Cold Beverage Cup (PP material, with pad printing)", total: 4, }, { qty: 5000, unit: " ", unitPrice: 4, description: "22oz Cold Beverage Cup (PP material, with pad printing)", total: 4, }];
    const totals: POTotal[] = [{ name: "Subtotal", value: 50, }, { name: "Sales Tax (7.25%)", value: 50, }, { name: "Shipping and Handling", value: 50, }, { name: "Other", value: 50, }, { name: "Total", value: 50, }];
    return (
        <div className="w-full h-screen bg-black flex items-center justify-center text-white">
            <ReLogo />
            <main className="flex flex-col items-center justify-center w-full py-6 text-white font-theinhardt px-4">
                <h1 className="text-5xl font-theinhardt text-white text-center py-10">
                    Thank you for your purchase
                </h1>
                <div className="mx-auto">
                    {/* TODO(Suhana): Pass actual total here */}
                    <POFile
                        items={items}
                        totals={totals}
                        sellerCompany='The Reusability Company'
                        sellerAddressLine='3 Germany Dr, Unit 4'
                        sellerCity='Wilmington'
                        sellerState='Delaware'
                        sellerZip='19804'
                        sellerCountry='USA'
                        sellerWebsite='wwww.re.company'
                        sellerPhone='+1 9295054562'
                        sellerTaxId="87-2179396"
                        sellerPONumber={57}
                        // TODO(Suhana): Add city, state, zip, and country for both billing and shipping
                        buyerBillingAddressLine={buyerBillingAddressLine}
                        buyerShippingAddressLine={buyerShippingAddressLine}
                        // TODO(Suhana): Add first and last name fields
                        buyerName={buyerName}
                        buyerPhone={buyerPhone}
                        buyerTaxId={buyerTaxId}
                        requestioner={requestioner}
                        shippedVia={shippedVia}
                        fobPoint={fobPoint}
                        terms={terms}
                    />
                </div>
            </main>
        </div>
    );
}
