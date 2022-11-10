
import prisma from '../../../constants/prisma';
import { use } from 'react';
import { headers } from 'next/headers';
import { getSession } from '../../../utils/sessionUtils';
import { UserCompany } from '../../../utils/dashboard/dashboardUtils';
import React from "react";
import { Session } from 'next-auth';
import AccountContent from './accountContent';

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

export default function Page() {

    const session = use(getSession(headers().get('cookie') ?? ''));
    const user: UserCompany = use(getUser(session));

    return (<AccountContent user={user} />);

};