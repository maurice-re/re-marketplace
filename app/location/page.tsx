import 'tailwindcss/tailwind.css';
import ReLogo from '../../components/form/re-logo';
import LocationUsersList from '../../components/locations/location/locationUsersList';
import { useServerStore } from '../server-store';

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        locationId: string;
    };
}) {
    if (!(searchParams && searchParams.locationId)) {
        return <div>An error occurred</div>;
    }

    const {
        locationId
    } = searchParams;

    const owners = await useServerStore.getState().getLocationUsers(locationId, true);
    const viewers = await useServerStore.getState().getLocationUsers(locationId, false);

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center text-white">
            <ReLogo />
            <main className="flex flex-col items-center justify-center w-full py-6 text-white font-theinhardt px-4">
                <h1 className="text-2xl font-theinhardt text-white text-center py-10">
                    Location Details
                </h1>
                <div className="flex w-full flex-col items-center justify-center">
                    <h1>Owners</h1>
                    <LocationUsersList locationId={locationId} users={owners} owned={true} />
                    <h1>Viewers</h1>
                    <LocationUsersList locationId={locationId} users={viewers} owned={false} />
                </div>
            </main>
        </div>
    );
}