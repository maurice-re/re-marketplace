import 'tailwindcss/tailwind.css';
import ReLogo from '../../components/form/re-logo';
import { useServerStore } from '../server-store';
import Group from './group';

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        groupId: string;
    };
}) {
    if (!(searchParams && searchParams.groupId)) {
        return <div>An error occurred</div>;
    }

    const {
        groupId
    } = searchParams;

    const groupLocations = await useServerStore.getState().getGroupLocations(groupId);
    const createdGroups = await useServerStore.getState().getGroups(true);
    const user = await useServerStore.getState().getUser();

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center text-white">
            <ReLogo />
            <main className="flex flex-col items-center justify-center w-full py-6 text-white font-theinhardt px-4">
                <Group groupId={groupId} user={user} groupLocations={groupLocations} createdGroups={createdGroups} />
            </main>
        </div>
    );
}