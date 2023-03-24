"use client";
import Link from "next/link";
import { BiX } from "react-icons/bi";
import { FullLocation } from "../../app/server-store";

export default function LocationsList({ locations, title, caption, handleDelete, deleteDescription }: { locations: FullLocation[]; title: string, caption: string; handleDelete: ((location: FullLocation) => Promise<void>) | null; deleteDescription: string; }) {
    return (
        <div className="justify-center items-center flex w-1/2 flex-col">
            <h1 className="pt-3 text-xl pb-1">{title}</h1>
            <h2 className="leading-none text-lg pb-2">{caption}</h2>
            <div className="flex text-sm gap-1 items-center justify-center">
                {handleDelete ? (
                    <>
                        <h3>Click</h3>
                        <BiX
                            size={18}
                            className="text-white hover:text-red-600"
                        />
                        <h3>to {deleteDescription}.</h3>
                    </>
                ) : (
                    <>You have to be an owner to {deleteDescription}.</>
                )}
            </div>
            <div className="pt-4 grid gap-2 overflow-x-auto w-full pr-1 items-start grid-flow-col">
                {locations.map((location, index) => (
                    <div key={index} className="flex flex-col max-w-24 h-20 border-re-dark-green-100 border-2 text-white rounded-lg bg-re-dark-green-200">
                        {handleDelete && (<div className="flex justify-end mr-1 mt-1 text-xl">
                            <div className="tooltip tooltip-left" data-tip="Disconnect">
                                <BiX
                                    size={18}
                                    className="self-end cursor-pointer text-white hover:text-red-600"
                                    onClick={() => handleDelete(location)}
                                />
                            </div>
                        </div>)}
                        <Link
                            className={`${!handleDelete && "my-auto"} justify-center leading-none items-center flex`}
                            href={{
                                pathname: "/location",
                                query: {
                                    // TODO(Suhana): Investigate need to put string in owner field
                                    locationId: location.id,
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
