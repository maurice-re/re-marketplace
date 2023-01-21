import {
    Company,
    User,
    Location,
} from '@prisma/client';
import { unstable_getServerSession } from "next-auth";
import 'tailwindcss/tailwind.css';
import prisma from '../../constants/prisma';
import { CheckoutType } from '../../utils/checkoutUtils';
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import POSummary from '../../components/po/poSummary';


export default async function Page({
    searchParams,
}: {
    searchParams?: { orderString: string; };
}) {
    if (!(searchParams && searchParams.orderString)) {
        return <div>An error occurred</div>;
    }

    const { orderString } = searchParams;

    const session = await unstable_getServerSession(authOptions);
    if (session == null) {
        //TODO: redirect to login
        return <div>Not logged in</div>;
    }
    const user = session.user as User;
    const company = await prisma.company.findUnique({
        where: { id: user.companyId },
        include: { locations: true },
    });
    const products = await prisma.product.findMany({});
    const skus = await prisma.sku.findMany({});

    return (
        <div className="w-full h-screen w-7/8 bg-black flex overflow-auto">
            <main className="flex flex-col w-full py-6 text-white font-theinhardt px-4">
                <POSummary
                    company={JSON.parse(JSON.stringify(company)) as Company & { locations: Location[]; }}
                    locations={JSON.parse(JSON.stringify(company?.locations))}
                    orderString={orderString}
                    products={products}
                    skus={skus}
                    type={CheckoutType.ORDER}
                    user={JSON.parse(JSON.stringify(user))}
                />
            </main>
        </div>
    );
}
