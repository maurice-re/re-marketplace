import {
    Company,
    User,
} from '@prisma/client';
import { Appearance, loadStripe, PaymentMethod } from '@stripe/stripe-js';
import { unstable_getServerSession } from "next-auth";
import 'tailwindcss/tailwind.css';
import prisma from '../../constants/prisma';
import { CheckoutType, getCheckoutTotal } from '../../utils/checkoutUtils';
import PODisplay from '../../components/po/poDisplay';
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import POLeft from '../../components/po/poLeft';

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
);

const appearance: Appearance = {
    theme: 'night',
    variables: {
        colorPrimary: '#58FEC4',
    },
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
            <main className="flex flex-col w-full container mx-auto py-6 text-white font-theinhardt px-4">
                <POLeft
                    company={JSON.parse(JSON.stringify(company)) as Company}
                    locations={JSON.parse(JSON.stringify(company?.locations))}
                    orderString={orderString}
                    products={products}
                    skus={skus}
                    type={CheckoutType.ORDER}
                    user={JSON.parse(JSON.stringify(user))}
                />
                <PODisplay />
            </main>
        </div>
    );
}
