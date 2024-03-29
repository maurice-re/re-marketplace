import "tailwindcss/tailwind.css";
import ReLogo from "../../../components/form/re-logo";
import POViewer from "../../../components/po/poViewer";
import { prisma } from "../../../constants/prisma";
import { calculatePriceFromCatalog } from "../../../utils/prisma/dbUtils";

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
    buyerCompany: string;
    buyerAddressLine: string;
    buyerCity: string;
    buyerState: string;
    buyerZip: string;
    buyerCountry: string;
    buyerPhone: string;
    buyerEmail: string;
    requestioner: string;
    shippedVia: string;
    fobPoint: string;
    terms: string;
  };
}) {
  if (
    !(
      searchParams &&
      searchParams.orderString &&
      searchParams.buyerCompany &&
      searchParams.buyerAddressLine &&
      searchParams.buyerCity &&
      searchParams.buyerState &&
      searchParams.buyerZip &&
      searchParams.buyerCountry &&
      searchParams.buyerPhone &&
      searchParams.buyerEmail
    )
  ) {
    console.log(searchParams);
    return <div>An error occurred</div>;
  }

  const {
    orderString,
    buyerCompany,
    buyerAddressLine,
    buyerCity,
    buyerState,
    buyerZip,
    buyerCountry,
    buyerPhone,
    buyerEmail,
    requestioner,
    shippedVia,
    fobPoint,
    terms,
  } = searchParams;

  // TODO(Suhana): Pass this down instead of re-fetching
  const skus = await prisma.sku.findMany({});

  const items: POItem[] = [];

  const orderItems: {
    amount: number;
    locationId: string;
    quantity: number;
    skuId: string;
  }[] = [];
  orderString.split("*").forEach((ordersByLocation) => {
    const locationId = ordersByLocation.split("_")[0];
    const ordersForLocation = ordersByLocation.split("_").slice(1);
    ordersForLocation.forEach((order) => {
      const [skuId, quantity] = order.split("~");
      orderItems.push({
        amount: calculatePriceFromCatalog(skus, skuId, quantity),
        locationId: locationId,
        quantity: parseInt(quantity),
        skuId: skuId,
      });
    });
  });

  let subtotal = 0;
  let item: POItem;

  orderItems.forEach((orderItem) => {
    item = {
      qty: orderItem.quantity,
      unit: " ",
      unitPrice: calculatePriceFromCatalog(skus, orderItem.skuId, 1),
      description: orderItem.skuId,
      total: orderItem.amount,
    };
    items.push(item);
    subtotal += item.unitPrice * item.qty;
  });

  const tax = subtotal * 0.0725;
  const shippingAndHandling = 50;
  const other = 0;
  const total = subtotal + tax;

  const totals: POTotal[] = [
    { name: "Subtotal", value: parseFloat(subtotal.toFixed(2)) },
    { name: "Sales Tax (7.25%)", value: parseFloat(tax.toFixed(2)) },
    {
      name: "Shipping and Handling",
      value: parseFloat(shippingAndHandling.toFixed(2)),
    },
    { name: "Other", value: parseFloat(other.toFixed(2)) },
    { name: "Total", value: parseFloat(total.toFixed(2)) },
  ];

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center text-white">
      <ReLogo />
      <main className="flex flex-col items-center justify-center w-full py-6 text-white font-theinhardt px-4">
        <h1 className="text-5xl font-theinhardt text-white text-center py-10">
          Thank you for your purchase
        </h1>
        <div className="mx-auto">
          <POViewer
            items={items}
            totals={totals}
            sellerCompany="The Reusability Company"
            sellerAddressLine="3 Germany Dr, Unit 4"
            sellerCity="Wilmington"
            sellerState="Delaware"
            sellerZip="19804"
            sellerCountry="USA"
            sellerWebsite="www.re.company"
            sellerPhone="+1 9295054562"
            sellerTaxId="87-2179396"
            sellerBankName="Chase Bank"
            sellerRoutingNumber={815505463}
            sellerAccountNumber={325070760}
            poNumber={57}
            buyerAddressLine={buyerAddressLine}
            buyerCity={buyerCity}
            buyerState={buyerState}
            buyerZip={buyerZip}
            buyerCountry={buyerCountry}
            buyerCompany={buyerCompany}
            buyerPhone={buyerPhone}
            requestioner={requestioner}
            shippedVia={shippedVia}
            fobPoint={fobPoint}
            terms={terms}
            sellerEmail={"maddie@re.company"}
            buyerEmail={buyerEmail}
          />
        </div>
      </main>
    </div>
  );
}
