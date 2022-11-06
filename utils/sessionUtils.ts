import { Session } from 'next-auth';
import { headers } from 'next/headers';

export async function getSession(cookie: string): Promise<Session> {
    const response = await fetch(
        `${headers().get('x-forwarded-host') ?? 'http://localhost:3000'
        }/api/auth/session`,
        {
            headers: {
                cookie,
            },
        },
    );
    const session = await response.json();
    return Object.keys(session).length > 0 ? session : null;
}