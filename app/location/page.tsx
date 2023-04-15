import 'tailwindcss/tailwind.css';
import ReLogo from '../../components/form/re-logo';
import Inventory from '../../components/locations/inventory';
import LocationUsersList from '../../components/locations/location/locationUsersList';
import UpdateLocationForm from '../../components/locations/updateLocationForm';
import { getItemsInUse, getTotals } from '../../utils/tracking/trackingUtils';
import { FullHardware, useServerStore } from '../server-store';

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
        locationId,
    } = searchParams;

    const user = await useServerStore.getState().getUser();
    const owners = await useServerStore.getState().getLocationUsers(locationId, true);
    const viewers = await useServerStore.getState().getLocationUsers(locationId, false);
    const location = await useServerStore.getState().getLocationById(locationId);
    const ownerEmails = await useServerStore.getState().getLocationUserEmails(locationId, true);
    const viewerEmails = await useServerStore.getState().getLocationUserEmails(locationId, false);
    const ownedLocations = await useServerStore.getState().getLocations(true);
    const allHardware = await useServerStore.getState().getHardware(locationId);

    const owned = ownedLocations.some(l => l.id === locationId);

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center text-white">
            <ReLogo />
            <main className="flex flex-col items-center justify-start w-full pb-6 text-white font-theinhardt px-4 pt-10 h-screen overflow-y-auto">
                <h1 className="text-2xl font-theinhardt text-white text-center pt-10 pb-3">
                    Location Details
                </h1>
                <Inventory
                    location={location}
                    allHardware={allHardware}
                />
                <h2 className="text-lg font-theinhardt text-white text-center py-6">
                    Owners are able to add/remove other owners and viewers. Viewers are able to view the location and its owners and viewers.
                </h2>
                <div className="flex w-full gap-4 items-center justify-center space-y-4">
                    <div className='w-1/2 flex flex-col items-center justify-center'>
                        <h1>Owners</h1>
                        <LocationUsersList locationId={locationId} users={owners} owned={owned} owner={true} />
                    </div>
                    <div className='w-1/2 flex flex-col items-center justify-center'>
                        <h1>Viewers</h1>
                        <LocationUsersList locationId={locationId} users={viewers} owned={owned} owner={false} />
                    </div>
                </div>
                {/* Only let them update the location if they are an owner of the location. */}
                {owned &&
                    (<div className='mt-6 flex flex-col w-1/2 items-center justify-center'>
                        <h1>Update Location</h1>
                        <UpdateLocationForm user={user} location={location} initialOwnerEmails={ownerEmails} initialViewerEmails={viewerEmails} />
                    </div>)
                }
            </main>
        </div>
    );
}