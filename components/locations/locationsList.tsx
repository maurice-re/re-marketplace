import { User, Location } from "@prisma/client";
import Link from "next/link";
import { BiX } from "react-icons/bi";

export default function LocationsList({ locations, title, caption, owned }: { locations: Location[]; title: string, caption: string; owned: boolean; }) {
    const handleDelete = async (locationId: string) => {
        const res = await fetch(`/api/locations/location?locationId=${locationId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        const { message } = await res.json();
        if (res.status != 200) {
            console.log("Delete location error: ", message);
        } else {
            console.log("Delete location success: ", message);
        }
    };
    return (
        <div className="justify-center items-center flex w-1/2 flex-col">
            <h1 className="pt-3 text-xl pb-4">{title}</h1>
            <h2 className="text-lg pb-4">{caption}</h2>
            <div className="grid gap-2 overflow-x-auto w-full pr-1 items-start grid-flow-col">
                {locations.map((location, index) => (
                    <div key={index} className="flex flex-col max-w-24 h-20 border-re-dark-green-100 border-2 text-white rounded-lg bg-re-dark-green-200">
                        <div className="flex justify-end mr-1 mt-1 text-xl">
                            <BiX
                                size={18}
                                className="self-end cursor-pointer text-white hover:text-red-600"
                                onClick={() => handleDelete(location.id)}
                            />
                        </div>
                        <Link
                            className="justify-center leading-none items-center flex"
                            href={{
                                pathname: "/location",
                                query: {
                                    // TODO(Suhana): Investigate need to put string in owner field
                                    locationId: location.id,
                                    owned: owned ? "owner" : "viewer"
                                },
                            }}>
                            <button
                                className={"pt-2 px-2 hover:text-re-green-500"}
                            >
                                {location.displayName}
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
