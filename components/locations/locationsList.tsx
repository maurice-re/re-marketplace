import { User, Location } from "@prisma/client";
import Link from "next/link";

export default function LocationsList({ locations, title, caption }: { locations: Location[]; title: string, caption: string; }) {

    return (
        <div className="justify-center items-center flex w-1/2 flex-col">
            <h1 className="pt-3 text-xl pb-4">{title}</h1>
            <h2 className="text-lg pb-4">{caption}</h2>
            <div className="grid gap-2 overflow-x-auto w-full pr-1 items-start grid-flow-col">
                {locations.map((location, index) => (
                    <Link
                        key={index}
                        className="flex flex-col items-center mx-1 mb-2 max-w-24 h-16 bg-re-dark-green-100 border-lg rounded-lg hover:bg-re-dark-green-200"
                        href={{
                            pathname: "/location",
                            query: {
                                locationId: location.id,
                            },
                        }}>
                        <button
                            className={"w-full h-full leading-tight p-2 overflow-y-auto"}
                        >
                            {location.displayName}
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
