import { ChangeEvent, FormEvent, useState } from "react";
import { User, Location } from "@prisma/client";
import Link from "next/link";

export default function LocationsList({ user, locations, owned }: { user: User; locations: Location[]; owned: boolean; }) {
    //     const [ownersModalOpen, setOwnersModalOpen] = useState<boolean>(false);
    //     const [viewersModalOpen, setViewersModalOpen] = useState<boolean>(false);

    //     function toggleModal(owned: boolean) {
    // if (
    // owned
    // ) {

    // }  else{

    // }    }

    // TODO(Suhana): When they click a location, send them to a page which has a list of the viewers of that location.
    return (
        <div className="justify-center items-center flex w-1/2 flex-col">
            <h1>{owned ? `Owned` : `Viewable`} Locations</h1>
            <div className="w-full flex space-x-3">
                {locations.map((location, index) => (
                    <div
                        className="flex justify-between items-center px-4 py-4 border-2 border-re-green-300 rounded-lg"
                        key={index}
                    >
                        <h1>{location.displayName}</h1>
                        <Link
                            className={`flex flex-col my-1 w-1/2 mx-auto`}
                            href={{
                                pathname: "/location",
                                query: {
                                    locationId: location.id,
                                },
                            }}>
                            <button
                                className={"bg-re-blue self-center rounded-md py-1 font-theinhardt-300 text-white text-lg w-full"}
                            >
                                Go to PDF
                            </button>

                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
