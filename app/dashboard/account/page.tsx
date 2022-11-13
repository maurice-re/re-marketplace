
import prisma from '../../../constants/prisma';
import { headers } from 'next/headers';
import { getSession } from '../../../utils/sessionUtils';
import { UserCompany } from '../../../utils/dashboard/dashboardUtils';
import React from "react";
import { Session } from 'next-auth';
import Account from './account';

async function getUser(session: Session) {

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email ?? '',
        },
        include: {
            company: true,
        },
    });
    return JSON.parse(JSON.stringify(user));

}

export default async function Page() {

    const session = await getSession(headers().get('cookie') ?? '');
    const user: UserCompany = await getUser(session);

    return (<Account user={user} />);

};