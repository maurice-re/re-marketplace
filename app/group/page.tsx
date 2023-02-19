import 'tailwindcss/tailwind.css';
import ReLogo from '../../components/form/re-logo';
import LocationUsersList from '../../components/locations/location/locationUsersList';
import LocationsList from '../../components/locations/locationsList';
import { useServerStore } from '../server-store';

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

    const locations = await useServerStore.getState().getGroupLocations(groupId);

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center text-white">
            <ReLogo />
            <main className="flex flex-col items-center justify-center w-full py-6 text-white font-theinhardt px-4">
                <h1 className="text-2xl font-theinhardt text-white text-center py-10">
                    Group Details
                </h1>
                <h2 className="text-lg font-theinhardt text-white text-center pb-6">
                    Add/remove locations.
                </h2>
                {/* TODO(Suhana): Add/remove locations */}
                <div className="flex w-full flex-col items-center justify-center space-y-4">
                    <LocationsList locations={locations} title="Group Locations" caption="You're an owner of x locations and viewer of y locations out of these z locations." />
                </div>
            </main>
        </div>
    );
}